import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { environment } from '../../../environments/environment';
import { MatMenuModule } from '@angular/material/menu';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    NgIf,
    NgFor
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  spots: any[] = [];
  loading = true;
  error = '';
  addSpotForm!: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit() {
    this.addSpotForm = this.fb.group({
      floor: ['', Validators.required],
      number: ['', Validators.required],
      type: ['Regular', Validators.required]
    });
    this.loadSpots();
  }

  loadSpots() {
    this.http.get<any[]>(`${environment.apiUrl}/spots`).subscribe({
      next: (res) => {
        this.spots = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load parking spots';
        console.error(err);
      }
    });
  }

  toggleStatus(spot: any) {
    const newStatus = spot.status === 'Free' ? 'Occupied' : 'Free';
    this.http.patch(`${environment.apiUrl}/spots/${spot.id}`, { status: newStatus })
      .subscribe({
        next: () => {
          spot.status = newStatus;
        },
        error: (err) => console.error('Failed to update status', err)
      });
  }

  addSpot() {
    if (this.addSpotForm.invalid) return;

    const { floor, number, type } = this.addSpotForm.value;
    const code = `${floor}${number}`;

    // 🚫 1. Check for duplicates
    const exists = this.spots.some(s => s.code.toLowerCase() === code.toLowerCase());
    if (exists) {
      alert(`Parking spot ${code} already exists!`);
      return;
    }

    const newSpot = {
      id: Date.now(),
      lotId: 1,
      code,
      type,
      status: 'Free'
    };

    // ✅ 2. Save to backend
    this.http.post(`${environment.apiUrl}/spots`, newSpot).subscribe({
      next: () => {
        this.spots.push(newSpot); // Refresh UI
        this.addSpotForm.reset();
      },
      error: (err) => console.error('Error adding spot:', err)
    });
  }

  deleteSpot(spot: any) {
    if (!confirm(`Delete spot ${spot.code}?`)) return;

    this.http.delete(`${environment.apiUrl}/spots/${spot.id}`).subscribe({
      next: () => {
        this.spots = this.spots.filter(s => s.id !== spot.id);
      },
      error: (err) => console.error('Failed to delete spot', err)
    });
  }


}
