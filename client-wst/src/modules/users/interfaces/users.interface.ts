export interface User {
    id:             number;
    name:           string;
    email:          string;
    cedula:         string;
    fecha_registro: Date;
    active:         boolean;
    roles:          Roles;
}

export enum Roles {
    Administrador = "Administrador",
    Estudiante = "Estudiante",
}
