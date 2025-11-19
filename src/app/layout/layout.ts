import { Component, Inject } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  standalone: true,
  selector: 'app-layout',
  imports: [
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './layout.html',
  styleUrls: ['./layout.scss']
})
export class LayoutPage {

  isDarkMode = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

    if (isPlatformBrowser(this.platformId)) {
      // Listen for route changes
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(event => {
          const url = (event as NavigationEnd).url;

          // If login → force LIGHT MODE
          if (url.includes('login')) {
            document.body.classList.remove('dark-mode');
            return;
          }

          // Otherwise → load saved theme
          const saved = localStorage.getItem('darkMode');
          this.isDarkMode = saved === 'true';

          document.body.classList.toggle('dark-mode', this.isDarkMode);
        });
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;

    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-mode', this.isDarkMode);
      localStorage.setItem('darkMode', this.isDarkMode.toString());
    }
  }

  logout() {
    // When logging out → force light mode
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.remove('dark-mode');
    }

    this.router.navigate(['/login']);
  }
}
