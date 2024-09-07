import { Injectable } from "@angular/core";
import { Delegate } from "../Interfaces/delegate";
import { DatabaseService } from "../Services/database.service";
import { Observable } from "rxjs";
import { APIResponse, Reservation, Restaurant } from "../Interfaces/general";
import { ApiService } from "../Services/api.service";
import { ModalService } from "../Services/modal.service";
import { UpdateModalComponent } from "../Tools/update-modal/update-modal.component";

@Injectable({
    providedIn: 'root'
})
export class Admin implements Delegate{

    constructor(
        private dbService: DatabaseService,
        private modalService: ModalService
    ){}
    getAllRestaurants(): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/admin/me`)
    }
    getNearestRestaurants(lat: number | string, lon: number | string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/nearest?lat=${lat}&lon=${lon}`)
    }
    getRestaurantFromId(id: number | string): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/${id}`)
    }
    getTurns(): Observable<APIResponse>{
        return this.dbService.get("/api/v1/turns")
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
        return this.dbService.get("/api/v1/customer/me/favorites")
    }
    getRestaurantImages(id: number): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/imgs/restaurant/${id}`)
    }
    getAllMenus(id: number): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/menu/restaurant/${id}`)
    }
    getRestaurantReservations(id: number){
        return this.dbService.get(`/api/v1/reservation/restaurant/${id}`)
    }
    openViewModal(reservation: Reservation){
        return this.modalService.open(UpdateModalComponent, {reservation: reservation}, "VIEW RESERVATION")
    }
    getUser(){
        return this.dbService.get("/api/v1/admin/me")
    }
}
