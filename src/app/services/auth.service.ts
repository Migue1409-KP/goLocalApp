import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

interface LoginResponse {
  status: string;
  data: string[]; // JWT token en el primer elemento
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private redirectUrl!: string;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly ROLE_KEY = 'user_role';
  private readonly ID_KEY = 'user_id';
  private readonly TOKEN_EXPIRATION = 10 * 60 * 60;

  private url: string = 'http://localhost:8080/api/v1/rest/authentication/login';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  login(usuario: Usuario): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.url, usuario).pipe(
      tap((response: LoginResponse) => {
        const token = response.data?.[0];
        if (token) {
          this.setToken(token);
          this.setRoleAndId(token);
        } else {
          console.error('No se encontró el token en la respuesta');
        }
      })
    );
  }

  setToken(token: string): void {

    const expirationInDays = this.TOKEN_EXPIRATION / (60 * 60 * 24);

    this.cookieService.set(
      this.TOKEN_KEY,
      token,
      expirationInDays,
      '/',
      undefined,
      true,
      'Strict'
    );
  }

  getToken(): string {
    return this.cookieService.get(this.TOKEN_KEY);
  }

  removeToken(): void {
    this.cookieService.delete(this.TOKEN_KEY, '/');
    this.removeRoleAndId();
  }

  isLoggedIn(): boolean {
    return this.cookieService.check(this.TOKEN_KEY);
  }

  logout(): void {
    this.removeToken();
  }

  setRedirectUrl(url: string): void {
    this.redirectUrl = url;
  }

  private setRoleAndId(token: string): void {
    try {
      const decodedToken: any = jwtDecode(token);
      const role = decodedToken.rol;
      const id = decodedToken.id;
      this.cookieService.set(this.ROLE_KEY, role, this.TOKEN_EXPIRATION, '/', undefined, true, 'Strict');
      this.cookieService.set(this.ID_KEY, id, this.TOKEN_EXPIRATION, '/', undefined, true, 'Strict');
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }

  private removeRoleAndId(): void {
    this.cookieService.delete(this.ROLE_KEY, '/');
    this.cookieService.delete(this.ID_KEY, '/');
  }

  getRole(): string {
    return this.cookieService.get(this.ROLE_KEY);
  }

  getId(): string {
    return this.cookieService.get(this.ID_KEY);
  }
}
