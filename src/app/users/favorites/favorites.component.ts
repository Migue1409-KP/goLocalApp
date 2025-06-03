import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  favorites: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getId();

    this.http.get<any>(`http://localhost:8080/api/v1/rest/favorites/user/${userId}`)
      .subscribe({
        next: (res) => {
          this.favorites = res.data || [];
        },
        error: (err) => {
          console.error('Error al cargar favoritos', err);
          this.error = 'No se pudieron cargar los favoritos.';
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  goToExperience(id: string): void {
    this.router.navigate(['/experience', id]);
  }

  deleteFavorite(favoriteId: string, event: MouseEvent): void {
    event.stopPropagation(); // Evita que se dispare el click de la tarjeta

    this.http.delete(`http://localhost:8080/api/v1/rest/favorites/${favoriteId}`)
      .subscribe({
        next: () => {
          // Quita el favorito de la lista
          this.favorites = this.favorites.filter(fav => fav.id !== favoriteId);
        },
        error: () => {
          alert('No se pudo eliminar el favorito.');
        }
      });
  }
}
