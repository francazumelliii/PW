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


  private domain: string = "http://localhost:8000"
  constructor(
    private http: HttpClient,
    private router: Router,
    private dbService: DatabaseService
  ) { }


  signIn(email:string, password:string){
    const body = {
      email: email,
      password: password
    }
    return this.http.post(`${this.domain}/api/v1/signin`, body)
      .pipe(
        catchError((error: any) => {
          return error
        })
      )


  }

  signUp(name: string, surname: string, email: string, password: string){
    const body = {
      name: name,
      surname: surname,
      email: email,
      password: password
    }
    return this.http.post(`${this.domain}/api/v1/signup`, body)
      .pipe(
        catchError((error: any) => {
          return error
        })
      )


  }

  setToken(token: string){
    localStorage.setItem("token",token)
    console.log("STORED: ", token)
    this.router.navigate(['homepage'])
  }
 


  logOut(){ 
    localStorage.removeItem("token")
    this.router.navigate(['authentication'])
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
        console.log(error)
        return error
      })
    );
  }
 

  

  get mail() {
    return localStorage.getItem("mail")
  }

}
