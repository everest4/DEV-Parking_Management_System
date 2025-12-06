import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';


@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl = `${environment.apiUrl}/users`;

  private http = inject(HttpClient)

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
}
