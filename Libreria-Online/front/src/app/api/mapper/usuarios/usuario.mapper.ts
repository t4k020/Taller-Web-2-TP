import { Proveedor, Usuario } from '../../../shared/interfaces/usuario.interface';

export class ProveedorMapper {
  

  public static mapRestUsuarioToProveedorFront(rest: Usuario): Proveedor {
    return {
      id: rest.id,
      email: rest.email,
      nombre: rest.nombre,
      apellido: rest.apellido, 
      tipoUsuario: rest.tipo_usuario_id === 2 ? 'PROVEEDOR' : 'USUARIO'
    };
  }


  public static mapRestUsuarioArrayToProveedorArrayFront(restArray: Usuario[]): Proveedor[] {
    if (!restArray) return [];
    return restArray.map(rest => this.mapRestUsuarioToProveedorFront(rest));
  }
}
