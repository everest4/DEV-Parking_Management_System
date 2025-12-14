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

  userForm: any;  // <-- Created later in ngOnInit

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // ✅ Correct place to initialize the FormGroup
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
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
    this.userForm.patchValue(user);
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.userForm.reset({ role: 'staff' });
  }

  saveUser(): void {
    if (this.userForm.invalid) return;

    const formData = this.userForm.value;

    if (this.editingUser) {
      const updated: User = { ...this.editingUser, ...formData };

      this.usersService.update(updated).subscribe(() => {
        this.users = this.users.map(u => u.id === updated.id ? updated : u);
        this.cancelEdit();
      });

    } else {
      const newUser: User = {
        id: Date.now(),
        name: formData.name!,
        email: formData.email!,
        username: formData.username!,
        role: formData.role! as 'admin' | 'staff' | 'manager'
      };

      this.usersService.create(newUser).subscribe(() => {
        this.users.push(newUser);
        this.userForm.reset({ role: 'staff' });
      });
    }
  }

  deleteUser(u: User): void {
    if (!confirm(`Remove user "${u.name}"?`)) return;

    this.usersService.delete(u.id).subscribe(() => {
      this.users = this.users.filter(x => x.id !== u.id);
      if (this.editingUser?.id === u.id) {
        this.cancelEdit();
      }
    });
  }
}
