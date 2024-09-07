import { Observable } from "rxjs";
import { APIResponse, Reservation, Restaurant } from "./general";
import { ApiService } from "../Services/api.service";

export interface Delegate {
    getAllRestaurants(): Observable<APIResponse>
    getNearestRestaurants(lat: number | string, lon: number | string): Observable<APIResponse>
    getRestaurantFromId(id: number | string): Observable<APIResponse>
    getTurns(): Observable<APIResponse>
    checkTablesAvailability(restaurant_id: number, date: string, turn_id: number): Observable<APIResponse>
    deleteReservation(id: number | string) :Observable<APIResponse>
    searchRestaurants(toSearch: string) : Observable<APIResponse>
    getFavoritesRestaurants(): Observable<APIResponse>
    getRestaurantImages(id: number): Observable<APIResponse> | any
    getAllMenus(id: number) : Observable<APIResponse> | any
    getRestaurantReservations(id: number): Observable<APIResponse> | any
    openViewModal(reseravtion: Reservation): void
    getUser(): Observable<APIResponse>
}
