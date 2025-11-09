import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  constructor(private http: HttpClient) {}

  // Fetch all parking lots
  getLots(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/lots`);
  }

  // Fetch all parking spots
  getSpots(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/spots`);
  }

  // Fetch all tariffs
  getTariffs(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/tariffs`);
  }
}
