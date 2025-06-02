import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      taxId: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['USER']
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.registerUser();
  }

  setRoleAndSubmit(role: 'USER' | 'OWNER'): void {
    this.registerForm.get('role')?.setValue(role);
    this.registerUser();
  }

  private registerUser(): void {
    this.isLoading = true;
    const payload = this.registerForm.value;

    this.http.post('http://localhost:8080/api/v1/rest/users', payload, { observe: 'response' })
      .subscribe({
        next: (res) => {
          if (res.status === 201) {
            this.errorMessage = null;
            this.router.navigate(['/login']);
          } else {
            this.errorMessage = 'Error inesperado. Intente de nuevo.';
          }
        },
        error: (err) => {
          this.isLoading = false;
          if (err?.error?.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = 'Ocurrió un error desconocido al registrar.';
          }
        },
        complete: () => this.isLoading = false
      });

  }
}
