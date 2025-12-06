import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Tariff } from '../models/tariff.model';

@Injectable({ providedIn: 'root' })
export class TariffsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/tariffs`;

  getTariffs(): Observable<Tariff[]> {
    return this.http.get<Tariff[]>(this.baseUrl);
  }

  updateTariff(tariff: Tariff): Observable<Tariff> {
    return this.http.put<Tariff>(`${this.baseUrl}/${tariff.id}`, tariff);
  }
}
