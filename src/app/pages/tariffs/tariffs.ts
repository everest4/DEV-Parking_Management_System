import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { environment } from '../../../environments/environment';

interface Tariff {
  id: string;
  min: number;
  max: number;
  price: number;
}

@Component({
  standalone: true,
  selector: 'app-tariffs',
  templateUrl: './tariffs.html',
  styleUrls: ['./tariffs.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class TariffsPage implements OnInit {

  tariffs: Tariff[] = [];
  loading = true;

  newMin: number | null = null;
  newMax: number | null = null;
  newPrice: number | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTariffs();
  }

  loadTariffs() {
    this.http.get<Tariff[]>(`${environment.apiUrl}/tariffs`).subscribe({
      next: data => {
        this.tariffs = data.sort((a, b) => a.min - b.min);
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  saveTariff(tariff: Tariff) {
    console.log("PATCH →", `${environment.apiUrl}/tariffs/${tariff.id}`, tariff);

    this.http.patch(`${environment.apiUrl}/tariffs/${tariff.id}`, tariff)
      .subscribe({
        next: () => {
          alert('Tariff updated!');
          this.loadTariffs();
        },
        error: err => {
          console.error("❌ PATCH ERROR:", err);
          alert("Failed to save changes — check backend.");
        }
      });
  }

  deleteTariff(id: string) {
    if (!confirm('Delete this tariff?')) return;

    this.http.delete(`${environment.apiUrl}/tariffs/${id}`).subscribe({
      next: () => {
        this.tariffs = this.tariffs.filter(t => t.id !== id);
      },
      error: err => {
        console.error("❌ DELETE ERROR:", err);
        alert("Failed to delete — check backend.");
      }
    });
  }

  addTariff() {
    if (!this.newMin || !this.newMax || !this.newPrice) {
      alert('All fields required.');
      return;
    }

    const newTariff: Tariff = {
      id: String(Date.now()),   // ✅ FIXED → STRING ID ALWAYS
      min: this.parseDurationInput(this.newMin as any),
      max: this.parseDurationInput(this.newMax as any),
      price: Number(this.newPrice)
    };

    this.http.post(`${environment.apiUrl}/tariffs`, newTariff).subscribe({
      next: () => {
        this.tariffs.push(newTariff);
        this.tariffs.sort((a, b) => a.min - b.min);

        this.newMin = null;
        this.newMax = null;
        this.newPrice = null;
      },
      error: err => console.error("❌ POST ERROR:", err)
    });
  }

  formatDuration(min: number): string {
    if (min < 60) return `${min} min`;
    const hours = Math.floor(min / 60);
    const minutes = min % 60;
    if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    return `${hours}h ${minutes}min`;
  }

  parseDurationInput(value: string | number): number {
    if (typeof value === 'number') return value;
    value = value.toLowerCase().trim();
    if (/^\d+$/.test(value)) return parseInt(value, 10);

    let total = 0;

    const hourMatch = value.match(/(\d+)h/);
    const minMatch = value.match(/(\d+)m/);

    if (hourMatch) total += parseInt(hourMatch[1], 10) * 60;
    if (minMatch) total += parseInt(minMatch[1], 10);

    if (value.includes(':')) {
      const [h, m] = value.split(':');
      total = Number(h) * 60 + Number(m);
    }

    return total;
  }
}
