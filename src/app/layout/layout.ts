import { Component, ViewChild, Inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

    // ONLY run this in the browser, never on server
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('darkMode');
      this.isDarkMode = saved === 'true';
      document.body.classList.toggle('dark-mode', this.isDarkMode);
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    // Only update DOM + localStorage in browser
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-mode', this.isDarkMode);
      localStorage.setItem('darkMode', this.isDarkMode.toString());
    }
  }
}
