import { type Request, type Response } from "express";
import { LibroService } from "../services/libro.service.js";
import { LibroRepository } from "../repository/libro.repository.js";
import { Libro } from "../models/libro.model.js";

const libroRepository = new LibroRepository();
const libroService = new LibroService(libroRepository);

export class LibroController {
  constructor() {
    // Constructor vacío
  }

  public getLibros = async (req: Request, res: Response) => {
    try {
      const libros = await libroService.obtenerLibros();
      res
        .status(200)
        .json({ message: "Libros obtenidos correctamente", data: libros });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener los libros", errorDetails: error });
    }
  };

  public getLibroPorId = async (req: Request, res: Response) => {
    try {
      const id: number = Number(req.params.id);

      if (isNaN(id)) {
        return res
          .status(400)
          .json({ error: "ID inválido. Debe ser un número." });
      }

      const libro = await libroService.obtenerLibroPorId(id);

      if (!libro) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res
        .status(200)
        .json({ message: "Libro obtenido correctamente", data: libro });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener el libro por ID",
        errorDetails: error,
      });
    }
  };

  public getLibroPorIsbn = async (req: Request, res: Response) => {
    try {
      const isbn = String(req.params.isbn ?? "").trim();

      if (!isbn) {
        return res.status(400).json({ error: "ISBN invalido." });
      }

      const libro = await libroService.obtenerLibroPorIsbn(isbn);

      if (!libro) {
        return res.status(404).json({ error: "Libro no encontrado" });
      }

      res
        .status(200)
        .json({ message: "Libro obtenido correctamente", data: libro });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener el libro por ISBN",
        errorDetails: error,
      });
    }
  };

  public createLibro = async (req: Request, res: Response) => {
    try {
      const newLibro: Libro = req.body;

      const libro = await libroService.crearLibro(newLibro);

      res
        .status(201)
        .json({ message: "Libro creado correctamente", data: libro });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al crear el libro", errorDetails: error });
    }
  };

  public editarLibro = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);
    const { nombre, autor, isbn, precio, categoria, sinopsis }: Libro =
      req.body;

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "ID inválido. Debe ser un número." });
    }
    try {
      const libroActualizado = await libroService.actualizarLibro(id, {
        nombre,
        autor,
        isbn,
        precio,
        categoria,
        sinopsis,
      });
      res.status(200).json({
        message: "Libro actualizado correctamente",
        data: libroActualizado,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al actualizar el libro", errorDetails: error });
    }
  };

  public eliminarLibro = async (req: Request, res: Response) => {
    const id: number = Number(req.params.id);

    if (isNaN(id)) {
      return res
        .status(400)
        .json({ error: "ID inválido. Debe ser un número." });
    }
    try {
      await libroService.eliminarLibro(id);
      res.status(204).send();
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

  public getLibrosConStock = async (req: Request, res: Response) => {
    try {
      const libros = await libroService.obtenerLibrosConStock();

      res
        .status(200)
        .json({ message: "Libros obtenidos correctamente", data: libros });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error al obtener los libros", errorDetails: error });
    }
  };
}
