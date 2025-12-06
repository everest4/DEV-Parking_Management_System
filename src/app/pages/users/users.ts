import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  userForm!: FormGroup;

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      role: ['staff', Validators.required]
      // password can be added later if you want to edit it here
    });

    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService.getAll().subscribe({
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
      email: user.email,
      username: user.username,
      role: user.role
    });
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.userForm.reset({ role: 'staff' });
  }

  saveUser(): void {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value as Partial<User>;

    if (this.editingUser) {
      // UPDATE
      const updated: User = {
        ...this.editingUser,
        ...formValue
      } as User;

      this.usersService.update(updated).subscribe(() => {
        this.users = this.users.map(u => (u.id === updated.id ? updated : u));
        this.cancelEdit();
      });

    } else {
      // CREATE
      const newUser: User = {
        id: Date.now(),
        name: formValue.name ?? '',
        email: formValue.email ?? '',
        username: formValue.username ?? '',
        role: (formValue.role as User['role']) ?? 'staff'
      };

      this.usersService.create(newUser).subscribe(() => {
        this.users = [...this.users, newUser];
        this.userForm.reset({ role: 'staff' });
      });
    }
  }

  deleteUser(user: User): void {
    if (!confirm(`Delete user "${user.name}"?`)) return;

    this.usersService.delete(user.id).subscribe(() => {
      this.users = this.users.filter(u => u.id !== user.id);
      if (this.editingUser?.id === user.id) {
        this.cancelEdit();
      }
    });
  }
}
