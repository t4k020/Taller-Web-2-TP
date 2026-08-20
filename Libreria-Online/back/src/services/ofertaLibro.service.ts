import type { OfertaLibroRepository } from '../repository/ofertaLibro.repository.js';
import { EstadoOferta } from '../prisma/enums.js';
import { LibroService } from './libro.service.js';
import type { OfertaLibro } from '../models/ofertaLibro.model.js';
import { LibroRepository } from '../repository/libro.repository.js';



export class OfertaLibroService {

    constructor(
        private ofertaLibroRepository: OfertaLibroRepository, 
        private libroService: LibroService,
        private libroRepository: LibroRepository) {

    }


    async obtenerOfertas() {
        return await this.ofertaLibroRepository.obtenerTodasLasOfertas();
    }

    async obtenerOfertaPorId(id: number) {
        return await this.ofertaLibroRepository.obtenerOfertaPorId(id);

    }

   async crearOferta(oferta: OfertaLibro) {
        const { isbn,
            nombre, 
            autor,
            precioProveedor, 
            cantidadProveedor, 
            cantidadAdmin,
            proveedorId, 
            libroId, 
            categoria, 
            sinopsis, 
            imagenUrl,
            creadoPor} = oferta;
            const esAdmin = creadoPor === 'ADMIN';
        if (!isbn || !nombre || !autor || precioProveedor == null || cantidadProveedor == null || !categoria) {
            throw new Error('Faltan campos obligatorios para crear la oferta');
        }

        if (!proveedorId || Number.isNaN(Number(proveedorId))) {
            throw new Error('Falta el proveedor para crear la oferta');
        }

        if (Number(precioProveedor) < 0 || Number(cantidadProveedor) <= 0) {
        throw new Error('La cantidad debe ser mayor a 0 y el precio no puede ser negativo');
        }

        let precioFinal = Number(precioProveedor);


        if (esAdmin && libroId) {
        
            const libroExistente = await this.libroRepository.findLibroById(Number(libroId)); 
            
            if (libroExistente) {
                precioFinal = Number(libroExistente.precio); 
            } 
        }

        await this.ofertaLibroRepository.asegurarProveedor(Number(proveedorId));

        return await this.ofertaLibroRepository.crearOferta({ 
            isbn, 
            nombre, 
            autor, 
            precioProveedor: precioFinal,
            cantidadAdmin: esAdmin ? Number(cantidadProveedor) : 0, 
            cantidadProveedor: esAdmin ? 0 : Number(cantidadProveedor),
            estado: esAdmin ? EstadoOferta.ESPERANDO_PROVEEDOR : EstadoOferta.ESPERANDO_ADMIN,
            proveedorId: Number(proveedorId),
            libroId,
            categoria,
            sinopsis,
            imagenUrl,
            creadoPor: esAdmin ? 'ADMIN' : 'PROVEEDOR'
        });
    }

    async contraofertaAdmin(id: number, nuevaCantidad: number, nuevoPrecio?: number) {
        if (nuevaCantidad <= 0) throw new Error('La cantidad debe ser mayor a 0');
        if (nuevoPrecio !== undefined && nuevoPrecio <= 0) throw new Error('El precio debe ser mayor a 0');

        return await this.ofertaLibroRepository.actualizarOferta(id, {
            cantidadAdmin: nuevaCantidad,
            ...(nuevoPrecio !== undefined ? { precioAdmin: nuevoPrecio } : {}),
            estado: EstadoOferta.ESPERANDO_PROVEEDOR 
        });
    }

    async contraofertaProveedor(id: number, nuevaCantidad: number, nuevoPrecio?: number) {
        if (nuevaCantidad <= 0) throw new Error('La cantidad debe ser mayor a 0');
        if (nuevoPrecio !== undefined && nuevoPrecio <= 0) throw new Error('El precio debe ser mayor a 0');

        return await this.ofertaLibroRepository.actualizarOferta(id, {
            cantidadProveedor: nuevaCantidad,
            ...(nuevoPrecio !== undefined ? { precioProveedor: nuevoPrecio, precioAdmin: null } : {}),
            estado: EstadoOferta.ESPERANDO_ADMIN
        });
    }

    async aceptarOferta(id: number) {
       
        const oferta = await this.ofertaLibroRepository.obtenerOfertaPorId(id);

        if (!oferta) {
            throw new Error('La oferta no existe');
        }

        let cantidadFinal = 0;
        let precioFinal = oferta.precioProveedor;

        if (oferta.estado === EstadoOferta.ESPERANDO_ADMIN) {
            cantidadFinal = oferta.cantidadProveedor;

        } else if (oferta.estado === EstadoOferta.ESPERANDO_PROVEEDOR) {
            cantidadFinal = oferta.cantidadAdmin!; 
            precioFinal = oferta.precioAdmin ?? oferta.precioProveedor;
        } else {
            throw new Error('La oferta ya fue cerrada o no se puede aceptar en este estado');
        }

        const precioConMargen = Number((precioFinal.toNumber() * 1.1).toFixed(2));

        const libroExistente = await this.libroService.obtenerLibroPorIsbn(oferta.isbn);

        if (libroExistente) {
            await this.libroService.sumarStockYActualizarPrecio(libroExistente.id, cantidadFinal, precioConMargen);
        } else {
            await this.libroService.crearLibro({
                id: 0,
                isbn: oferta.isbn,
                nombre: oferta.nombre,
                autor: oferta.autor,
                precio: precioConMargen,
                stock: cantidadFinal,
                categoria:oferta.categoria,
                sinopsis: oferta.sinopsis || "",
                imagenUrl: oferta.imagenUrl,
            });
        }

        return await this.ofertaLibroRepository.actualizarOferta(id, {
            estado: EstadoOferta.ACEPTADA 
        });
    }

    async rechazarOferta(id: number) {
        const oferta = await this.ofertaLibroRepository.obtenerOfertaPorId(id);

        if (!oferta) {
            throw new Error('La oferta no existe');
        }

        return await this.ofertaLibroRepository.actualizarOferta(id, {
            estado: EstadoOferta.RECHAZADA
        });
    }

    async eliminarLibro(id: number) {

            try {
                await this.ofertaLibroRepository.eliminarOferta(id);
                return { message: 'Oferta eliminada correctamente' };
            } catch (error:any) {
                if (error.code === 'P2025') {
                    throw new Error('Oferta no encontrada. No se pudo eliminar.');
                }
                throw new Error('Error al eliminar la oferta: ' + error.message);
            }
        }

   
}
