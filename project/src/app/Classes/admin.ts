import { Injectable } from "@angular/core";
import { Delegate } from "../Interfaces/delegate";
import { DatabaseService } from "../Services/database.service";
import { Observable } from "rxjs";
import { APIResponse, Restaurant } from "../Interfaces/general";
import { ApiService } from "../Services/api.service";

@Injectable({
    providedIn: 'root'
})
export class Admin implements Delegate{

    constructor(
        private dbService: DatabaseService
    ){}
    getAllRestaurants(): Observable<APIResponse> {
        return this.dbService.get("/api/v1/restaurant")
    }
    getNearestRestaurants(lat: number | string, lon: number | string, county: string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/nearest?latitude=${lat}&longitude=${lon}&county=${county}`)
    }
    getRestaurantFromId(id: number | string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant?id=${id}`)
    }
    getTurns(): Observable<APIResponse>{
        return this.dbService.get("/api/v1/turns")
    }
    checkTablesAvailability(restaurant_id: number, date: string, turn_id: number): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/tables?date=${date}&turn=${turn_id}&id=${restaurant_id}`)
    }
    deleteReservation(id: number | string): Observable<APIResponse> {
        return this.dbService.delete(`/api/v1/user/reservation?id=${id}`)
    }
}