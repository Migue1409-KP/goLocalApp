import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  userForm!: FormGroup;
  originalData: any = {};
  isLoading = true;
  isEditing = false;
  message: string | null = null;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getId();
    this.http.get<any>(`http://localhost:8080/api/v1/rest/users/${userId}`)
      .subscribe({
        next: (res) => {
          const user = res.data[0];
          this.originalData = user;
          this.userForm = this.fb.group({
            name: [user.name, Validators.required],
            lastName: [user.lastName, Validators.required],
            phone: [user.phone, Validators.required],
            taxId: [user.taxId, Validators.required],
            email: [user.email, [Validators.required, Validators.email]]
          });
        },
        error: () => {
          this.error = 'Error al cargar perfil';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.userForm.patchValue(this.originalData);
      this.message = null;
      this.error = null;
    }
  }

  onSave(): void {
    const updatedFields: any = {};
    Object.keys(this.userForm.controls).forEach((key) => {
      const currentValue = this.userForm.get(key)?.value;
      if (currentValue !== this.originalData[key]) {
        updatedFields[key] = currentValue;
      }
    });

    if (Object.keys(updatedFields).length === 0) {
      this.message = 'No se realizaron cambios.';
      return;
    }

    const userId = this.authService.getId();
    this.http.put(`http://localhost:8080/api/v1/rest/users/${userId}`, updatedFields)
      .subscribe({
        next: () => {
          this.message = 'Perfil actualizado exitosamente.';
          this.error = null;
          this.originalData = { ...this.originalData, ...updatedFields };
          this.isEditing = false;

          // 👇 Ocultar mensaje luego de 5s
          setTimeout(() => this.message = null, 1500);
        },
        error: () => {
          this.error = 'Ocurrió un error al guardar los cambios.';
          this.message = null;
        }
      });
  }
}
