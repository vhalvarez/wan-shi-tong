export interface Book {
    id:                  number;
    titulo:              string;
    autor:               string;
    isbn:                string;
    anio_publicacion:    number;
    cantidad_disponible: number;
    cantidad_total:      number;
    portada:             string;
    categoryId:          number;
    category:            string;
}
