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

  private domain: string = "http://localhost:8080";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  signIn(mail: string, password: string): Observable<any>{
    const body = {mail: mail, password: password}
    return this.http.post(`${this.domain}/api/v1/authenticate`, body)
  }

  signUp(name: string, surname: string, email: string, password: string){
    const body = {
      mail: email,
      name: name,
      surname: surname,
      password: password,
      list: ""
    }
    console.log(`${this.domain}/api/v1/signup`, body)
    return this.http.post(`${this.domain}/api/v1/signup`, body)
  
  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
    console.log("STORED: ", token);
    
    if(localStorage.getItem("token") != null){

      setTimeout(() => {
        this.router.navigate(['homepage']);
      }, 0);
    }
  }
  

  logOut() {
    localStorage.removeItem("token");
    this.router.navigate(['authentication']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem("token");
    if(token && !this.isTokenExpired(token)){
      return true
    }else{
      return false
    }
  }

  isTokenExpired(token: string): boolean {
    const payload = token.split('.')[1]; 
    const decodedPayload = JSON.parse(atob(payload));
    const expirationTime = decodedPayload.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return expirationTime < currentTime;
  }
  

  get mail() {
    return localStorage.getItem("mail")
  }

}
