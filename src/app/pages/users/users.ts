import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { JsonPipe } from '@angular/common';
import { UsersService } from '../../services/users.service';

@Component({
  standalone: true,
  selector: 'app-users-page',
  imports: [
    MatCardModule,
    JsonPipe     // <-- ADD THIS
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
})
export class UsersPage {
  users: any[] = [];

  constructor(private usersService: UsersService) {
    this.usersService.getAll().subscribe((res: any[]) => {
      this.users = res;
    });
  }
}
