export interface CategoryByID {
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
    category:            Category;
}

export interface Category {
    id:   number;
    name: string;
}
