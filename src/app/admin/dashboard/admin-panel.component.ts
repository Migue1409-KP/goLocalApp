import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  activeTab: 'users' | 'businesses' | 'categories' | 'cities' = 'users';

  users: any[] = [];
  pagedUsers: any[] = [];

  businesses: any[] = [];
  pagedBusinesses: any[] = [];

  isLoading = false;
  error: string | null = null;

  // Paginación
  pageSize = 10;

  userCurrentPage = 0;
  userTotalItems = 0;

  businessCurrentPage = 0;
  businessTotalItems = 0;

  // Categorías
  categories: any[] = [];
  pagedCategories: any[] = [];
  categoryCurrentPage = 0;
  categoryTotalItems = 0;

  // Ciudades
  cities: any[] = [];
  pagedCities: any[] = [];
  cityCurrentPage = 0;
  cityTotalItems = 0;


  showConfirmModal = false;
  itemToDelete: { id: string; type: 'users' | 'businesses' | 'categories' | 'cities' } | null = null;

  // Modal creación
  showCreateModal = false;
  createMode: 'category' | 'city' | null = null;
  newCategoryName = '';
  newCityName = '';
  selectedStateId = '';
  states: any[] = []; // Estados para dropdown

  createError: string | null = null;
  createSuccess: string | null = null;
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  switchTab(tab: 'users' | 'businesses' | 'categories' | 'cities'): void {
    this.activeTab = tab;
    if (tab === 'users') this.userCurrentPage = 0;
    else if (tab === 'businesses') this.businessCurrentPage = 0;
    else if (tab === 'categories') this.categoryCurrentPage = 0;
    else this.cityCurrentPage = 0;

    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.error = null;

    const endpoints = {
      users: 'http://localhost:8080/api/v1/rest/users',
      businesses: 'http://localhost:8080/api/v1/rest/business',
      categories: 'http://localhost:8080/api/v1/rest/category/list',
      cities: 'http://localhost:8080/api/v1/rest/cities'
    };

    const endpoint = endpoints[this.activeTab];

    this.http.get<any>(endpoint).subscribe({
      next: (res) => {
        const data = res.data ?? res; // ciudades no tiene .data

        if (this.activeTab === 'users') {
          this.users = data;
          this.userTotalItems = data.length;
          this.updatePagedUsers();
        } else if (this.activeTab === 'businesses') {
          this.businesses = data;
          this.businessTotalItems = data.length;
          this.updatePagedBusinesses();
        } else if (this.activeTab === 'categories') {
          this.categories = data[0]; // Viene como array de array
          this.categoryTotalItems = this.categories.length;
          this.updatePagedCategories();
        } else {
          this.cities = data.sort((a:any, b:any) => a.name.localeCompare(b.name));
          this.cityTotalItems = this.cities.length;
          this.updatePagedCities();
        }
      },
      error: () => this.error = 'Error al cargar datos',
      complete: () => this.isLoading = false
    });
  }


  updatePagedUsers(): void {
    const start = this.userCurrentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedUsers = this.users.slice(start, end);
  }

  updatePagedBusinesses(): void {
    const start = this.businessCurrentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedBusinesses = this.businesses.slice(start, end);
  }

  goToPage(page: number): void {
    if (this.activeTab === 'users') {
      if (page < 0 || page >= this.userTotalPages) return;
      this.userCurrentPage = page;
      this.updatePagedUsers();
    } else if (this.activeTab === 'businesses') {
      if (page < 0 || page >= this.businessTotalPages) return;
      this.businessCurrentPage = page;
      this.updatePagedBusinesses();
    } else if (this.activeTab === 'categories') {
      if (page < 0 || page >= this.categoryTotalPages) return;
      this.categoryCurrentPage = page;
      this.updatePagedCategories();
    } else {
      if (page < 0 || page >= this.cityTotalPages) return;
      this.cityCurrentPage = page;
      this.updatePagedCities();
    }
  }

  get userTotalPages(): number {
    return Math.ceil(this.userTotalItems / this.pageSize);
  }

  get businessTotalPages(): number {
    return Math.ceil(this.businessTotalItems / this.pageSize);
  }

  showModal(): void {
    this.showConfirmModal = true;
    document.body.classList.add('modal-open');
  }

  hideModal(): void {
    this.showConfirmModal = false;
    document.body.classList.remove('modal-open');
  }

  promptDelete(id: string): void {
    this.itemToDelete = { id, type: this.activeTab };
    this.showModal();
  }

  cancelDelete(): void {
    this.itemToDelete = null;
    this.hideModal();
  }

  confirmDelete(): void {
    if (!this.itemToDelete) return;

    const { id, type } = this.itemToDelete;

    let url = '';
    if (type === 'users') {
      url = `http://localhost:8080/api/v1/rest/users/${id}`;
    } else if (type === 'businesses') {
      url = `http://localhost:8080/api/v1/rest/business/${id}`;
    } else if (type === 'categories') {
      url = `http://localhost:8080/api/v1/rest/category/${id}`;
    } else if (type === 'cities') {
      url = `http://localhost:8080/api/v1/rest/cities/${id}`;
    }

    const req = type === 'cities'
      ? this.http.request('delete', url, { body: { id }, observe: 'response' })
      : this.http.delete(url, { observe: 'response' });

    req.subscribe({
      next: (res) => {
        if (res.status === 200 || res.status === 204) {
          this.fetchData();
        } else {
          this.error = 'No se pudo eliminar correctamente';
        }
        this.hideModal();
        this.itemToDelete = null;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Error al eliminar';
        this.hideModal();
        setTimeout(() => this.error = null, 3000);
      }
    });
  }

  updatePagedCategories(): void {
    const start = this.categoryCurrentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedCategories = this.categories.slice(start, end);
  }

  updatePagedCities(): void {
    const start = this.cityCurrentPage * this.pageSize;
    const end = start + this.pageSize;
    this.pagedCities = this.cities.slice(start, end);
  }

  get categoryTotalPages(): number {
    return Math.ceil(this.categoryTotalItems / this.pageSize);
  }

  get cityTotalPages(): number {
    return Math.ceil(this.cityTotalItems / this.pageSize);
  }

  loadStates() {
    this.http.get<any[]>('http://localhost:8080/api/v1/rest/states').subscribe({
      next: (res) => {
        this.states = res.sort((a, b) => a.name.localeCompare(b.name));
      },
      error: () => this.createError = 'Error al cargar departamentos.'
    });
  }


  openCreateModal(type: 'category' | 'city') {
    this.createMode = type;
    this.newCategoryName = '';
    this.newCityName = '';
    this.selectedStateId = '';
    this.createError = null;
    this.createSuccess = null;
    this.showCreateModal = true;
    document.body.classList.add('modal-open');

    if (type === 'city') {
      this.loadStates();
    }
  }

  closeCreateModal() {
    this.showCreateModal = false;
    this.createMode = null;
    document.body.classList.remove('modal-open');
  }

  submitCreate() {
    if (this.createMode === 'category') {
      if (!this.newCategoryName.trim()) {
        this.createError = 'El nombre no puede estar vacío';
        return;
      }

      this.http.post('http://localhost:8080/api/v1/rest/category', {
        name: this.newCategoryName.trim()
      }).subscribe({
        next: (res: any) => {
          this.createSuccess = res.message || 'Categoría creada.';
          this.fetchData();
          setTimeout(() => this.closeCreateModal(), 1200);
        },
        error: (err) => {
          this.createError = err?.error?.message || 'Error creando categoría';
        }
      });

    } else if (this.createMode === 'city') {
      if (!this.newCityName.trim() || !this.selectedStateId) {
        this.createError = 'Todos los campos son obligatorios';
        return;
      }

      this.http.post('http://localhost:8080/api/v1/rest/cities', {
        name: this.newCityName.trim(),
        state: this.selectedStateId
      }).subscribe({
        next: (res: any) => {
          this.createSuccess = res.message || 'Ciudad creada.';
          this.fetchData();
          setTimeout(() => this.closeCreateModal(), 1200);
        },
        error: (err) => {
          this.createError = err?.error?.message || 'Error creando ciudad';
        }
      });
    }
  }
}
