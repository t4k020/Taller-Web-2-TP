import { Router } from "express";
import { UsuarioController } from "../../controller/usuario.controller.js";

const usuarioRouter = Router();

const usuarioController = new UsuarioController();

usuarioRouter.get("/", usuarioController.obtenerUsuariosRegistrados.bind(usuarioController));
usuarioRouter.put("/:id", usuarioController.actualizarUsuario.bind(usuarioController));
usuarioRouter.delete("/:id", usuarioController.eliminarUsuario.bind(usuarioController));

usuarioRouter.post(
  "/iniciarSesion",
  usuarioController.iniciarSesion.bind(usuarioController),
);
usuarioRouter.post(
  "/registrarse",
  usuarioController.crearUsuario.bind(usuarioController),
);

export default usuarioRouter;
