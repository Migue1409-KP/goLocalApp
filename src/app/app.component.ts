import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'seguroschepito';
  isLoggedIn: boolean = false;
  autorizado: boolean = false;
  id: string = '';


  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.id = this.authService.getId();
    this.checkLoginStatus();
    this.checkRole();


    // Suscribirse a los cambios de navegación
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkLoginStatus();
        this.checkRole();
      }
    });
  }

  async checkLoginStatus(): Promise<void> {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  checkRole(): void {
    // Verificar el rol actual y actualizar `autorizado`
    const role = this.authService.getRole();
    this.autorizado = role === 'ADMIN';
  }

  redirectToHome(): void {
    this.router.navigate(['']);
  }

  redirectToFavorites(): void {
    this.router.navigate(['favorites']);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.autorizado = false;
    this.router.navigate(['/login']);
  }
}
