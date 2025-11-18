import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [MatCardModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomePage {}
