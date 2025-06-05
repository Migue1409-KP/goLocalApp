// routes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, switchMap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {
  private baseUrl = 'http://localhost:8080/api/v1/rest/routes';

  constructor(private http: HttpClient) { }

  getRoutesByUserId(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`);
  }
  createRoute(routeData: any): Observable<any> {
    return this.http.post(this.baseUrl, routeData);
  }
  getRouteById(routeId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${routeId}`);
  }

  deleteRoute(routeId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${routeId}`);
  }

  // routes.service.ts
  updateRoute(routeId: string, updatedRoute: any): Observable<any> {
    return this.getRouteById(routeId).pipe(
      switchMap((currentRoute) => {
        const currentData = currentRoute.data[0];

        // Remove duplicates from experiences array
        const uniqueExperiences = Array.from(
          new Map(updatedRoute.experience.map((exp: any) => [exp.id, exp])).values()
        );

        // Remove duplicates from categories array
        const uniqueCategories = Array.from(
          new Map(updatedRoute.category.map((cat: any) => [cat.id, cat])).values()
        );

        const routeToUpdate = {
          ...currentData,
          experience: uniqueExperiences,
          category: uniqueCategories
        };

        return this.http.patch<any>(`${this.baseUrl}/${routeId}`, routeToUpdate);
      })
    );
  }
  updateRouteName(routeId: string, newName: string): Observable<any> {
    return this.getRouteById(routeId).pipe(
      switchMap((currentRoute) => {
        const routeToUpdate = {
          ...currentRoute.data[0],
          name: newName
        };
        return this.http.patch<any>(`${this.baseUrl}/${routeId}`, routeToUpdate);
      })
    );
  }
}
