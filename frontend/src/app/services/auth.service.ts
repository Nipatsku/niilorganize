import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  useAuth(headers: HttpHeaders): HttpHeaders {
    const token = localStorage.getItem('auth');
    return headers.append('Authorization', token as string);
  }

  async testExistingAuth(): Promise<boolean> {
    let headers = new HttpHeaders();
    headers = this.useAuth(headers);
    return new Promise((resolve) => {
      this.http
        .get('/api/auth/test', { headers, responseType: 'text' })
        .subscribe({
          complete: () => resolve(true),
          error: (e) => resolve(false),
        });
    });
  }

  login(password: string) {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    this.http.post('/api/auth', { password }, { headers }).subscribe(
      (response) => {
        const data = response as { token: string };
        localStorage.setItem('auth', data.token);
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        alert(`Access denied`);
      }
    );
  }
}
