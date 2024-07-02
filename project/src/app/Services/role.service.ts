import { Injectable } from '@angular/core';
import { Delegate } from '../Interfaces/delegate';
import { Admin } from '../Classes/admin';
import { Customer } from '../Classes/customer';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  
  private delegate!: Delegate;

  constructor(
    private adminClass: Admin,
    private customerClass: Customer
  ) {}
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


// ------------ DELEGATE FUNCTIONS ------------ //
  getAllRestaurants() {
    return this.delegate.getAllRestaurants();
  }
}
