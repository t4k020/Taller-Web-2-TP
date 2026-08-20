import { prisma } from '../prisma.js';
import { CategoriaLibro, EstadoOferta } from '../prisma/enums.js';

export class OfertaLibroRepository {
    async asegurarProveedor(proveedorId: number) {
        const usuario = await prisma.usuarios.findUnique({
            where: { id: proveedorId },
            select: { id: true, tipo_usuario_id: true },
        });

        if (!usuario || usuario.tipo_usuario_id !== 2) {
            throw new Error('El usuario no existe o no es proveedor');
        }

        await prisma.proveedores.upsert({
            where: { usuario_id: proveedorId },
            update: {},
            create: { usuario_id: proveedorId },
        });
    }
    
    async crearOferta(data: {
        nombre: string; 
        isbn: string; 
        autor: string; 
        precioProveedor: number; 
        precioAdmin?: number | null;
        cantidadProveedor: number; 
        cantidadAdmin: number;
        estado: EstadoOferta;
        proveedorId: number;
        libroId?: number | null, 
        categoria: CategoriaLibro, 
        sinopsis: string | null, 
        imagenUrl?: string | null,
        creadoPor?: string}) {
        return await prisma.ofertaLibro.create({ data });
    }

    async obtenerOfertaPorId(id: number) {
            const oferta = await prisma.ofertaLibro.findUnique({
                where: { id : id }
            });

            return oferta;
            }

    async obtenerTodasLasOfertas() {
        const ofertas = await prisma.ofertaLibro.findMany({
  
            include: {
                Libro: true 
            }
        });
        return ofertas;
    }

    async actualizarOferta(id: number, data: { 
    cantidadProveedor?: number; 
    cantidadAdmin?: number; 
    precioProveedor?: number;
    precioAdmin?: number | null;
    estado?: EstadoOferta; 
    }) {
    return await prisma.ofertaLibro.update({
        where: { id },
        data
    });
    }   

         async eliminarOferta(id: number) {
        return await prisma.ofertaLibro.delete({    
            where: { id: id }
        });
    }

    /*
    async obtenerOfertasPorProveedor(proveedorId: number) {
        return await prisma.ofertaLibro.findMany({
            where: { proveedorId: proveedorId },
            include: { Libro: true } 
        });
    }*/
}
