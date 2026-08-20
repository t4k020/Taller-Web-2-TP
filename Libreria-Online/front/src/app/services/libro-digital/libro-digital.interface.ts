export interface LibroDigitalAdquirido {
    id: number;
    comprador_id: number;
    libro_id: number;
    fecha_adquisicion: string;
    Libros: {
        id: number;
        nombre: string;
        isbn: string;
        autor: string;
        precio: number;
        archivoDigital: string;
    };
}
