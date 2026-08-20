import { Request, Response } from "express";
import { OfertaLibroService } from "../services/ofertaLibro.service.js";
import { OfertaLibroRepository } from "../repository/ofertaLibro.repository.js";
import { LibroService } from "../services/libro.service.js";
import { LibroRepository } from "../repository/libro.repository.js";
import { OfertaLibro } from "../models/ofertaLibro.model.js";

const libroRepository = new LibroRepository();
const libroService = new LibroService(libroRepository);

const ofertaLibroRepository = new OfertaLibroRepository();

const ofertaLibroService = new OfertaLibroService(
  ofertaLibroRepository,
  libroService,
  libroRepository
);

export class OfertaLibroController {
  constructor() {
    // Constructor vacío
  }

  public getOfertas = async (req: Request, res: Response) => {
    try {
      const ofertas = await ofertaLibroService.obtenerOfertas();
      res
        .status(200)
        .json({ message: "Ofertas obtenidas correctamente", data: ofertas });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener las ofertas", errorDetails: error });
    }
  };

  public getOfertaPorId = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);
      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "ID inválido. Debe ser un número." });
      }
      const oferta = await ofertaLibroService.obtenerOfertaPorId(id);
      if (!oferta) {
        return res.status(404).json({ error: "Oferta no encontrada" });
      }
      res
        .status(200)
        .json({ message: "Oferta obtenida correctamente", data: oferta });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener la oferta por ID",
        errorDetails: error,
      });
    }
  };

  public createOferta = async (req: Request, res: Response) => {
    try {
      const newOferta: OfertaLibro = req.body;
      const oferta = await ofertaLibroService.crearOferta(newOferta);
      res
        .status(201)
        .json({ message: "Oferta creada correctamente", data: oferta });
    } catch (error: any) {
      const validationMessages = [
        "Faltan campos obligatorios para crear la oferta",
        "Falta el proveedor para crear la oferta",
        "El usuario no existe o no es proveedor",
        "La cantidad debe ser mayor a 0 y el precio no puede ser negativo",
      ];

      res
        .status(validationMessages.includes(error.message) ? 400 : 500)
        .json({
          error: "Error al crear la oferta",
          errorDetails: error.message ?? error,
        });
    }
  };

  public contraofertaAdmin = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nuevaCantidad, nuevoPrecio } = req.body;

      if (isNaN(id) || !nuevaCantidad) {
        return res
          .status(400)
          .json({ error: "Faltan datos o el ID es inválido" });
      }
      const ofertaActualizada = await ofertaLibroService.contraofertaAdmin(
        id,
        nuevaCantidad,
        nuevoPrecio,
      );
      res.status(200).json({
        message: "Contraoferta enviada al proveedor",
        data: ofertaActualizada,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al enviar la contraoferta",
        errorDetails: error,
      });
    }
  };

  public contraofertaProveedor = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nuevaCantidad, nuevoPrecio } = req.body;
      if (isNaN(id) || !nuevaCantidad) {
        return res
          .status(400)
          .json({ error: "Faltan datos o el ID es inválido" });
      }
      const ofertaActualizada = await ofertaLibroService.contraofertaProveedor(
        id,
        nuevaCantidad,
        nuevoPrecio
      );
      res.status(200).json({
        message: "Contraoferta enviada al administrador",
        data: ofertaActualizada,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al enviar la contraoferta",
        errorDetails: error,
      });
    }
  };

  public aceptarOferta = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }
      const ofertaAceptada = await ofertaLibroService.aceptarOferta(id);
      res.status(200).json({
        message: "Oferta aceptada y stock actualizado",
        data: ofertaAceptada,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al aceptar la oferta", errorDetails: error });
    }
  };

  public rechazarOferta = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido" });
      }

      const ofertaRechazada = await ofertaLibroService.rechazarOferta(id);
      res.status(200).json({
        message: "Oferta rechazada correctamente",
        data: ofertaRechazada,
      });
    } catch (error: any) {
      res
        .status(error.message === "La oferta no existe" ? 404 : 500)
        .json({
          error: "Error al rechazar la oferta",
          errorDetails: error.message ?? error,
        });
    }
  };

  public eliminarOferta = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "ID inválido. Debe ser un número." });
    }
    try {
      await ofertaLibroService.eliminarLibro(id);
      res.status(200).json({ message: "Oferta eliminada correctamente" });
    } catch (error: any) {
      if (error.message === "Libro no encontrado. No se pudo eliminar.") {
        return res
          .status(404)
          .json({ error: "Libro no encontrado. No se pudo eliminar." });
      }
      res
        .status(500)
        .json({ error: "Error al eliminar el libro", errorDetails: error });
    }
  };
}
