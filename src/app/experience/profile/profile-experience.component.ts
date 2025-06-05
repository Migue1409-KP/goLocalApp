import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // ✅ Asegúrate que exista
@Component({
  selector: 'app-profile-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-experience.component.html',
  styleUrls: ['./profile-experience.component.css']
})
export class ProfileExperienceComponent implements OnInit {
  experience: any = null;
  categoryName: string = '';
  businessName: string = '';
  businessId: string = '';
  loading: boolean = true;

  userId: string = '';
  isFavorited: boolean = false;
  favoriteId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const experienceId = this.route.snapshot.paramMap.get('id');
    this.userId = this.auth.getId();

    if (!experienceId) return;

    this.http.get<any>(`http://localhost:8080/api/v1/rest/experiences/${experienceId}`).subscribe({
      next: (res) => {
        this.experience = res.data[0];
        this.loading = false;

        this.checkFavorite(this.experience.id);

        // ✅ Obtener nombre y ID del negocio
        this.http.get<any>(`http://localhost:8080/api/v1/rest/business/${this.experience.businessId}`).subscribe({
          next: (res2) => {
            this.businessName = res2.data[0]?.name ?? 'Desconocido';
            this.businessId = res2.data[0]?.id ?? '';
          },
          error: () => {
            this.businessName = 'Negocio no encontrado';
          }
        });

        // Categoría (sin cambios)
        this.http.get<any>(`http://localhost:8080/api/v1/rest/category/${this.experience.categoryId}`).subscribe({
          next: (res3) => {
            this.categoryName = res3.data[0]?.name ?? 'Desconocida';
          },
          error: () => {
            this.categoryName = 'Categoría no encontrada';
          }
        });
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  checkFavorite(expId: string) {
    this.http.get<any>(`http://localhost:8080/api/v1/rest/favorites/user/${this.userId}`).subscribe({
      next: (res) => {
        const match = res.data.find((f: any) => f.experience.id === expId);
        if (match) {
          this.isFavorited = true;
          this.favoriteId = match.id;
        }
      },
      error: (err) => console.error('❌ Error al verificar favorito', err)
    });
  }

  toggleFavorite() {
    if (!this.experience?.id) return;

    const expId = this.experience.id;

    if (this.isFavorited && this.favoriteId) {
      this.http.delete(`http://localhost:8080/api/v1/rest/favorites/${this.favoriteId}`).subscribe({
        next: () => {
          this.isFavorited = false;
          this.favoriteId = null;
        },
        error: err => console.error('❌ Error al eliminar favorito', err)
      });
    } else {
      const payload = {
        userId: this.userId,
        experienceId: expId
      };
      this.http.post<any>('http://localhost:8080/api/v1/rest/favorites', payload).subscribe({
        next: (res) => {
          if (res.status === 'CREATED') {
            this.isFavorited = true;
            this.favoriteId = res.data[0].id;
          }
        },
        error: err => console.error('❌ Error al agregar favorito', err)
      });
    }
  }

  goToBusiness() {
    if (this.businessId) {
      this.router.navigate(['/profileBussiness', this.businessId]);
    }
  }
}
