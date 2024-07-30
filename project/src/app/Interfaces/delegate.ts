import { Observable } from "rxjs";
import { APIResponse, Restaurant } from "./general";
import { ApiService } from "../Services/api.service";

export interface Delegate {
    getAllRestaurants(): Observable<APIResponse>
    getNearestRestaurants(lat: number | string, lon: number | string): Observable<APIResponse>
    getRestaurantFromId(id: number | string): Observable<APIResponse>
    getTurns(): Observable<APIResponse>
    checkTablesAvailability(restaurant_id: number, date: string, turn_id: number): Observable<APIResponse>
    deleteReservation(id: number | string) :Observable<APIResponse>
}
