import { Injectable } from '@angular/core';
import { Delegate } from '../Interfaces/delegate';
import { Admin } from '../Classes/admin';
import { Customer } from '../Classes/customer';
import { APIResponse, Reservation } from '../Interfaces/general';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  private delegate!: Delegate;

  constructor(
    private adminClass: Admin,
    private customerClass: Customer
  ) {
    this.loadUserType()
  }
  type:string = ""

  setUserType(userType: string){
    this.type = userType;
    localStorage.setItem("user_type",userType)
    console.log("STORED: ", userType)

    this.initInterface()
  }

  get role(): string{
    return this.type
  }

  initInterface(){
    if(this.type === "admin") this.delegate = this.adminClass
    else if(this.type === "customer") this.delegate = this.customerClass
  }

  storeMail(mail: string){
    localStorage.setItem("mail", mail)
  }

  get mail(){
    return localStorage.getItem("mail")
  }

  loadUserType() {
    const storedUserType = localStorage.getItem("user_type");
    if (storedUserType) {
      this.type = storedUserType;
      this.initInterface();
    }
  }

// ------------ DELEGATE FUNCTIONS ------------ //
  getAllRestaurants(): Observable<any> {
    return this.delegate.getAllRestaurants()
  }

  getNearestRestaurants(lat:number | string, lon: number | string){
    return this.delegate.getNearestRestaurants(lat,lon)
  }

  getRestaurantFromId(id: number | string){
    return this.delegate.getRestaurantFromId(id)
  }

  getTurns(){
    return this.delegate.getTurns()
  }
  checkTablesAvailability(restaurant_id: number, date: string, turn_id: number){
    return this.delegate.checkTablesAvailability(restaurant_id, date, turn_id )
  }
  deleteReservation(id: number | string){
    return this.delegate.deleteReservation(id)
  }
  searchRestaurants(toSearch: string){
    return this.delegate.searchRestaurants(toSearch)
  }
  getFavoritesRestaurants(){
    return this.delegate.getFavoritesRestaurants()
  }
  getRestaurantImages(id: number){
    return this.delegate.getRestaurantImages(id)
  }
  getAllMenus(id: number){
    return this.delegate.getAllMenus(id)
  }
  getRestaurnatReservations(id: number){
    return this.delegate.getRestaurantReservations(id)
  }
  openViewModalOrRedirect(reservation: Reservation){
    return this.delegate.openViewModal(reservation)
  }
  getUser(){
    return this.delegate.getUser()
  }
}
