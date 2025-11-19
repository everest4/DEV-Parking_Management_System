import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-login-page',
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginPage {
  username = '';
  password = '';

  constructor(private router: Router, private auth: AuthService) {}

  login() {
    this.auth.login(this.username, this.password).subscribe(user => {
      if (user) {
        this.router.navigate(['/home']);
      } else {
        alert('Invalid username or password');
      }
    });
  }

}
