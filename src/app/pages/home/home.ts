import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomePage implements OnInit {

  spots: any[] = [];
  loading = true;
  error = '';

  numbers = Array.from({ length: 30 }, (_, i) => i + 1); // 1–30

  // TIMER STORAGE
  timers: { [id: number]: string } = {};
  timerIntervals: { [id: number]: any } = {};

  addSpotForm!: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit() {
    this.addSpotForm = this.fb.group({
      floor: ['', Validators.required],
      number: ['', Validators.required],
      type: ['', Validators.required]
    });

    this.loadSpots();
  }

  loadSpots() {
    this.http.get<any[]>(`${environment.apiUrl}/spots`).subscribe({
      next: res => {
        this.spots = res;
        this.sortSpots();
        this.loading = false;

        // Restore timers for occupied ones
        this.spots.forEach(spot => {
          const key = `timer_${spot.id}`;
          if (spot.status === 'Occupied' && localStorage.getItem(key)) {
            this.startTimer(spot.id);
          }
        });
      },
      error: () => this.error = 'Failed to load spots'
    });
  }

  /* TIMER HELPERS */
  formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  startTimer(spotId: number) {
    const key = `timer_${spotId}`;

    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, Date.now().toString());
    }

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

  /* ADD SPOT */
  addSpot() {
    if (this.addSpotForm.invalid) return;

    const { floor, number, type } = this.addSpotForm.value;
    const code = `${floor}${number}`;

    if (this.spots.some(s => s.code.toLowerCase() === code.toLowerCase())) {
      alert(`Spot ${code} already exists`);
      return;
    }

    const newSpot = {
      id: String(Date.now()),
      lotId: 1,
      code,
      type,
      status: type === 'Unavailable' ? 'Unavailable' : 'Free'
    };

    this.http.post(`${environment.apiUrl}/spots`, newSpot).subscribe({
      next: () => {
        this.spots.push(newSpot);
        this.sortSpots();
      }
    });

    this.addSpotForm.reset();
  }

  /* BOOK SPOT */
  bookSpot(spot: any) {
    if (spot.status !== 'Free' || spot.type === 'Unavailable') return;

    this.http.patch(`${environment.apiUrl}/spots/${spot.id}`, { status: 'Occupied' })
      .subscribe(() => {
        spot.status = 'Occupied';
        this.startTimer(spot.id);
      });
  }

  /* UNBOOK SPOT */
  unbookSpot(spot: any) {
    this.http.patch(`${environment.apiUrl}/spots/${spot.id}`, { status: 'Free' })
      .subscribe(() => {
        spot.status = 'Free';
        this.stopTimer(spot.id);
      });
  }

  /* DELETE SPOT */
  deleteSpot(spot: any) {
    this.http.delete(`${environment.apiUrl}/spots/${spot.id}`).subscribe({
      next: () => {
        this.stopTimer(spot.id);
        this.spots = this.spots.filter(s => s.id !== spot.id);
      },
      error: err => console.error("DELETE ERROR:", err)
    });
  }


  /* SORTING */
  sortSpots() {
    this.spots.sort((a, b) => {
      const floorA = a.code[0];
      const floorB = b.code[0];
      if (floorA !== floorB) return floorA.localeCompare(floorB);
      return parseInt(a.code.slice(1)) - parseInt(b.code.slice(1));
    });
  }
}
