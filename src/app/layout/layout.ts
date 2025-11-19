import { Component, ViewChild, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';



@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class LayoutPage {
  @ViewChild(MatSidenav) drawer!: MatSidenav;
    isDarkMode = false;

  constructor() {
    // Load from localStorage
    const saved = localStorage.getItem('darkMode');
    this.isDarkMode = saved === 'true';

    // Apply on startup
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    // Apply to body
    document.body.classList.toggle('dark-mode', this.isDarkMode);

    // Save preference
    localStorage.setItem('darkMode', this.isDarkMode.toString());
  }
}
