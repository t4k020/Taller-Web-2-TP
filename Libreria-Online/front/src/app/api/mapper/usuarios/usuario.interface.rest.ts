export interface Proveedor{
  id: number;       
  email: string;
  nombre: string;
  apellido: string; 
  tipo_usuario_id: number;
}

export interface Usuario {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  tipo_usuario: string; 
}