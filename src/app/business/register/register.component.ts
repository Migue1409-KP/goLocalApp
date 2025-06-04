import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BusinessService } from '../../services/business.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterBusinessComponent implements OnInit {
  businessForm!: FormGroup;
  categories: any[] = [];
  cities: any[] = [];

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getId();

    this.businessForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      locationId: ['', Validators.required],
      userId: [userId, Validators.required],
      categories: [[], Validators.required]
    });

    this.loadCategories();
    this.loadCities();
  }

  loadCategories() {
    this.businessService.getCategories().subscribe({
      next: (cats) => this.categories = cats,
      error: (err) => console.error('❌ Error al cargar categorías', err)
    });
  }

  loadCities() {
  this.businessService.getCities().subscribe({
    next: (cities) => {
      this.cities = cities.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    },
    error: (err) => console.error('❌ Error al cargar ciudades', err)
  });
}

  onCategoryToggle(catId: string, checked: boolean): void {
    const selected = this.businessForm.value.categories as string[];

    if (checked) {
      this.businessForm.patchValue({ categories: [...selected, catId] });
    } else {
      this.businessForm.patchValue({ categories: selected.filter(id => id !== catId) });
    }
  }

  onCategoryChange(event: Event, catId: string): void {
  const checkbox = event.target as HTMLInputElement;
  const checked = checkbox.checked;

  const selected = this.businessForm.value.categories as string[];

  if (checked) {
    this.businessForm.patchValue({ categories: [...selected, catId] });
  } else {
    this.businessForm.patchValue({ categories: selected.filter(id => id !== catId) });
  }
}


  onSubmit() {
    if (this.businessForm.valid) {
      this.businessService.registerBusiness(this.businessForm.value).subscribe({
        next: res => {
          alert(res.message || 'Negocio registrado exitosamente.');

          setTimeout(() => {
            this.router.navigate(['/perfil']);
          }, 1000);
        },
        error: err => {
          console.error('❌ Error en registro:', err);
          alert('Error al registrar el negocio.');
        }
      });
    } else {
      this.businessForm.markAllAsTouched();
    }
  }
}
