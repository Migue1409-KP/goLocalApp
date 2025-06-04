import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BusinessService } from '../../services/business.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgMultiSelectDropDownModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterBusinessComponent implements OnInit {
  businessForm!: FormGroup;
  categories: any[] = [];
  cities: any[] = [];

  loadingCities = false;
  error: string | null = null;
  success: string | null = null;
  dropdownSettings = {
    singleSelection: false,
    idField: 'id',
    textField: 'name',
    enableCheckAll: false, // ← removido
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: false,
    clearSearchFilter: true
  };

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
      categories: [[], Validators.required] // correcto
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
    this.loadingCities = true;
    this.businessService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: (err) => {
        console.error('❌ Error al cargar ciudades', err);
        this.error = 'Error al cargar ciudades';
        setTimeout(() => this.error = null, 2000);
      },
      complete: () => {
        this.loadingCities = false;
      }
    });
  }

  onSubmit() {
    if (this.businessForm.valid) {
      const rawData = this.businessForm.value;

      const payload = {
        ...rawData,
        categories: rawData.categories.map((cat: any) => cat.id)
      };

      this.businessService.registerBusiness(payload).subscribe({
        next: res => {
          if (res.status === 'CREATED') {
            this.success = res.message;
            this.error = null;
            setTimeout(() => {
              this.success = null;
              this.router.navigate(['/perfil']);
            }, 1500);
          } else {
            this.success = null;
            this.error = res.message || 'Error inesperado.';
            setTimeout(() => this.error = null, 2000);
          }
        },
        error: err => {
          console.log(err)
          const msg = err?.error?.message || 'Error al registrar el negocio.';
          this.success = null;
          this.error = msg;
        }
      });
    } else {
      this.businessForm.markAllAsTouched();
    }
  }

  onCategoryChange() {
    const control = this.businessForm.get('categories');
    if (control) {
      control?.setValue([...control.value]);
    } // fuerza el update
  }
}
