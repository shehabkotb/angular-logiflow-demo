import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

const TOKEN_KEY = 'logiflow_token';

// demo only, no real auth backend
const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = 'admin123';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);

  login(username: string, password: string): boolean {
    if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
      localStorage.setItem(TOKEN_KEY, 'fake-jwt-token');
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
