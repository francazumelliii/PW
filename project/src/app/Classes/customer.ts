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
        return this.dbService.get("/api/v1/restaurant/all")
    }
    getNearestRestaurants(lat: number | string, lon: number | string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/nearest?lat=${lat}&lon=${lon}`)
    }
    getRestaurantFromId(id: number | string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/${id}`)
    }
    getTurns(): Observable<APIResponse>{
        return this.dbService.get("/api/v1/turn/all")
    }
    checkTablesAvailability(restaurant_id: number, date: string, turn_id: number): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/${restaurant_id}/tables?date=${date}&turnId=${turn_id}`)
    }
    deleteReservation(id: number | string): Observable<APIResponse> {
        return this.dbService.delete(`/api/v1/reservation/${id}`)
    }
    searchRestaurants(toSearch: string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/search?toSearch=${toSearch}`)
    }
    getFavoritesRestaurants(): Observable<APIResponse> {
        return this.dbService.get("/api/v1/restaurant/customer/me/favorites")
    }
    getRestaurantImages(id: number): Observable<APIResponse> | any {
        return;
        
    }
    getAllMenus(id: number) : Observable<APIResponse> | any {

    }
    getRestaurantReservations(id: number){
        
    }
    openViewModal(reservation: Reservation){
        this.router.navigate(['/restaurant/' + reservation.restaurant.id])
    }
    getUser(){
        return this.dbService.get("/api/v1/customer/me")
    }
}