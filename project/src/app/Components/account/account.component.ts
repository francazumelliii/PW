import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { RoleService } from '../../Services/role.service';
import { Admin, APIResponse, Customer, Favorites, Reservation } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrl: './account.component.sass'
})
export class AccountComponent implements OnInit {
  
  constructor(
    private dbService: DatabaseService,
    private roleService: RoleService,
    private swal : SweetalertService
    ){}
    
    reservations: Reservation[] = []
    user!: Customer | Admin 
    _isOpened: boolean = false;
    favoriteRestaurants: Favorites[] = []

  ngOnInit(){
    this.getAccount()
    this.getUserReservations()
    this.getFavoritesRestaurants()
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
}
