export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'staff' | 'viewer';
  password?: string; 
}
