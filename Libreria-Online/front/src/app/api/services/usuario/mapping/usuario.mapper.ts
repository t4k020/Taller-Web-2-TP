

import { UsuarioPrueba } from "../../../../modules/usuario/usuario.interface";
import { UsuarioRest } from "./usuario.interface.rest";

export class UsuarioMapper{

    static mapRestUsuarioToUsuarioFront(usuarioRest: UsuarioRest): UsuarioPrueba{
        return{
            id: usuarioRest.id,
            email: usuarioRest.email,
            contrasena: usuarioRest.contrasena,
            nombre: usuarioRest.nombre,
            apellido: usuarioRest.apellido,
            direccion: usuarioRest.direccion,
            tipo_usuario_id: usuarioRest.tipo_usuario
        }
    }

    static mapRestUsuarioArrayToUsuarioArrayFront(usuarioRest: UsuarioRest[]): UsuarioPrueba []{
          return usuarioRest.map(this.mapRestUsuarioToUsuarioFront);
    }
}