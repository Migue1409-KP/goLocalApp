import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class OwnerAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot
  ): boolean {
    // Check if the user is logged in and has ADMIN role
    if (this.authService.isLoggedIn() && this.authService.getRole() === 'OWNER') {
      return true;
    }
    
    // Redirect to login or unauthorized page if not an admin
    this.router.navigate(['']); // or '/unauthorized'
    return false;
  }
}