import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';

import { environment } from '../../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-parking-spots',
  templateUrl: './parking-spots.html',
  styleUrls: ['./parking-spots.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
  ]
})
export class ParkingSpotsPage implements OnInit {


  spots: any[] = [];
  timers: { [id: number]: string } = {};
  timerIntervals: { [id: number]: any } = {};
 

  filteredSpots: any[] = [];

  filter = 'all';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadSpots();
  }

  loadSpots() {
    this.http.get<any[]>(`${environment.apiUrl}/spots`).subscribe({
      next: res => {
        this.spots = res;
        this.applyFilter();
      }
    });
  }

  applyFilter() {
    switch (this.filter) {
      case 'free':
        this.filteredSpots = this.spots.filter(s => s.status === 'Free');
        break;
      case 'occupied':
        this.filteredSpots = this.spots.filter(s => s.status === 'Occupied');
        break;
      case 'unavailable':
        this.filteredSpots = this.spots.filter(s => s.status === 'Unavailable');
        break;
      default:
        this.filteredSpots = this.spots;
        break;
    }
  }

  changeFilter(value: string) {
    this.filter = value;
    this.applyFilter();
  }

  formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${h}:${m}:${s}`;
  }

  startTimer(spotId: number) {
  const key = `timer_${spotId}`;

  // Save the start time if not present
  if (!localStorage.getItem(key)) {
        localStorage.setItem(key, Date.now().toString());
    }

    // Update timer every second
    this.timerIntervals[spotId] = setInterval(() => {
        const start = Number(localStorage.getItem(key));
        const elapsedSeconds = (Date.now() - start) / 1000;
        this.timers[spotId] = this.formatTime(elapsedSeconds);
    }, 1000);
  }

  stopTimer(spotId: number) {
    clearInterval(this.timerIntervals[spotId]);
    delete this.timerIntervals[spotId];

    localStorage.removeItem(`timer_${spotId}`);
    this.timers[spotId] = '00:00:00';
  }



}
