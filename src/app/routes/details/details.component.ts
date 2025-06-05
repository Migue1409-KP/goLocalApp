import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoutesService } from '../../services/routes.services';
import { catchError, EMPTY, map, tap } from 'rxjs';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  routeId: string = '';
  routeData: any = null;
  loading: boolean = true;
  error: string | null = null;
  editMode: boolean = false;
  editedName: string = '';
  showDeleteModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private routesService: RoutesService
  ) {}

  ngOnInit(): void {
    this.showDeleteModal = false;
    this.routeId = this.route.snapshot.paramMap.get('id') || '';
    if (this.routeId) {
      this.loadRouteDetails();
    } else {
      this.error = 'ID de ruta no encontrado';
      this.loading = false;
    }
  }

  private loadRouteDetails(): void {
    this.routesService.getRouteById(this.routeId).pipe(
      tap((response) => {
        if (!response || !response.data || response.data.length === 0) {
          throw new Error('Route data not found');
        }
      }),
      map((response) => {
        const routeData = response.data[0];
        if (!routeData.name || routeData.name.trim() === '') {
          const defaultName = `Route_${this.routeId}`;
          this.saveDefaultName(routeData, defaultName);
          return { ...routeData, name: defaultName };
        }
        return routeData;
      })
    ).subscribe({
      next: (data) => {
        this.routeData = data;
        this.editedName = data.name;
        this.loading = false;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Error al cargar los detalles de la ruta';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  private saveDefaultName(currentData: any, defaultName: string): void {
    const updateData = {
      ...currentData,
      name: defaultName
    };

    this.routesService.updateRoute(this.routeId, updateData).pipe(
      catchError((err) => {
        console.error('Error saving default name:', err);
        return EMPTY;
      })
    ).subscribe(() => {
      console.log(`Default name '${defaultName}' saved successfully`);
    });
  }

  saveChanges(): void {
    if (!this.editedName.trim()) {
      this.editedName = 'Nueva Ruta';
    }

    this.routesService.updateRouteName(this.routeId, this.editedName.trim()).subscribe({
      next: () => {
        this.routeData.name = this.editedName.trim();
        this.editMode = false;
        this.error = null;
      },
      error: (err) => {
        console.error('Error updating route name:', err);
        this.error = 'Error al actualizar el nombre';
      }
    });
  }

  removeExperience(index: number): void {
    const updatedExperiences = [...this.routeData.experience];
    updatedExperiences.splice(index, 1);

    const updatedRoute = {
      ...this.routeData,
      experience: updatedExperiences
    };

    this.routesService.updateRoute(this.routeId, updatedRoute).subscribe({
      next: () => {
        this.routeData.experience = updatedExperiences;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Error al eliminar la experiencia';
        console.error('Error:', err);
      }
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.editedName = this.routeData.name;
    }
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  deleteRoute(): void {
    this.routesService.deleteRoute(this.routeId).subscribe({
      next: () => {
        this.router.navigate(['/routes']);
      },
      error: (err) => {
        this.error = 'Error al eliminar la ruta';
        console.error('Error:', err);
        this.showDeleteModal = false;
      }
    });
  }
}
