import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-business',
  standalone: true,
  templateUrl: './profile-business.component.html',
  styleUrls: ['./profile-business.component.css'],
  imports: [CommonModule, RouterModule, ReactiveFormsModule]
})
export class ProfileBusinessComponent implements OnInit {
  business: any = null;
  isLoading = false;
  errorMessage: string | null = null;
  isOwner = false;
  isEditing = false;
  editForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isLoading = true;

    this.http.get<any>(`http://localhost:8080/api/v1/rest/business/${id}`).subscribe({
      next: (res) => {
        this.business = res?.data?.[0] || null;
        this.isLoading = false;

        const currentUserId = this.authService.getId();
        const userRole = this.authService.getRole();

        this.isOwner = userRole === 'OWNER' && this.business?.userId === currentUserId;

        this.editForm = this.fb.group({
          name: [this.business.name],
          description: [this.business.description],
          location: [this.business.location.name]
        });
      },
      error: (err) => {
        console.error('Error cargando perfil del negocio', err);
        this.business = null;
        this.isLoading = false;
      }
    });
  }

  goToExperience(id: string): void {
    this.router.navigate(['/profileExperience', id]);
  }

  goToRegisterExperience(): void {
    this.router.navigate(['/register-experience'], {
      queryParams: { businessId: this.business.id }
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editForm.patchValue({
      name: this.business.name,
      description: this.business.description,
      location: this.business.location.name
    });
  }

  saveChanges() {
    const payload: any = {};
    const { name, description, location } = this.editForm.value;

    if (name && name !== this.business.name) payload.name = name;
    if (description && description !== this.business.description) payload.description = description;
    if (location && location !== this.business.location.name) payload.location = location;

    this.http.patch<any>(`http://localhost:8080/api/v1/rest/business/${this.business.id}`, payload).subscribe({
      next: (res) => {
        this.business = { ...this.business, ...payload };
        this.isEditing = false;
      },
      error: () => {
        this.errorMessage = 'Error al guardar los cambios.';
        setTimeout(() => this.errorMessage = null, 3000);
      }
    });
  }

  deleteBusiness(): void {
  if (!this.business?.id) return;

  this.isLoading = true;

  this.http.delete(`http://localhost:8080/api/v1/rest/business/${this.business.id}`).subscribe({
    next: () => {
      this.router.navigate(['/']);
      this.isLoading = false;
    },
    error: (err) => {
      this.errorMessage = 'Error al eliminar el negocio.';
      this.isLoading = false;
      console.error(err);
    }
  });
}

  showConfirmationModal = false;

  confirmDelete(): void {
    this.showConfirmationModal = false;
    this.deleteBusiness();
  }
}
