import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { url } from 'inspector';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  
  const token = authService.getToken();
  const noAuthUrls = [
    '/api/v1/rest/users',
    '/api/v1/rest/authentication/login',

  ];

  // Si no es una URL que no requiere autenticación o no es un POST, agregar el token
  const isNoAuthUrlPost =  noAuthUrls.some(url =>req.url.includes(url) && req.method === 'POST')

  if (!isNoAuthUrlPost && token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 403) {
        authService.setRedirectUrl(router.url);
        authService.logout();
      }
      return throwError(() => new Error(error.error));
    })
  );
};
