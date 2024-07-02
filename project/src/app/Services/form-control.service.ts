import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormControlService {

  constructor(private fb: FormBuilder) {
    this.initLoginForm()
   }

   private loginFormGroup !: FormGroup;


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



}
