import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/users`;

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${user.id}`, user);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

}
