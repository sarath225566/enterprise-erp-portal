import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitted = false;
  isLoading = false; // <-- API response varunnathu vare button control cheyyan
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    // Email mathramalla Username koodi accept cheyyan Validators.email ozhivaakki
    this.loginForm = this.fb.group({
      emailOrUsername: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin(): void {
    this.isSubmitted = true;
    if (this.loginForm.invalid || this.isLoading) {
      if (this.loginForm.invalid) {
        this.toastr.warning('Please fill in all required fields.', 'Validation Warning');
      }
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.authService.saveToken(res.token);
        this.toastr.success('Welcome back!', 'Login Successful');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed! Invalid Credentials.';
        this.toastr.error(this.errorMessage, 'Login Failed');
      }
    });
  }

  goToRegistration() {
    this.router.navigate(['/registration']);
  }

  goToforgotpassword() {
    this.router.navigate(['/forgot']);
  }
}
