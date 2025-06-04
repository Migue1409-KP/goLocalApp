import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-business',
  standalone: true,
  templateUrl: './profile-business.component.html',
  styleUrls: ['./profile-business.component.css'],
  imports: [CommonModule, HttpClientModule, RouterModule]
})
export class ProfileBusinessComponent implements OnInit {
  business: any = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    this.isLoading = true;

    this.http.get<any>(`http://localhost:8080/api/v1/rest/business/${id}`).subscribe({
      next: (res) => {
        this.business = res?.data?.[0] || null;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando perfil del negocio', err);
        this.business = null;
        this.isLoading = false;
      }
    });
  }

  goToExperience(id: string): void {
    this.router.navigate(['/profileExperience', id]);
  }

  goToRegisterExperience(): void {
  this.router.navigate(['/register-experience'], {
    queryParams: { businessId: this.business.id }
  });
}
}
