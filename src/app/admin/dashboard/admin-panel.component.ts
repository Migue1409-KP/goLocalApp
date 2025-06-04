import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  activeTab: 'users' | 'businesses' = 'users';

  users: any[] = [];
  pagedUsers: any[] = [];

  businesses: any[] = [];
  pagedBusinesses: any[] = [];

  isLoading = false;
  error: string | null = null;

  // Paginación
  pageSize = 3;

  userCurrentPage = 0;
  userTotalItems = 0;

  businessCurrentPage = 0;
  businessTotalItems = 0;

  showConfirmModal = false;
  itemToDelete: { id: string; type: 'users' | 'businesses' } | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchData();
  }

  switchTab(tab: 'users' | 'businesses'): void {
    this.activeTab = tab;
    if (tab === 'users') this.userCurrentPage = 0;
    else this.businessCurrentPage = 0;

    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.error = null;

    if (this.activeTab === 'users') {
      this.http.get<any>('http://localhost:8080/api/v1/rest/users').subscribe({
        next: (res) => {
          this.users = res.data;
          this.userTotalItems = res.data.length;
          this.updatePagedUsers();
        },
        error: () => (this.error = 'Error al cargar usuarios'),
        complete: () => (this.isLoading = false),
      });
    } else {
      this.http.get<any>('http://localhost:8080/api/v1/rest/business').subscribe({
        next: (res) => {
          this.businesses = res.data;
          this.businessTotalItems = res.data.length;
          this.updatePagedBusinesses();
        },
        error: () => (this.error = 'Error al cargar negocios'),
        complete: () => (this.isLoading = false),
      });
    }
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
    } else {
      if (page < 0 || page >= this.businessTotalPages) return;
      this.businessCurrentPage = page;
      this.updatePagedBusinesses();
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

    const url =
      this.itemToDelete.type === 'users'
        ? `http://localhost:8080/api/v1/rest/users/${this.itemToDelete.id}`
        : `http://localhost:8080/api/v1/rest/business/${this.itemToDelete.id}`;

    this.http.delete(url, { observe: 'response' as const }).subscribe({
      next: (res) => {
        if (res.status === 204 || res.status === 200) {
          this.fetchData();
        } else {
          this.error = 'No se pudo eliminar correctamente';
        }
        this.hideModal();
        this.itemToDelete = null;
      },
      error: () => {
        this.error = 'Error al eliminar';
        this.hideModal();
      }
    });
  }
}
