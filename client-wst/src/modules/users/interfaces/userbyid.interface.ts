export interface UserByID {
    id:             number;
    name:           string;
    email:          string;
    cedula:         string;
    password:       string;
    fecha_registro: Date;
    active:         boolean;
    roles:          string[];
    loans:          Loan[];
    fines:          Fine[];
}

export interface Fine {
    id:          number;
    monto:       number;
    pagada:      boolean;
    fecha_multa: Date;
    userId:      number;
}

export interface Loan {
    id:               number;
    fecha_prestamo:   Date;
    fecha_devolucion: null;
    estado:           string;
    userId:           number;
    bookId:           number;
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
    category:            string;
}
