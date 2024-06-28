import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { HttpClient } from '@angular/common/http';
import { ɵcamelCaseToDashCase } from '@angular/animations/browser';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  private domain: string = "http://localhost:8000"
  constructor(
    private http: HttpClient
  ) { }


  signIn(email:string, password:string){
    const body = {
      email: email,
      password: password
    }
    return this.http.post(`${this.domain}/api/v1/signin`, body)
      .pipe(
        catchError((error: any) => {
          return throwError(() => new Error(error))
        })
      )


  }



  signUp(email: string, password: string){
    const body = {
      email: email,
      password: password
    }
    return this.http.post(`${this.domain}/api/v1/signin`, body)
      .pipe(
        catchError((error: any) => {
          return throwError(() => new Error(error))
        })
      )


  }
 
}
