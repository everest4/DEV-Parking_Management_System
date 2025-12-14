import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ]
})
export class UsersPage implements OnInit {

  users: User[] = [];
  loading = true;
  error = '';
  editingUser: User | null = null;

  userForm: any;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      surname: [''],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['staff', Validators.required]
    });

    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;

    this.usersService.getUsers().subscribe({
      next: res => {
        this.users = res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
  }

  startEdit(user: User): void {
    this.editingUser = user;

    this.userForm.patchValue({
      name: user.name,
      surname: user.surname ?? '',
      email: user.email,
      username: user.username,
      password: user.password, 
      role: user.role
    });
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.userForm.reset({ role: 'staff' });
  }

  saveUser(): void {
    if (this.userForm.invalid) return;

    const form = this.userForm.value;

    if (this.editingUser) {
      // UPDATE USER
      const updated: User = {
        ...this.editingUser,
        name: form.name,
        surname: form.surname ?? '',
        email: form.email,
        username: form.username,
        password: form.password,
        role: form.role
      };

      this.usersService.update(updated).subscribe(() => {
        this.users = this.users.map(u => u.id === updated.id ? updated : u);
        this.cancelEdit();
      });
    } else {
      // CREATE NEW USER
      const newUser: User = {
        id: String(Date.now()),
        name: form.name,
        surname: form.surname ?? '',
        email: form.email,
        username: form.username,
        password: form.password,
        role: form.role
      };

      this.usersService.create(newUser).subscribe(() => {
        this.users.push(newUser);
        this.userForm.reset({ role: 'staff' });
      });
    }
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user "${user.name}"?`)) return;

    this.usersService.delete(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== user.id);
      },
      error: err => {
        console.error('Delete failed:', err);
        alert('Error deleting user — check backend.');
      }
    });
  }
}
