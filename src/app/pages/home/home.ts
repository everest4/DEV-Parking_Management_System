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
        this.loading = false;
      },
      error: () => this.error = 'Failed to load spots'
    });
  }

  addSpot() {
    if (this.addSpotForm.invalid) return;

    const { floor, number, type } = this.addSpotForm.value;
    const code = `${floor}${number}`;

    if (this.spots.some(s => s.code.toLowerCase() === code.toLowerCase())) {
      alert(`Spot ${code} already exists`);
      return;
    }

    const newSpot = {
      id: Date.now(),
      lotId: 1,
      code,
      type,
      status: type === 'Unavailable' ? 'Unavailable' : 'Free'
    };

    this.http.post(`${environment.apiUrl}/spots`, newSpot).subscribe({
      next: () => this.spots.push(newSpot)
    });

    this.addSpotForm.reset();
  }

  bookSpot(spot: any) {
    if (spot.status !== 'Free' || spot.type === 'Unavailable') return;

    this.http.patch(`${environment.apiUrl}/spots/${spot.id}`, { status: 'Occupied' })
      .subscribe(() => spot.status = 'Occupied');
  }

  unbookSpot(spot: any) {
    this.http.patch(`${environment.apiUrl}/spots/${spot.id}`, { status: 'Free' })
      .subscribe(() => spot.status = 'Free');
  }

  deleteSpot(spot: any) {
    this.http.delete(`${environment.apiUrl}/spots/${spot.id}`)
      .subscribe(() =>
        this.spots = this.spots.filter(s => s.id !== spot.id)
      );
  }
}
