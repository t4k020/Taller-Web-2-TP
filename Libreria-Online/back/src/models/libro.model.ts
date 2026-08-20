import { CategoriaLibro } from '../prisma/enums.js';
 
export class Libro {
    id!: number;
    nombre!: string;
    isbn!: string;
    autor!: string;
    precio!: number;
    stock!: number;
    archivoDigital?: string;
    sinopsis!: string;
    imagenUrl?: string | null;
    categoria!: CategoriaLibro;
}

