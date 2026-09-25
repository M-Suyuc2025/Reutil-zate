export interface User {
  id: number;
  name: string;
  email: string;
}

export interface UserWithPassword extends User {
  password: string;
}