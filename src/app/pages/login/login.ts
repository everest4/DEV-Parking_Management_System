import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ✅ Required for *ngIf
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  imports: [
    CommonModule, // ✅ must be in this array
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe(users => {
      const user = users.find(
        u => u.email === this.email && u.password === this.password
      );

      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/dashboard']);
      } else {
        this.error = 'Invalid email or password';
      }
    });
  }
}
