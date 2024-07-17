export interface User {
    id:             number;
    name:           string;
    email:          string;
    fecha_registro: Date;
    roles:          string[];
    token: string;
}
