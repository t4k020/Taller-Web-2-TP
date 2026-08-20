import { UsuarioRepository } from "../repository/usuario.repository.js";

export class UsuarioService {
  private usuarioRepository: UsuarioRepository;

  constructor(usuarioRepository: UsuarioRepository) {
    this.usuarioRepository = usuarioRepository;
  }

  public async obtenerProveedores() {
    return await this.usuarioRepository.obtenerProveedores();
  }

  async obtenerEmpleados() {
    return await this.usuarioRepository.findAllUsuarios();
  }

  async obtenerUsuariosRegistrados() {
    return await this.usuarioRepository.findAllUsuarios();
  }

  async iniciarSesion(email: string, contrasenia: string) {
    const usuario = await this.usuarioRepository.findByEmailAndContrasenia(
      email,
      contrasenia,
    );
    if (usuario != null) {
      return usuario;
    }
  }

  async crearUsuario(
    email: string,
    contrasena: string,
    nombre: string,
    apellido: string,
    direccion: string,
    tipo_usuario: number,
  ) {
    try {
      return await this.usuarioRepository.createUsuario(
        email,
        contrasena,
        nombre,
        apellido,
        direccion,
        tipo_usuario,
      );
    } catch (error: any) {
      if (
        error.message === "El correo electrónico ya se encuentra registrado."
      ) {
        throw new Error("EMAIL_DUPLICADO");
      }

      throw error;
    }
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
    const usuarioActualizado = await this.usuarioRepository.actualizarUsuario(id, datos);

    if (!usuarioActualizado) {
      throw new Error('USUARIO_NO_ENCONTRADO');
    }

    return usuarioActualizado;
  }

  async eliminarUsuario(id: number) {
    const resultado = await this.usuarioRepository.eliminarUsuario(id);

    if (!resultado) {
      throw new Error('USUARIO_NO_ENCONTRADO');
    }

    return resultado;
  }
}
