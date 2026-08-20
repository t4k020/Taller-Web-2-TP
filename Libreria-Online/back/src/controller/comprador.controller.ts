import { type Request, type Response } from "express";
import { prisma } from "../prisma.js";
import { CompradorRepository } from "../repository/comprador.repository.js";

import { CarritoRepository } from "../repository/carrito.repository.js";
import { LibroDigitalRepository } from "../repository/libro-digital.repository.js";
import { LibroRepository } from "../repository/libro.repository.js";
import { TransaccionRepository } from "../repository/transaccion.repository.js";
import { CompradorService } from "../services/comprador.service.js";

const compradorRepository = new CompradorRepository();
const carritoRepository = new CarritoRepository();
const libroRepository = new LibroRepository();
const transaccionRepository = new TransaccionRepository();
const libroDigitalRepository = new LibroDigitalRepository();
const compradorService = new CompradorService(
  compradorRepository,
  libroRepository,
  carritoRepository,
  transaccionRepository,
  libroDigitalRepository,
);

export class CompradorController {
  constructor() {}

  public getCompradores = async (req: Request, res: Response) => {
    try {
      const compradores = await compradorService.obtenerCompradores();

      res.status(200).json(compradores);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener los compradores", error });
    }
  };

  public agregarProductoAlCarrito = async (req: Request, res: Response) => {
    try {
      const { comprador_id, libro_id, cantidad, es_digital } = req.body;
      const producto = await compradorService.agregarProducto(
        comprador_id,
        libro_id,
        cantidad,
        Boolean(es_digital),
      );

      res.status(200).json(producto);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  public descontarProductosCarrito = async (req: Request, res: Response) => {
    try {
      const { comprador_id, libro_id, cantidad } = req.body;

      const producto = await compradorService.descontarProducto(
        comprador_id,
        libro_id,
        cantidad,
      );

      res.status(200).json(producto);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los producto", error });
    }
  };

  public borrarProductoDelCarrito = async (req: Request, res: Response) => {
    try {
      const { comprador_id, libro_id, es_digital } = req.body;
      const producto = await compradorService.borrarProducto(
        comprador_id,
        libro_id,
        Boolean(es_digital),
      );

      res.status(200).json(producto);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los producto", error });
    }
  };

  public comprarProductos = async (req: Request, res: Response) => {
    try {
      const { comprador_id } = req.body;

      const compra = await compradorService.procesarAbono(comprador_id);

      res.status(200).json(compra);
    } catch (error: any) {
      if (error.message === "Carrito vacio.") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({
        message: "Error al realizar la transacción",
        error: error.message,
      });
    }
  };

  public obtenerCarritoComprador = async (req: Request, res: Response) => {
    try {
      const comprador_id: number = Number(req.params.comprador_id);

      if (isNaN(comprador_id)) {
        return res.status(400).json("ID inválido");
      }
      const carrito = await compradorService.obtenerCarrito(comprador_id);

      res.status(200).json(carrito);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al obtener carrito del comprador", error });
    }
  };
}
