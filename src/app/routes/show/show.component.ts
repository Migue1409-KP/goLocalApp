import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoutesService } from '../../services/routes.services';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-show',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
  routes: any[] = [];
  loading = true;
  error: string | null = null;
  showCreateModal = false;
  newRouteName = '';
  creatingRoute = false;

  constructor(
    private routesService: RoutesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.getId();
    if (currentUser) {
      this.loadRoutes(currentUser);
    } else {
      this.error = 'No se ha encontrado un usuario autenticado';
      this.loading = false;
    }
  }

  private loadRoutes(userId: string): void {
    this.routesService.getRoutesByUserId(userId).subscribe({
      next: (data) => {
        this.routes = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las rutas';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  openCreateModal(): void {
    this.showCreateModal = true;
    this.error = null;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.newRouteName = '';
    this.error = null;
  }

  createRoute(): void {
    if (!this.newRouteName.trim()) {
      this.error = 'El nombre de la ruta es requerido';
      return;
    }

    const userId = this.authService.getId();
    if (!userId) {
      this.error = 'Usuario no autenticado';
      return;
    }

    this.creatingRoute = true;
    this.error = null;

    const routeData = {
      name: this.newRouteName.trim(),
      userId: userId,
      category: [],
      experience: []
    };

    this.routesService.createRoute(routeData).subscribe({
      next: () => {
        this.closeCreateModal();
        this.loadRoutes(userId);
        this.creatingRoute = false;
      },
      error: (err) => {
        console.error('Error creating route:', err);
        this.error = 'Error al crear la ruta';
        this.creatingRoute = false;
      }
    });
  }

  goToDetails(route: any, event: MouseEvent): void {
    const card = (event.currentTarget as HTMLElement);
    const routeId = card.getAttribute('data-route-id');

    if (!routeId) {
      console.error('Route ID not found');
      return;
    }

    this.router.navigate(['/routes', routeId]);
  }
}
