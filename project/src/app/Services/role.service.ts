import { Injectable } from '@angular/core';
import { Delegate } from '../Interfaces/delegate';
import { Admin } from '../Classes/admin';
import { Customer } from '../Classes/customer';
import { APIResponse } from '../Interfaces/general';
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


  loadUserType() {
    const storedUserType = localStorage.getItem("user_type");
    if (storedUserType) {
      this.type = storedUserType;
      this.initInterface();
    }
  }

// ------------ DELEGATE FUNCTIONS ------------ //
  getAllRestaurants(): Observable<any> {
    if(!this.delegate){
      throw new Error("Delegate not properly initialized")
    }
    return this.delegate.getAllRestaurants()
  }
}
