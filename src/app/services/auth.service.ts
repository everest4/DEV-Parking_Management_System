import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:3001/users';

  private http = inject(HttpClient);
  private router = inject(Router);

  login(email: string, password: string): Observable<User | null> {
    return this.http
      .get<User[]>(`${this.apiUrl}?email=${email}`)
      .pipe(
        map(users => {
          const user = users[0];

          if (user && user.password === password) {
            localStorage.setItem('user', JSON.stringify(user));
            return user;
          }

          return null;
        })
      );
  }

  logout() {
    localStorage.removeItem('user');
    this.router.navigate(['/']);
  }

  getLoggedUser(): User | null {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  }
}
