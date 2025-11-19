import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

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
    MatButtonModule
  ]
})
export class TariffsPage {

  tariffs = [
    { id: 1, label: "0 - 10 min",   price: 0     },
    { id: 2, label: "1 hour",       price: 100   },
    { id: 3, label: "3 hours",      price: 200   },
    { id: 4, label: "5 hours",      price: 500   },
    { id: 5, label: "8 hours",      price: 1000  },
    { id: 6, label: "12 hours",     price: 1500  },
    { id: 7, label: "24 hours",     price: 2000  }
  ];

  saveTariff(tariff: any) {
    alert(`Tariff "${tariff.label}" updated to ${tariff.price} LEK`);
  }

}
