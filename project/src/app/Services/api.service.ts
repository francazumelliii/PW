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

  getStaticMapWithMarkers(markers: any[], lat: number, lon: number){
    return this.http.get("https://maps.geoapify.com/v1/staticmap?style=osm-bright&center=lonlat:-122.389075,47.336414&zoom=9.8099&marker=lonlat:-122.389075,47.336414;color:%23ab00ff;icon:utensils&scaleFactor=2&width=1000&height=500&apiKey=31274a2ec68e438ebcd9883478bb9d2a")
  }

}
