import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-experience-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-list.component.html',
  styleUrls: ['./experience-list.component.css']
})
export class ExperienceListComponent implements OnInit {
  experiences: any[] = [];
  loading = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
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

  goToExperience(id: string) {
    this.router.navigate(['/profileExperience', id]);
  }
}
