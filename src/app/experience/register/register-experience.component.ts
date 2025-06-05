import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-register-experience',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgMultiSelectDropDownModule],
  templateUrl: './register-experience.component.html',
  styleUrls: ['./register-experience.component.css']
})
export class RegisterExperienceComponent implements OnInit {
  experienceForm!: FormGroup;
  categories: any[] = [];
  error: string | null = null;
  success: string | null = null;
  businessId: string = '';
  dropdownSettings = {
    singleSelection: true,
    idField: 'id',
    textField: 'name',
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.businessId = this.route.snapshot.queryParamMap.get('businessId') || '';

    this.experienceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      categoryId: [[], Validators.required],
      businessId: [this.businessId, Validators.required]
    });

    this.loadCategories();
  }

  loadCategories() {
    this.http.get<any>('http://localhost:8080/api/v1/rest/category/list').subscribe({
      next: (res) => {
        const cats = res?.data?.[0] || [];
        this.categories = cats;
      },
      error: (err) => {
        console.error('❌ Error al cargar categorías', err);
        this.error = 'Error al cargar categorías';
        setTimeout(() => this.error = null, 2000);
      }
    });
  }

  onSubmit(): void {
    if (this.experienceForm.invalid) {
    console.log('🚫 Formulario inválido:', this.experienceForm.value);
    this.experienceForm.markAllAsTouched();
    return;
  }
    if (this.experienceForm.invalid) {
        this.experienceForm.markAllAsTouched();
        return;
    }

    const raw = this.experienceForm.value;

    const payload = {
        name: raw.name,
        description: raw.description,
        price: raw.price,
        businessId: raw.businessId,
        categoryId: raw.categoryId[0]?.id // 👈 importante!
    };

    this.http.post<any>('http://localhost:8080/api/v1/rest/experiences', payload).subscribe({
        next: () => {
        this.success = 'Experiencia registrada correctamente.';
        this.error = null;
        setTimeout(() => {
            this.success = null;
            this.router.navigate(['/profileBussiness', this.businessId]);
        }, 1500);
        },
        error: (err) => {
        console.error(err);
        this.error = err?.error?.message || 'Error al registrar la experiencia.';
        this.success = null;
        setTimeout(() => this.error = null, 2000);
        }
    });
    }
}
