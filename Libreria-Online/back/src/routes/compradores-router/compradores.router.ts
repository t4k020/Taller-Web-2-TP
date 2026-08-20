import { Router } from "express";
import { UsuarioController } from "../../controller/usuario.controller.js";
import { CompradorController } from "../../controller/comprador.controller.js";

const compradorRouter = Router();

const compradorController = new CompradorController();

compradorRouter.get(
  "/",
  compradorController.getCompradores.bind(compradorController),
);

compradorRouter.post(
  "/agregarProducto",
  compradorController.agregarProductoAlCarrito.bind(compradorController),
);

compradorRouter.post(
  "/borrarProducto",
  compradorController.borrarProductoDelCarrito.bind(compradorController),
);

compradorRouter.post(
  "/descontarProducto",
  compradorController.descontarProductosCarrito.bind(compradorController),
);

compradorRouter.post(
  "/procesarPago",
  compradorController.comprarProductos.bind(compradorController),
);

compradorRouter.get(
  "/carrito/:comprador_id",
  compradorController.obtenerCarritoComprador.bind(compradorController),
);

export default compradorRouter;
