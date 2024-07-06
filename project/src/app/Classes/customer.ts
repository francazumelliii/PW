import { Injectable } from "@angular/core";
import { Delegate } from "../Interfaces/delegate";
import { DatabaseService } from "../Services/database.service";
import { APIResponse, Restaurant } from "../Interfaces/general";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
export class Customer implements Delegate{


    constructor( private dbService: DatabaseService ){}
    getAllRestaurants(): Observable<APIResponse> {
        return this.dbService.get("/api/v1/restaurant/all")
    }
    getNearestRestaurants(lat: number | string, lon: number | string, county: string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/nearest?latitude=${lat}&longitude=${lon}&county=${county}`)
    }
    getRestaurantFromId(id: number | string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant?id=${id}`)
    }
}