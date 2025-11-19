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
import { environment } from '../../../environments/environment';
import { MatMenuModule } from '@angular/material/menu';


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

  addSpotForm!: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit() {

    // Create form
    this.addSpotForm = this.fb.group({
      floor: ['', Validators.required],
      number: ['', Validators.required],
      type: ['Regular', Validators.required]
    });

    // Load parking spots
    this.loadSpots();
  }

  // LOAD SPOTS
  loadSpots() {
    this.http.get<any[]>(`${environment.apiUrl}/spots`).subscribe({
      next: res => {
        this.spots = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load spots';
      }
    });
  }

  // TOGGLE STATUS
  toggleStatus(spot: any) {
    const newStatus = spot.status === 'Free' ? 'Occupied' : 'Free';

    this.http.patch(`${environment.apiUrl}/spots/${spot.id}`, { status: newStatus })
      .subscribe({
        next: () => spot.status = newStatus
      });
  }

  // ADD SPOT
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
      status: 'Free'
    };

    this.http.post(`${environment.apiUrl}/spots`, newSpot).subscribe({
      next: () => this.spots.push(newSpot)
    });

    this.addSpotForm.reset();
  }

  // DELETE SPOT
  deleteSpot(spot: any) {
    if (!confirm(`Delete spot ${spot.code}?`)) return;

    this.http.delete(`${environment.apiUrl}/spots/${spot.id}`).subscribe({
      next: () => this.spots = this.spots.filter(s => s.id !== spot.id)
    });
  }

}
