import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  hidePassword = true;
  error = '';
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });

    // ✅ Quick backend connectivity test
    this.http.get(`${environment.apiUrl}/users`).subscribe({
      next: (res) => console.log('✅ Connected to backend:', res),
      error: (err) => console.error('❌ Backend connection failed:', err)
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    // Simulate login via backend data
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe({
      next: (users) => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          console.log('✅ Login success', user);
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/dashboard']);
        } else {
          this.error = 'Invalid email or password';
        }
      },
      error: (err) => {
        console.error('❌ Failed to fetch users', err);
        this.error = 'Server connection failed. Please try again.';
      }
    });
  }
}
