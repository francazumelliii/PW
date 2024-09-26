import { HttpClient, HttpHeaderResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  
  private token: string = ""
  private domain: string = "http://localhost:8080"

  constructor(
    private http: HttpClient
  ) {
    const token = localStorage.getItem("token")
    token ? this.token = token : null
  }
  
  private get headers(): HttpHeaders {
    const token = localStorage.getItem("token") || "";
    return new HttpHeaders({ "Authorization": `Bearer ${token}` });
  }

  public get(endpoint: string): Observable<any>{
    return this.http.get(`${this.domain}${endpoint}`, {headers: this.headers})
      .pipe(
        catchError((error: any) => {
          throw new Error(error)
        })
      )
  }
  public post(endpoint: string, body: any): Observable<any>{
    return this.http.post(`${this.domain}${endpoint}`, body, {headers: this.headers})
      .pipe(
        catchError((error: any) => {
          throw new Error(error)
        })
      )
  }
  public put(endpoint: string, body: any): Observable<any>{
    return this.http.put(`${this.domain}${endpoint}`, body, {headers: this.headers})
      .pipe(
        catchError((error: any) => {
          throw new Error(error)
        })
      )
  }
  public patch(endpoint: string, body: any): Observable<any>{
    return this.http.patch(`${this.domain}${endpoint}`, body, {headers: this.headers})
      .pipe(
        catchError((error: any) => {
          throw new Error(error)
        })
      )
  }
  public delete(endpoint: string): Observable<any>{
    return this.http.delete(`${this.domain}${endpoint}`, {headers: this.headers})
      .pipe(
        catchError((error: any) => {
          throw new Error(error)
        })
      )
  }



}
