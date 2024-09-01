
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { numberValidator } from '../Tools/number-validator';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor(private fb: FormBuilder) {
    this.initLoginForm()
    this.initReservationForm()
    this.initUpdateRestaurantForm()
    this.initUpdateReservationForm()
   }

   private loginFormGroup !: FormGroup;
   private reservationFormGroup !: FormGroup;
   private updateRestaurantFormGroup !: FormGroup
   private updateReservationFormGroup !: FormGroup

   initLoginForm(){
    this.loginFormGroup = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required, Validators.minLength(8)]),
      name: new FormControl(""),
      surname: new FormControl("")
    })
   }
    get loginForm(){
    return this.loginFormGroup
   }

   initReservationForm(){
    const today = formatDate(new Date(), "dd/MM/yyyy", "en-US")
    this.reservationFormGroup = this.fb.group({
      date: new FormControl(null, Validators.required),
      turn: new FormControl(null,Validators.required),
      quantity: new FormControl(null,[Validators.required,Validators.min(1), Validators.max(99)]),
      mail: new FormControl(null, [Validators.required, Validators.email])
    })
   }

   get reservationForm(){
    return this.reservationFormGroup
   }

   initUpdateRestaurantForm(){
    this.updateRestaurantFormGroup = this.fb.group({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      village: new FormControl(null, Validators.required),
      street:  new FormControl(null, Validators.required),
      streetNumber:  new FormControl(null, Validators.required),
      latitude:  new FormControl(null, [Validators.required, numberValidator()]),
      longitude:  new FormControl(null, [Validators.required, numberValidator()]),
      maxChairs:  new FormControl(null, [Validators.required, numberValidator()]),
      banner:  new FormControl(null, Validators.required)
    })
   }

   get updateRestaurantForm(){
    return this.updateRestaurantFormGroup
   }

   initUpdateReservationForm(){
    this.updateReservationFormGroup = this.fb.group({
      date: new FormControl(Validators.required ),
      turn: new FormControl(Validators.required),
      mail: new FormControl(Validators.required, Validators.email),
      quantity: new FormControl([Validators.required, numberValidator()]),
      restaurantName: new FormControl(),
      restaurantStreet: new FormControl(),
      restaurantStreetNumber: new FormControl(),
    })
   }

   get updateReservationForm(){
    return this.updateReservationFormGroup;
   }


}
