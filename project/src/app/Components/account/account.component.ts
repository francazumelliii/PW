import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { RoleService } from '../../Services/role.service';
import { Admin, APIResponse, Customer, Favorites, Reservation, Restaurant } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { RestaurantInfoComponent } from '../restaurant-info/restaurant-info.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent implements OnInit {
  
  constructor(
    private dbService: DatabaseService,
    public roleService: RoleService,
    private swal : SweetalertService
    ){}
    
    reservations: Reservation[] = []
    user!: Customer | Admin 
    restaurant!: Restaurant 
    _isOpened: boolean = false;
    favoriteRestaurants: Favorites[] = []
    RestaurantInfoComponent!: RestaurantInfoComponent;

  ngOnInit(){
    this.getAccount()
    if(this.roleService.role ==='customer'){
      this.getUserReservations()
      this.getFavoritesRestaurants()
    }else{
      this.getAdminRestaurant()
    }
  } 


  getAccount(){
    const role = this.roleService.role
    this.dbService.get(`/api/v1/user?role=${role}`)
      .subscribe((response: APIResponse) => {
        response.success ? this.user = response.data : null
        console.log(this.user)
      },(error : any) => {
        this.swal.fire("error","ERROR","Error retrieving account data... try later","")
        console.error(error)
      })
  }

  getUserReservations(){
    this.dbService.get(`/api/v1/user/reservation`)
      .subscribe((response: APIResponse) => {
        response.success ? (this.reservations = response.data): null
        console.log(this.reservations)
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
    this.dbService.get("/api/v1/admin/restaurant")
      .subscribe((response: APIResponse) => {
        response.success ? this.restaurant = response.data[0] : null
        console.log(this.restaurant)
      }, (error: any) => {
        console.error(error),
        this.swal.fire("error", "ERROR", "Error retrieving data for admin restaurant...try later", "")
      })
  }



}
