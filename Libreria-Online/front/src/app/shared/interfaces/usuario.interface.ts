export interface Proveedor{
  id: number;       
  email: string;
  nombre: string;
  apellido: string; 
  tipoUsuario: string;
}

//cambie el tipo usuario a number
export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  tipo_usuario_id: number; 
}