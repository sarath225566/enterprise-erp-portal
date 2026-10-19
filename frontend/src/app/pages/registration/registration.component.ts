import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  registerForm!: FormGroup;
  isSubmitted= false;
  errorMessage ='';
  constructor(private router: Router,
    private fb: FormBuilder,
  private http: HttpClient){
    this.registerForm=this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]],
      userName: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      gender: ['Male', [Validators.required]]
    })
  }
  goToLogin(){
    this.router.navigate([""]);
  }
  get f() {
    return this.registerForm.controls;
  }
  onRegister(): void{
    this.isSubmitted=true;
    if(this.registerForm.invalid){
      return;
    }

    const payload = {...this.registerForm.value,
      phoneNumber: String(this.registerForm.value.phoneNumber)
    };

    this.http.post('https://localhost:7028/api/auth/register', payload).subscribe({
      next:(res: any)=>{
        alert("Register Successfully!");
        this.registerForm.reset();
      },
      error: (err)=>{
        this.errorMessage = err.errors.message || "Registration failed";
      }
    })
  }
}
