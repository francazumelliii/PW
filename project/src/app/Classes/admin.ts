import { Injectable } from "@angular/core";
import { Delegate } from "../Interfaces/delegate";
import { DatabaseService } from "../Services/database.service";
import { Observable } from "rxjs";
import { APIResponse, Restaurant } from "../Interfaces/general";

@Injectable({
    providedIn: 'root'
})
export class Admin implements Delegate{

    constructor(
        private dbService: DatabaseService
    ){}
    getAllRestaurants(): Observable<APIResponse> {
        return this.dbService.get("/api/v1/restaurant/all")
    }
    getNearestRestaurants(lat: number | string, lon: number | string, county: string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/nearest?latitude=${lat}&longitude=${lon}&county=${county}`)
    }
}