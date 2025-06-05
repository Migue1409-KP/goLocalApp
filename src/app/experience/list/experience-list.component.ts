import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // Asegúrate de tenerlo
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-experience-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-list.component.html',
  styleUrls: ['./experience-list.component.css']
})
export class ExperienceListComponent implements OnInit {
  experiences: any[] = [];
  favoriteExperiences: string[] = [];
  favoriteMap: Record<string, string> = {}; // experienceId -> favoriteId
  loading = true;
  userId: string = '';

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.userId = this.auth.getId(); // Método del AuthService

    this.loadExperiences();
    this.loadFavorites();
  }

  loadExperiences() {
    this.http.get<any>('http://localhost:8080/api/v1/rest/experiences').subscribe({
      next: (res) => {
        this.experiences = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadFavorites() {
    this.http.get<any>(`http://localhost:8080/api/v1/rest/favorites/user/${this.userId}`).subscribe({
      next: (res) => {
        res.data.forEach((fav: any) => {
          this.favoriteExperiences.push(fav.experience.id);
          this.favoriteMap[fav.experience.id] = fav.id; // experienceId -> favoriteId
        });
      },
      error: (err) => {
        console.error('❌ Error al cargar favoritos', err);
      }
    });
  }

  isFavorited(expId: string): boolean {
    return this.favoriteExperiences.includes(expId);
  }

  toggleFavorite(expId: string) {
    if (this.isFavorited(expId)) {
      // Eliminar favorito
      const favId = this.favoriteMap[expId];
      this.http.delete(`http://localhost:8080/api/v1/rest/favorites/${favId}`).subscribe({
        next: () => {
          this.favoriteExperiences = this.favoriteExperiences.filter(id => id !== expId);
          delete this.favoriteMap[expId];
        },
        error: err => {
          console.error('❌ Error al eliminar favorito', err);
        }
      });
    } else {
      // Crear favorito
      const payload = {
        userId: this.userId,
        experienceId: expId
      };
      this.http.post<any>('http://localhost:8080/api/v1/rest/favorites', payload)
        .pipe(catchError(err => {
          console.error('❌ Error al agregar favorito', err);
          return of(null);
        }))
        .subscribe(res => {
          if (res?.status === 'CREATED') {
            this.favoriteExperiences.push(expId);
            this.favoriteMap[expId] = res.data[0].id;
          }
        });
    }
  }

  goToExperience(id: string) {
    this.router.navigate(['/profileExperience', id]);
  }
}
