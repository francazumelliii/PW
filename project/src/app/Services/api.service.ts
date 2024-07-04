import { Injectable } from '@angular/core';
import { DatabaseService } from './database.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  reverseGeolocation(token: string,latitude: number, longitude: number){
    return this.http.get(`https://us1.locationiq.com/v1/reverse?key=${token}&lat=${latitude}&lon=${longitude}&format=json`)
      .pipe(
        catchError((error: any) => {
          throw new Error(error)
        })
      )
  }
}
