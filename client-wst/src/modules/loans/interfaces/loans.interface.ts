export interface Loan {
    id:               number;
    fecha_prestamo:   Date;
    fecha_devolucion?: Date;
    estado:           string;
    userId:           number;
    bookId:           number;
    user:             User;
    book:             Book;
}

export interface Book {
    id:                  number;
    titulo:              string;
    autor:               string;
    isbn:                string;
    anio_publicacion:    number;
    cantidad_disponible: number;
    cantidad_total:      number;
    portada:             string;
    descripcion:         string;
    categoryId:          number;
}

export interface User {
    id:             number;
    name:           string;
    email:          string;
    cedula:         string;
    fecha_registro: Date;
}
