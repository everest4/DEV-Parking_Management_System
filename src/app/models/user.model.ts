export interface User {
  id: string;
  name: string;
  surname?: string;
  email: string;
  username: string;
  password: string;
  role: 'admin' | 'staff' | 'manager';
}
