import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessService {
  private baseUrl = 'http://localhost:8080/api/v1/rest/business';
  private categoryUrl = 'http://localhost:8080/api/v1/rest/category/list';
  private citiesUrl = 'http://localhost:8080/api/v1/rest/cities';

  constructor(private http: HttpClient) {}

  registerBusiness(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any>(this.categoryUrl).pipe(
      map(res => res.data[0]) // el array de categorías está dentro de `data[0]`
    );
  }

  getCities(): Observable<any[]> {
    return this.http.get<any[]>(this.citiesUrl);
  }
}
