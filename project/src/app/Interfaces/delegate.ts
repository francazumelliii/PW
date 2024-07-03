import { Observable } from "rxjs";
import { APIResponse, Restaurant } from "./general";

export interface Delegate {
    getAllRestaurants(): Observable<APIResponse>
}
