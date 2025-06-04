import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RoutesService } from '../../services/routes.services';
import {catchError, EMPTY, map, tap} from 'rxjs';

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
        const routeData = response.data[0]; // Get the first route from data array
        if (!routeData.name || routeData.name.trim() === '') {
          const defaultName = `Route_${this.routeId}`;
          this.saveDefaultName(defaultName);
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

  private saveDefaultName(defaultName: string): void {
    const updateData = {
      name: defaultName,
      category: this.routeData?.category || [],
      experience: this.routeData?.experience || []
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

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.editedName = this.routeData.name;
    }
  }

  saveChanges(): void {
    // Prevent empty names
    if (!this.editedName.trim()) {
      this.editedName = 'Nueva Ruta';
    }

    this.routesService.updateRoute(this.routeId, { name: this.editedName }).subscribe({
      next: () => {
        this.routeData.name = this.editedName;
        this.editMode = false;
        this.error = null;
      },
      error: (err) => {
        this.error = 'Error al actualizar el nombre';
        console.error('Error:', err);
      }
    });
  }

  removeExperience(index: number): void {
    const updatedExperiences = [...this.routeData.experience];
    updatedExperiences.splice(index, 1);

    this.routesService.updateRoute(this.routeId, { experience: updatedExperiences }).subscribe({
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
