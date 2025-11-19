import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tariff } from '../models/tariff.model';

@Injectable({ providedIn: 'root' })
export class TariffsService {

  private baseUrl = `${environment.apiUrl}/tariffs`;

  constructor(private http: HttpClient) {}

  getTariffs(): Observable<Tariff[]> {
    return this.http.get<Tariff[]>(this.baseUrl);
  }

  updateTariff(tariff: Tariff): Observable<Tariff> {
    return this.http.put<Tariff>(`${this.baseUrl}/${tariff.id}`, tariff);
  }
}
