
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor(private fb: FormBuilder) {
    this.initLoginForm()
    this.initReservationForm()
   }

   private loginFormGroup !: FormGroup;
   private reservationFormGroup !: FormGroup;

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
      quantity: new FormControl(null,[Validators.required,Validators.min(1), Validators.max(99)])
    })
   }

   get reservationForm(){
    return this.reservationFormGroup
   }



}
