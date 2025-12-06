import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { ParkingSpot } from '../models/parking-spot.model';

@Injectable({ providedIn: 'root' })
export class ParkingService {
  private baseUrl = `${environment.apiUrl}/parking-spots`;

  private http = inject(HttpClient);

  getAll(): Observable<ParkingSpot[]> {
    return this.http.get<ParkingSpot[]>(this.baseUrl);
  }
}
