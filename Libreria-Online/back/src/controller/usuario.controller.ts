import { type Request, type Response } from "express";
import { UsuarioRepository } from "../repository/usuario.repository";
import { UsuarioService } from "../services/usuario.service";

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);

//por ahora hay dos services usuario que hay que juntar

export class UsuarioController {
  constructor() {}

  public obtenerUsuariosRegistrados = async (_req: Request, res: Response) => {
    try {
      const usuarios = await usuarioService.obtenerUsuariosRegistrados();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los usuarios", error });
    }
  };

  public iniciarSesion = async (req: Request, res: Response) => {
    try {
      const { email, contrasena } = req.body;

      const usuario = await usuarioService.iniciarSesion(email, contrasena);

      if (!usuario) {
        return res.status(401).json({ message: "Credenciales inválidas" });
      }

      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ message: "Error al iniciar sesion", error });
    }
  };

  public crearUsuario = async (req: Request, res: Response) => {
    try {
      const { email, contrasena, nombre, apellido, direccion, tipo_usuario } =
        req.body;
      const usuario = await usuarioService.crearUsuario(
        email,
        contrasena,
        nombre,
        apellido,
        direccion,
        tipo_usuario,
      );
      if (!usuario) {
        return res.status(401).json({ message: "Error al crear el usuario" });
      }

      res.status(200).json(usuario);
    } catch (error: any) {
      if (error.message === "EMAIL_DUPLICADO") {
        return res.status(409).json({ message: "El email ya está en uso." });
      }

      return res.status(500).json({ message: "Error interno del servidor." });
    }
  };

  public actualizarUsuario = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { nombre, apellido, direccion, tipo_usuario_id } = req.body;

      if (
        Number.isNaN(id) ||
        !nombre ||
        !apellido ||
        !direccion ||
        tipo_usuario_id === undefined ||
        tipo_usuario_id === null
      ) {
        return res.status(400).json({ message: "Datos inválidos" });
      }

      const usuario = await usuarioService.actualizarUsuario(id, {
        nombre,
        apellido,
        direccion,
        tipo_usuario_id: Number(tipo_usuario_id),
      });

      return res.status(200).json(usuario);
    } catch (error: any) {
      if (error.message === "USUARIO_NO_ENCONTRADO") {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (error.message === 'USUARIO_ADMIN_PROTEGIDO') {
        return res.status(403).json({ message: 'Los usuarios administradores no se pueden modificar.' });
      }

      return res.status(500).json({ message: "Error al actualizar el usuario", error });
    }
  };

  public eliminarUsuario = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: "ID inválido" });
      }

      await usuarioService.eliminarUsuario(id);
      return res.status(200).json({ message: "Usuario eliminado correctamente" });
    } catch (error: any) {
      if (error.message === 'USUARIO_NO_ENCONTRADO' || error.code === 'P2025') {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      if (error.message === 'USUARIO_ADMIN_PROTEGIDO') {
        return res.status(403).json({ message: 'Los usuarios administradores no se pueden eliminar.' });
      }

      if (error.message === 'TIPO_INACTIVO_NO_ENCONTRADO') {
        return res.status(500).json({ message: 'No existe el tipo de usuario INACTIVO en la base de datos.' });
      }

      return res.status(500).json({ message: "Error al eliminar el usuario", error });
    }
  };
}
