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

  updateRoute(routeId: string, newData: any): Observable<any> {
    return this.getRouteById(routeId).pipe(
      switchMap((currentData) => {
        // Merge current data with new data
        const updatedData = {
          ...currentData,
          ...newData,
          category: newData.category || currentData.category,
          experience: newData.experience || currentData.experience
        };

        // Send the updated data to the server
        return this.http.patch<any>(`${this.baseUrl}/${routeId}`, updatedData);
      })
    );
  }
}
