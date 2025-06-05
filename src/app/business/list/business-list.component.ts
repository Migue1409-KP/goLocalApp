import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-business-list',
  standalone: true,
  templateUrl: './business-list.component.html',
  styleUrls: ['./business-list.component.css'],
  imports: [CommonModule, RouterModule]
})
export class BusinessListComponent implements OnInit {
  businesses: any[] = [];
  isLoading = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.http.get<any>('http://localhost:8080/api/v1/rest/business').subscribe({
      next: (res) => {
        console.log('Negocios cargados:');
        console.log(res.data.length);
        this.businesses = res?.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar negocios', err);
        this.isLoading = false;
      }
    });
  }

  goToBusiness(id: string): void {
    this.router.navigate(['/profileBussiness', id]);
  }
}
