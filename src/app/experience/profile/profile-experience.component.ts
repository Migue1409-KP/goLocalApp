import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-profile-experience',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './profile-experience.component.html',
    styleUrls: ['./profile-experience.component.css']
    })
    export class ProfileExperienceComponent implements OnInit {
    experience: any = null;
    categoryName: string = '';
    businessName: string = '';
    loading: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private http: HttpClient
    ) {}

    ngOnInit(): void {
        const experienceId = this.route.snapshot.paramMap.get('id');

        this.http.get<any>(`http://localhost:8080/api/v1/rest/experiences/${experienceId}`).subscribe({
        next: (res) => {
            this.experience = res.data[0];
            this.loading = false;

            // Obtener nombre del negocio
            this.http.get<any>(`http://localhost:8080/api/v1/rest/business/${this.experience.businessId}`).subscribe({
            next: (res2) => {
                this.businessName = res2.data[0].name;
            },
            error: () => {
                this.businessName = 'Negocio no encontrado';
            }
            });

            // Obtener nombre de la categoría
            this.http.get<any>(`http://localhost:8080/api/v1/rest/category/${this.experience.categoryId}`).subscribe({
            next: (res3) => {
                this.categoryName = res3.data[0].name;
            },
            error: () => {
                this.categoryName = 'Categoría no encontrada';
            }
            });
        },
        error: () => {
            this.loading = false;
        }
        });
    }
}
