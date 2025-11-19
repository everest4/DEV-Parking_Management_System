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
}
