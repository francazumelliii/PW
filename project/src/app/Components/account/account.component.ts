import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { RoleService } from '../../Services/role.service';
import { Admin, APIResponse, Customer, Favorites, Reservation, Restaurant, Stats } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { RestaurantInfoComponent } from '../restaurant-info/restaurant-info.component';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent implements OnInit {
  
  constructor(
    private dbService: DatabaseService,
    public roleService: RoleService,
    private swal : SweetalertService,
    private router: Router
    ){}
    
    reservations: Reservation[] = []
    user!: Customer | Admin 
    restaurant!: Restaurant
    _isOpened: boolean = false;
    favoriteRestaurants: Favorites[] = []
    RestaurantInfoComponent!: RestaurantInfoComponent;
    reservationStats: Stats[] = [];
    availableSeats: number = 0;
    totalSeats: number = 0;

  ngOnInit(): void {
    if(this.roleService.role ==='customer'){
      this.getUserReservations()
      this.getFavoritesRestaurants()
      this.getAccount()
    }else{
      this.getAdminRestaurant()
      this.getAccount()
      
    }

  }
    


  getAccount(){
    this.roleService.getUser()
      .subscribe((response: APIResponse) => {
        response.success ? this.user = response.data : null
      },(error : any) => {
        this.swal.fire("error","ERROR","Error retrieving account data... try later","")
        console.error(error)
      })
  }

  getUserReservations(){
    this.dbService.get(`/api/v1/reservation/customer/me`)
      .subscribe((response: APIResponse) => {
        response.success ? (this.reservations = response.data): null
        console.log("RESERVATION",this.reservations)
      },(error: any) => {
        console.error(error),
        this.swal.fire("error", "ERROR", "Error retrieving data... try later", "")
      })
  }
  switchPanelStatus(){
    this._isOpened = !this._isOpened
  }

  getFavoritesRestaurants(){
    this.roleService.getFavoritesRestaurants()
      .subscribe((response: APIResponse) => {
        response.success ? this.favoriteRestaurants = response.data : null
        console.log("FAVORITES", response.data)
      }, (error: any) => {
        console.error(error),
        this.swal.fire("error", "ERROR", "Error retrieving data... try later", "")
      })
  }
  getAdminRestaurant(){
    this.dbService.get("/api/v1/restaurant/admin/me")
      .subscribe((response: APIResponse) => {
        response.success ? this.restaurant = response.data[0] : null
        
        this.getStats(+this.restaurant.id)
        this.getAvailableSeats(+this.restaurant.id)
      }, (error: any) => {
        console.error(error),
        this.swal.fire("error", "ERROR", "Error retrieving data for admin restaurant...try later", "")
      })
  }

  getStats(id: number){
    this.dbService.get(`/api/v1/reservation/restaurant/${id}/stats`)  
      .subscribe((response: APIResponse) => {
        response.success ? this.reservationStats = response.data : null
        console.log(this.reservationStats)
      }, (error: any)=> {
        console.error(error),
        this.swal.fire("error", "Error retrieving data for statistics", "")
      })
  }

  getAvailableSeats(id: number){
    this.dbService.get(`/api/v1/reservation/restaurant/${id}/seats`)
      .subscribe((response: APIResponse) => {
        response.success ? (
          this.availableSeats = response.data.available,
          this.totalSeats = response.data.total
        ) : null
      }, (error: any) => {
        console.error(error);
        this.swal.fire("error", "ERROR","Error retrieving data for seats", "")
      })
  }



}
