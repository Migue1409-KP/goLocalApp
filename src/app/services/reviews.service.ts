// routes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private baseUrl = 'http://localhost:8080/api/v1/rest/reviews';

  constructor(private http: HttpClient) { }
  getReviewsByExperienceId(experienceId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/by-experience/${experienceId}`);
  }
  createReview(reviewData: any): Observable<any> {
    return this.http.post(this.baseUrl, reviewData);
  }
}
