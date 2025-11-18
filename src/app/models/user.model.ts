export interface User {
  id?: number;        // optional, JSON-server will generate it
  username: string;   // username for login
  password: string;   // password for login
  role: 'admin' | 'user';  // user role
}
