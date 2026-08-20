import { Router } from "express";
import { UsuarioController } from "../../controller/usuario.controller.js";
import { ProveedorController } from "../../controller/proveedor.controller.js";

const ProveedorRouter = Router();

const proveedorController = new ProveedorController();

ProveedorRouter.get(
  "/",
  proveedorController.getProveedores.bind(proveedorController),
);
export default ProveedorRouter;