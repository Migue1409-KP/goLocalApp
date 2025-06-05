import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewsService } from '../../services/reviews.service';
import { AuthService } from '../../services/auth.service'; // Added AuthService import

@Component({
  selector: 'app-profile-experience',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-experience.component.html',
  styleUrls: ['./profile-experience.component.css']
})
export class ProfileExperienceComponent implements OnInit {
  experience: any = null;
  categoryName: string = '';
  businessName: string = '';
  businessId: string = ''; // Added from second version
  loading: boolean = true;
  
  // Reviews related properties
  reviews: any[] = [];
  averageRating: number = 0;
  newReview = {
    rating: 0,
    description: ''
  };
  submittingReview = false;

  // Favorites related properties
  userId: string = '';
  isFavorited: boolean = false;
  favoriteId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private reviewsService: ReviewsService,
    private auth: AuthService, // Added from second version
    private router: Router // Added from second version
  ) {}

  ngOnInit(): void {
    const experienceId = this.route.snapshot.paramMap.get('id');
    this.userId = this.auth.getId(); // Get userId from AuthService
    
    if (experienceId) {
      this.loadExperienceDetails(experienceId);
      this.loadReviews(experienceId);
      this.checkFavorite(experienceId); // Added from second version
    }
  }

  private loadExperienceDetails(experienceId: string): void {
    this.http.get<any>(`http://localhost:8080/api/v1/rest/experiences/${experienceId}`).subscribe({
      next: (res) => {
        this.experience = res.data[0];
        this.loading = false;
        this.loadBusinessName();
        this.loadCategoryName();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  private loadBusinessName(): void {
    this.http.get<any>(`http://localhost:8080/api/v1/rest/business/${this.experience.businessId}`).subscribe({
      next: (res) => {
        this.businessName = res.data[0]?.name ?? 'Desconocido';
        this.businessId = res.data[0]?.id ?? ''; // Added from second version
      },
      error: () => {
        this.businessName = 'Negocio no encontrado';
      }
    });
  }

  private loadCategoryName(): void {
    this.http.get<any>(`http://localhost:8080/api/v1/rest/category/${this.experience.categoryId}`).subscribe({
      next: (res) => {
        this.categoryName = res.data[0]?.name ?? 'Desconocida';
      },
      error: () => {
        this.categoryName = 'Categoría no encontrada';
      }
    });
  }

  // Reviews functionality
  private loadReviews(experienceId: string): void {
    this.reviewsService.getReviewsByExperienceId(experienceId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.calculateAverageRating();
      },
      error: () => {
        console.error('Error loading reviews');
      }
    });
  }

  private calculateAverageRating(): void {
    if (this.reviews.length) {
      const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
      this.averageRating = Math.round((sum / this.reviews.length) * 10) / 10;
    }
  }

  setRating(rating: number): void {
    this.newReview.rating = rating;
  }

  submitReview(): void {
    if (!this.newReview.rating || !this.newReview.description.trim()) {
      return;
    }

    if (!this.userId) {
      alert('Debes iniciar sesión para dejar una review');
      return;
    }

    this.submittingReview = true;
    const reviewData = {
      userId: this.userId,
      rating: this.newReview.rating,
      description: this.newReview.description.trim(),
      experienceId: this.experience.id,
      routeId: null
    };

    this.reviewsService.createReview(reviewData).subscribe({
      next: () => {
        this.loadReviews(this.experience.id);
        this.newReview = { rating: 0, description: '' };
        this.submittingReview = false;
      },
      error: () => {
        this.submittingReview = false;
        alert('Error al enviar la review');
      }
    });
  }

  getStarsArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => {
      if (index + 0.5 === Math.floor(rating + 0.5)) return 0.5;
      return index < rating ? 1 : 0;
    });
  }

  // Favorites functionality from second version
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
