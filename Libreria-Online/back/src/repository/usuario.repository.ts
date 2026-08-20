import { prisma } from "../prisma.js";

export class UsuarioRepository {
  private async obtenerTipoUsuarioIdPorNombre(nombre: string): Promise<number | null> {
    const tipoUsuario = await prisma.tiposUsuario.findFirst({
      where: { nombre },
      select: { id: true },
    });

    return tipoUsuario?.id ?? null;
  }

  async obtenerProveedores(): Promise<any[]> {
    const proveedores = await prisma.usuarios.findMany({
      where: {
        tipo_usuario_id: 2,
      },
    });

    return proveedores;
  }
  async obtenerProveedorPrevioPorIsbn(isbn: string): Promise<number | null> {
    const ofertaPrevia = await prisma.ofertaLibro.findFirst({
      where: {
        isbn: isbn,
        // Opcional: podés filtrar por estado si solo querés las 'ACEPTADA'
      },
      select: {
        proveedorId: true,
      },
    });

    return ofertaPrevia ? ofertaPrevia.proveedorId : null;
  }

  async findAllUsuarios() {
    const tipoInactivoId = await this.obtenerTipoUsuarioIdPorNombre("INACTIVO");

    const usuarios = await prisma.usuarios.findMany({
      where: tipoInactivoId
        ? {
            tipo_usuario_id: {
              not: tipoInactivoId,
            },
          }
        : undefined,
      select: {
        id: true,
        email: true,
        nombre: true,
        apellido: true,
        direccion: true,
        tipo_usuario_id: true,
        TipoUsuario: {
          select: {
            nombre: true,
          },
        },
      },
    });

    return usuarios.map((usuario) => ({
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      direccion: usuario.direccion,
      tipo_usuario_id: usuario.tipo_usuario_id,
      tipo_usuario_descripcion: usuario.TipoUsuario.nombre,
    }));
  }

  async findByEmailAndContrasenia(email: string, contrasenia: string) {
    const tipoInactivoId = await this.obtenerTipoUsuarioIdPorNombre("INACTIVO");

    const usuario = await prisma.usuarios.findFirst({
      where: {
        email: email,
        contrasena: contrasenia,
        ...(tipoInactivoId
          ? {
              tipo_usuario_id: {
                not: tipoInactivoId,
              },
            }
          : {}),
      },
    });

    return usuario;
  }

  async createUsuario(
    email: string,
    contrasena: string,
    nombre: string,
    apellido: string,
    direccion: string,
    tipo_usuario: number,
  ) {
    const esProveedor = tipo_usuario === 2;
    const relacionPorTipo = esProveedor
      ? { Proveedores: { create: {} } }
      : { Compradores: { create: { Carrito: { create: {} } } } };

    try {
      return await prisma.usuarios.create({
        data: {
          email,
          contrasena,
          nombre,
          apellido,
          direccion,
          tipo_usuario_id: tipo_usuario,
          ...relacionPorTipo,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        throw new Error("El correo electrónico ya se encuentra registrado.");
      }
      throw error;
    }
  }

  async createProveedor(id_usuario: number) {
    return await prisma.listaProveedor.create({
      data: {
        usuario_id: id_usuario,
        es_proveedor: false,
      },
    });
  }

  async actualizarUsuario(
    id: number,
    datos: {
      nombre: string;
      apellido: string;
      direccion: string;
      tipo_usuario_id: number;
    },
  ) {
    const usuarioActual = await prisma.usuarios.findUnique({
      where: { id },
      select: { tipo_usuario_id: true },
    });

    if (!usuarioActual) {
      return null;
    }

    if (usuarioActual.tipo_usuario_id === 1) {
      throw new Error('USUARIO_ADMIN_PROTEGIDO');
    }

    return await prisma.$transaction(async (tx) => {
      if (usuarioActual.tipo_usuario_id !== datos.tipo_usuario_id) {
        if (datos.tipo_usuario_id === 1) {
          await tx.administradores.upsert({
            where: { usuario_id: id },
            update: {},
            create: { usuario_id: id },
          });
        }

        if (datos.tipo_usuario_id === 2) {
          await tx.proveedores.upsert({
            where: { usuario_id: id },
            update: {},
            create: { usuario_id: id },
          });
        }

        if (datos.tipo_usuario_id === 3) {
          await tx.compradores.upsert({
            where: { usuario_id: id },
            update: {},
            create: {
              usuario_id: id,
              Carrito: {
                create: {},
              },
            },
          });
        }
      }

      return await tx.usuarios.update({
        where: { id },
        data: {
          nombre: datos.nombre,
          apellido: datos.apellido,
          direccion: datos.direccion,
          tipo_usuario_id: datos.tipo_usuario_id,
        },
      });
    });
  }

  async eliminarUsuario(id: number) {
    const tipoInactivoId = await this.obtenerTipoUsuarioIdPorNombre("INACTIVO");

    if (!tipoInactivoId) {
      throw new Error('TIPO_INACTIVO_NO_ENCONTRADO');
    }

    const usuarioActual = await prisma.usuarios.findUnique({
      where: { id },
      select: { tipo_usuario_id: true },
    });

    if (!usuarioActual) {
      return null;
    }

    if (usuarioActual.tipo_usuario_id === 1) {
      throw new Error('USUARIO_ADMIN_PROTEGIDO');
    }

    return await prisma.usuarios.update({
      where: { id },
      data: { tipo_usuario_id: tipoInactivoId },
    });
  }
}
