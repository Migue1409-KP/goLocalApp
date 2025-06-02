import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean {
    // Check if the user is logged in and has ADMIN role
    if (this.authService.isLoggedIn()) {
      return true;
    }
    
    // Redirect to login or unauthorized page if not an admin
    this.router.navigate(['/login']); // or '/unauthorized'
    return false;
  }
}