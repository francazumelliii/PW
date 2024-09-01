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
        return this.dbService.get(`/api/v1/admin/restaurant`)
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
    getRestaurantImages(id: number): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/img?id=${id}`)
    }
    getAllMenus(id: number): Observable<APIResponse> {
        return this.dbService.get(`/api/v1/restaurant/menu?id=${id}`)
    }
    getRestaurantReservations(id: number){
        return this.dbService.get(`/api/v1/restaurant/reservation?id=${id}`)
    }
    openViewModal(reservation: Reservation){
        return this.modalService.open(UpdateModalComponent, {reservation: reservation}, "VIEW RESERVATION")
    }
}
