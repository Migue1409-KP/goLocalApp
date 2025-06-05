import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewsService } from '../../services/reviews.service';

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
  loading: boolean = true;
  reviews: any[] = [];
  averageRating: number = 0;
  newReview = {
    rating: 0,
    description: ''
  };
  submittingReview = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private reviewsService: ReviewsService
  ) {}

  ngOnInit(): void {
    const experienceId = this.route.snapshot.paramMap.get('id');
    if (experienceId) {
      this.loadExperienceDetails(experienceId);
      this.loadReviews(experienceId);
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
        this.businessName = res.data[0].name;
      },
      error: () => {
        this.businessName = 'Negocio no encontrado';
      }
    });
  }

  private loadCategoryName(): void {
    this.http.get<any>(`http://localhost:8080/api/v1/rest/category/${this.experience.categoryId}`).subscribe({
      next: (res) => {
        this.categoryName = res.data[0].name;
      },
      error: () => {
        this.categoryName = 'Categoría no encontrada';
      }
    });
  }

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

  private getCurrentUserId(): string | null {
    const userData = localStorage.getItem('userData');
    if (!userData) return null;
    try {
      const user = JSON.parse(userData);
      return user.id;
    } catch {
      return null;
    }
  }

  submitReview(): void {
    console.log('Submit clicked', this.newReview); // Debug log

    if (!this.newReview.rating || !this.newReview.description.trim()) {
      console.log('Validation failed', { // Debug log
        rating: this.newReview.rating,
        description: this.newReview.description
      });
      return;
    }

    const userId = this.getCurrentUserId();
    if (!userId) {
      console.log('No user ID found'); // Debug log
      alert('Debes iniciar sesión para dejar una review');
      return;
    }

    this.submittingReview = true;
    const reviewData = {
      userId: userId,
      rating: this.newReview.rating,
      description: this.newReview.description.trim(),
      experienceId: this.experience.id,
      routeId: null
    };

    console.log('Sending review data:', reviewData); // Debug log

    this.reviewsService.createReview(reviewData).subscribe({
      next: (response) => {
        console.log('Review created successfully', response); // Debug log
        this.loadReviews(this.experience.id);
        this.newReview = { rating: 0, description: '' };
        this.submittingReview = false;
      },
      error: (error) => {
        console.error('Error submitting review:', error); // Debug log
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
}
