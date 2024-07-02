import { Injectable } from "@angular/core";
import { Delegate } from "../Interfaces/delegate";
import { DatabaseService } from "../Services/database.service";
import { Observable } from "rxjs";
import { Restaurant } from "../Interfaces/general";

@Injectable({
    providedIn: 'root'
})
export class Admin implements Delegate{

    constructor(
        private dbService: DatabaseService
    ){}
    getAllRestaurants(): Observable<Restaurant> {
        return this.dbService.get("/api/v1/restaurant/all")
    }
}