export interface Fines {
    id:          number;
    monto:       number;
    pagada:      boolean;
    fecha_multa: Date;
    userId:      number;
    user:        User;
}

interface User {
    id:             number;
    name:           string;
    email:          string;
    cedula:         string;
    password:       string;
    fecha_registro: Date;
    active:         boolean;
}
