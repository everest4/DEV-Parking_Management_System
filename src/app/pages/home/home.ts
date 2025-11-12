import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  stats: any[] = [];
  lots: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadStats();
    this.loadLots();
  }

  loadStats() {
    this.http.get<any[]>(`${environment.apiUrl}/spots`).subscribe(spots => {
      const free = spots.filter(s => s.status === 'Free').length;
      const occupied = spots.filter(s => s.status === 'Occupied').length;

      this.stats = [
        { title: 'Available Spots', value: free, icon: 'check_circle', color: '#4caf50' },
        { title: 'Occupied Spots', value: occupied, icon: 'cancel', color: '#f44336' },
        { title: 'Total Spots', value: spots.length, icon: 'directions_car', color: '#2196f3' }
      ];
    });
  }

  loadLots() {
    this.http.get<any[]>(`${environment.apiUrl}/lots`).subscribe(lots => {
      this.lots = lots;
    });
  }
}
