import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

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

  spots: any[] = [];
  tickets: any[] = [];

  tariffs = [
    { maxMinutes: 10, price: 0 },
    { maxHours: 1,  price: 100 },
    { maxHours: 3,  price: 200 },
    { maxHours: 5,  price: 500 },
    { maxHours: 8,  price: 1000 },
    { maxHours: 12, price: 1500 },
    { maxHours: 24, price: 2000 },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSpots();
  }

  loadSpots() {
    this.http.get<any[]>(`${environment.apiUrl}/spots`).subscribe(res => {
      this.spots = res.filter(s => s.status === 'Occupied');
    });
  }

  getElapsedMinutes(spotId: number): number {
    const key = `timer_${spotId}`;
    const start = Number(localStorage.getItem(key));

    if (!start) return 0;

    const ms = Date.now() - start;
    return Math.floor(ms / 60000); // minutes
  }

  calculatePrice(minutes: number): number {
    if (minutes <= 10) return 0;

    const hours = minutes / 60;

    for (let t of this.tariffs) {
      if (t.maxMinutes && minutes <= t.maxMinutes) return t.price;
      if (t.maxHours && hours <= t.maxHours) return t.price;
    }
    return this.tariffs[this.tariffs.length - 1].price;
  }

  generateTicket(spot: any) {
    const minutes = this.getElapsedMinutes(spot.id);
    const price = this.calculatePrice(minutes);

    this.tickets.push({
      id: Date.now(),
      spot: spot.code,
      time: minutes,
      price
    });
  }

}
