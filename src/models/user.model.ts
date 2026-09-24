export interface User{
    id: Number,
    nombre: string,
    email: string
}

export interface UserWithPassword extends User{
    password_hash: string;
}