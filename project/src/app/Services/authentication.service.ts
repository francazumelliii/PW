import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { HttpClient } from '@angular/common/http';
import { ɵcamelCaseToDashCase } from '@angular/animations/browser';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private domain: string = "http://localhost:8000";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signIn(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.domain}/api/v1/signin`, body)
      .pipe(
        map((response: any) => {
          if (response.token) {
            this.setToken(response.token);
          }
          return response;
        }),
        catchError((error: any) => {
          return of(error);
        })
      );
  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
    console.log("STORED: ", token);
    this.router.navigate(['homepage']).then(() => {
      window.location.reload();
    });
  }

  logOut() {
    localStorage.removeItem("token");
    this.router.navigate(['authentication']);
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem("token");
    if (token) {
      return this.verifyToken(token).pipe(
        map((response: any) => response.valid),
        catchError(() => of(false))
      );
    } else {
      return of(false);
    }
  }

  verifyToken(token: string) {
    return this.http.get(`${this.domain}/api/v1/token`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).pipe(
      catchError((error: any) => {
        console.log(error);
        return error;
      })
    );
  }

  get mail() {
    return localStorage.getItem("mail")
  }

}
