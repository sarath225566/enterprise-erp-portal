import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
export interface User {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  role: string;
  createdAt?: string;
}
@Component({
  selector: 'app-usermanagement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './usermanagement.component.html',
  styleUrl: './usermanagement.component.css'
})

export class UsermanagementComponent {
  usersList: User[] = [];
  userForm: FormGroup;

  isEditMode: boolean = false;
  selectedUserId: number | null = null;
  isModalOpen: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  private apiUrl = 'https://localhost:7028/api/auth'; // Adjust your backend API port here

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      fullName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      gender: ['Male'],
      role: ['User', [Validators.required]],
      password: [''] // Optional on edit, required on create
    });
  }
  ngOnInit(): void {
    this.loadUsers();
  }

  // 1. READ: Fetch all users
  loadUsers(): void {
    this.isLoading = true;
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.usersList = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load users list.';
        this.isLoading = false;
      }
    });
  }

  // Open Modal for Creating User
  openCreateModal(): void {
    this.isEditMode = false;
    this.selectedUserId = null;
    this.userForm.reset({ gender: 'Male', role: 'User' });
    this.userForm.get('password')?.setValidators([Validators.required]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.isModalOpen = true;
  }
  openEditModal(user: User): void {
    this.isEditMode = true;
    this.selectedUserId = user.id;
    this.userForm.patchValue({
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      gender: user.gender || 'Male',
      role: user.role
    });
    // Password not required during update
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.errorMessage = '';
  }

  // 2. CREATE & 3. UPDATE: Save Handler
  onSaveUser(): void {
  if (this.userForm.invalid) {
    this.userForm.markAllAsTouched();
    return;
  }

  const formData = this.userForm.value;

  if (this.isEditMode && this.selectedUserId) {
    // 1. UPDATE: Call PUT /api/auth/{id} using UserUpdateDto fields
    const updatePayload = {
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber || '',
      gender: formData.gender,
      role: formData.role
    };

    this.http.put(`https://localhost:7028/api/auth/${this.selectedUserId}`, updatePayload).subscribe({
      next: () => {
        this.showSuccess('User updated successfully!');
        this.loadUsers(); // Refresh table
        this.closeModal();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to update user.';
      }
    });

  } else {
    // 2. CREATE: Call POST /api/auth/register using RegistrationDto
    this.http.post('https://localhost:7028/api/auth/register', formData).subscribe({
      next: () => {
        this.showSuccess('User registered successfully!');
        this.loadUsers(); // Refresh table
        this.closeModal();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Registration failed.';
      }
    });
  }
}
onDeleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe({
        next: () => {
          this.showSuccess('User deleted successfully!');
          this.loadUsers();
        },
        error: (err) => {
          alert(err.error?.message || 'Failed to delete user.');
        }
      });
    }
  }

  private showSuccess(msg: string): void {
    this.successMessage = msg;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
}

