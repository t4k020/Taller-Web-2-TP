import { type Request, type Response } from "express";
import { UsuarioRepository } from "../repository/usuario.repository";
import { prisma } from "../prisma";
import { UsuarioService } from "../services/usuario.service";

const usuarioRepository = new UsuarioRepository();
const usuarioService = new UsuarioService(usuarioRepository);

//por ahora hay dos services usuario que hay que juntar

export class ProveedorController {
  constructor() {}

    public getProveedores = async (req: Request, res: Response) => {
      try {
        const proveedores = await usuarioService.obtenerProveedores();
        const isbn = req.query.isbn as string;
        let proveedorSugeridoId = null;

        if (isbn) {
        proveedorSugeridoId = await usuarioRepository.obtenerProveedorPrevioPorIsbn(isbn);
      }
    
        return res.status(200).json({
          proveedores: proveedores,
          proveedorSugeridoId: proveedorSugeridoId
        });
         } catch (error) {
        return res.status(500).json({ message: "Error interno del servidor" });
        }
    };

  
}
