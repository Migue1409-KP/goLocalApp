import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  form!: FormGroup;
  businesses: any[] = [];
  loading = false;
  error: string | null = null;

  cities: any[] = [];
  states: any[] = [];
  categories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      cityId: [''],
      stateId: [''],
      categoryId: ['']
    });

    this.loadFilters();
  }

  loadFilters(): void {
    this.http.get<any>('http://localhost:8080/api/v1/rest/cities').subscribe({
      next: res => this.cities = res,
      error: () => this.error = 'Error al cargar ciudades.'
    });

    this.http.get<any>('http://localhost:8080/api/v1/rest/states').subscribe({
      next: res => this.states = res,
      error: () => this.error = 'Error al cargar departamentos.'
    });

    this.http.get<any>('http://localhost:8080/api/v1/rest/category/list').subscribe({
      next: res => this.categories = res.data?.[0] || [],
      error: () => this.error = 'Error al cargar categorías.'
    });
  }

  onSearch(): void {
    const { name, cityId, stateId, categoryId } = this.form.value;

    const params: string[] = [];

    if (name) params.push(`name=${encodeURIComponent(name)}`);
    if (cityId) params.push(`cityId=${cityId}`);
    if (stateId) params.push(`stateId=${stateId}`);
    if (categoryId) params.push(`categoryId=${categoryId}`);

    const query = params.length ? '?' + params.join('&') : '';

    this.loading = true;
    this.businesses = [];
    this.error = null;

    this.http.get<any>(`http://localhost:8080/api/v1/rest/business/filter${query}`).subscribe({
      next: res => {
        this.loading = false;
        if (!res.data || res.data.length === 0) {
          this.router.navigate(['/no-results']);
        } else {
          this.businesses = res.data;
        }
      },
      error: (err) => {
        console.error('Error al buscar negocios.', err);
        this.loading = false;
        this.router.navigate(['/no-results']);
      }
    });
  }

  goToBusiness(id: string): void {
    this.router.navigate(['/profileBussiness', id]);
  }

  clearFilters(): void {
    this.form.reset();
    this.businesses = [];
    this.error = null;
  }
}
