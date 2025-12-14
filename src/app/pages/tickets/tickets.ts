import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

interface Tariff {
  id: number;
  min: number; 
  max: number; 
  price: number; 
}

interface OccupiedSpotVM {
  spot: any;
  seconds: number;
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

  loadData() {
    this.http.get<Tariff[]>(`${environment.apiUrl}/tariffs`).subscribe({
      next: tariffsRes => {

        this.tariffs = tariffsRes.sort((a, b) => a.min - b.min);

        this.http.get<any[]>(`${environment.apiUrl}/spots`).subscribe({
          next: spotsRes => {

            const occupied = spotsRes.filter(s => s.status === 'Occupied');

            this.occupiedSpots = occupied.map(spot => {
              const seconds = this.getElapsedSeconds(spot.id);
              const minutes = seconds / 60;
              const price = this.calculatePrice(minutes);
              return { spot, seconds, price };
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

  getElapsedSeconds(spotId: number): number {
    const key = `timer_${spotId}`;
    const start = Number(localStorage.getItem(key));

    if (!start) return 0;

    const ms = Date.now() - start;
    const seconds = Math.floor(ms / 1000);
    return seconds < 0 ? 0 : seconds;
  }

  calculatePrice(minutes: number): number {
    const match = this.tariffs.find(
      t => minutes >= t.min && minutes <= t.max
    );
    return match ? match.price : 0;
  }

  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  generateTicket(entry: OccupiedSpotVM) {
    const durationMinutes = Math.floor(entry.seconds / 60);

    const payload = {
      spotId: entry.spot.id,
      spotCode: entry.spot.code,
      durationMinutes,
      price: entry.price,
      createdAt: new Date().toISOString()
    };

    this.http.post(`${environment.apiUrl}/tickets`, payload).subscribe({
      next: (created: any) => {
        this.generatedTickets.push(created);

        this.http
          .patch(`${environment.apiUrl}/spots/${entry.spot.id}`, { status: 'Free' })
          .subscribe({
            next: () => {

              localStorage.removeItem(`timer_${entry.spot.id}`);

              this.occupiedSpots = this.occupiedSpots.filter(
                s => s.spot.id !== entry.spot.id
              );

              alert(
                `Ticket generated:\n` +
                `Spot: ${created.spotCode}\n` +
                `Time: ${this.formatDuration(entry.seconds)}\n` +
                `Price: ${created.price} LEK\n\n` +
                `The spot is now FREE.`
              );
            },
            error: () => {
              alert('Ticket saved, but failed to free the spot.');
            }
          });
      },
      error: () => alert('Failed to save ticket')
    });
  }
}
