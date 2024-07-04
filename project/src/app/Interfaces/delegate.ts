import { Observable } from "rxjs";
import { APIResponse, Restaurant } from "./general";
import { ApiService } from "../Services/api.service";

export interface Delegate {
    getAllRestaurants(): Observable<APIResponse>
    getNearestRestaurants(lat: number | string, lon: number | string, county: string): Observable<APIResponse>
    
}
