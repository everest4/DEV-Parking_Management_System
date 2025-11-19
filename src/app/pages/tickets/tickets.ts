import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

interface Tariff {
  id: number;
  min: number;    // min minutes (inclusive, or boundary)
  max: number;    // max minutes
  price: number;  // LEK
}

interface OccupiedSpotVM {
  spot: any;
  minutes: number;
  price: number;
}

@Component({
  standalone: true,
  selector: 'app-tickets',
  templateUrl: './tickets.html',
  styleUrls: ['./tickets.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TicketsPage implements OnInit {

  occupiedSpots: OccupiedSpotVM[] = [];
  tariffs: Tariff[] = [];

  loading = true;
  error = '';
  generatedTickets: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadData();
  }

  // Load tariffs then spots
  loadData() {
    this.http.get<Tariff[]>(`${environment.apiUrl}/tariffs`).subscribe({
      next: tariffsRes => {
        // sort by min minutes just in case
        this.tariffs = tariffsRes.sort((a, b) => a.min - b.min);

        // now load spots
        this.http.get<any[]>(`${environment.apiUrl}/spots`).subscribe({
          next: spotsRes => {
            const occupied = spotsRes.filter(s => s.status === 'Occupied');
            this.occupiedSpots = occupied.map(spot => {
              const minutes = this.getElapsedMinutes(spot.id);
              const price = this.calculatePrice(minutes);
              return { spot, minutes, price };
            });
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to load spots';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Failed to load tariffs';
        this.loading = false;
      }
    });
  }

  // Read start time from localStorage (set in Home page timers)
  getElapsedMinutes(spotId: number): number {
    const key = `timer_${spotId}`;
    const start = Number(localStorage.getItem(key));

    if (!start) return 0;

    const ms = Date.now() - start;
    return Math.floor(ms / 60000); // minutes
  }

  // Use tariffs from db.json to compute price
  calculatePrice(minutes: number): number {
    // 0–10 min free logic from your description
    // and then apply banded tariffs

    // find the FIRST tariff where minutes is in (min, max]
    const match = this.tariffs.find(t => minutes > t.min && minutes <= t.max);

    if (match) return match.price;

    // if beyond all defined bands, use the highest one
    if (this.tariffs.length > 0) {
      return this.tariffs[this.tariffs.length - 1].price;
    }

    return 0;
  }

  // Format minutes into HH:MM:SS
  formatDuration(minutes: number): string {
    const totalSeconds = minutes * 60;
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  generateTicket(entry: OccupiedSpotVM) {
    const payload = {
      spotId: entry.spot.id,
      spotCode: entry.spot.code,
      durationMinutes: entry.minutes,
      price: entry.price,
      createdAt: new Date().toISOString()
    };

    this.http.post(`${environment.apiUrl}/tickets`, payload).subscribe({
      next: (created: any) => {
        this.generatedTickets.push(created);
        alert(
          `Ticket generated:\n` +
          `Spot: ${created.spotCode}\n` +
          `Time: ${created.durationMinutes} min\n` +
          `Price: ${created.price} LEK`
        );
      },
      error: () => alert('Failed to save ticket')
    });
  }
}
