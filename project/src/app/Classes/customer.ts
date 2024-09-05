import { Injectable } from "@angular/core";
import { Delegate } from "../Interfaces/delegate";
import { DatabaseService } from "../Services/database.service";
import { APIResponse, Reservation, Restaurant } from "../Interfaces/general";
import { Observable } from "rxjs";
import { ApiService } from "../Services/api.service";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
  })
export class Customer implements Delegate{


    constructor( private dbService: DatabaseService, private router: Router ){}
    getAllRestaurants(): Observable<APIResponse> {
        return this.dbService.get("/api/v1/restaurant")
    }
    getNearestRestaurants(lat: number | string, lon: number | string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/nearest?latitude=${lat}&longitude=${lon}`)
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
    searchRestaurants(toSearch: string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/search?toSearch=${toSearch}`)
    }
    getFavoritesRestaurants(): Observable<APIResponse> {
        return this.dbService.get("/api/v1/user/reservation/favorites")
    }
    getRestaurantImages(id: number): Observable<APIResponse> | any {
        
    }
    getAllMenus(id: number) : Observable<APIResponse> | any {

    }
    getRestaurantReservations(id: number){
        
    }
    openViewModal(reservation: Reservation){
        this.router.navigate(['/restaurant/' + reservation.restaurant.id])
    }
}