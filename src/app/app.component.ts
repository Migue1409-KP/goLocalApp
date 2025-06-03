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
  authorizedAdmin: boolean = false;
  authorizedUser: boolean = false;
  authorizedOwner: boolean = false;
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
    const role = this.authService.getRole();
    this.authorizedAdmin = role === 'ADMIN';
    this.authorizedUser = role === 'USER';
    this.authorizedOwner = role === 'OWNER';
  }

  redirectToHome(): void {
    this.router.navigate(['']);
  }

  redirectToFavorites(): void {
    this.router.navigate(['favorites']);
  }

  redirectToPerfil(): void {
    this.router.navigate(['perfil']);
  }

  redirectToAdmin(): void {
    this.router.navigate(['admin']);
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    this.authorizedAdmin = false;
    this.authorizedUser = false;
    this.authorizedOwner = false;
    this.router.navigate(['/login']);
  }
}
