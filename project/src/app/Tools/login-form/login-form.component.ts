import { Component, OnInit } from '@angular/core';
import { FormControlService } from '../../Services/form-control.service';
import { FormGroup } from '@angular/forms';
import { AuthenticationService } from '../../Services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.sass'
})
export class LoginFormComponent implements OnInit{

  constructor(
    private fcService: FormControlService,
    private authService: AuthenticationService,
    private router: Router
  ){}
  loginForm !: FormGroup
  view: "LOGIN" | "SIGNUP" = "LOGIN"
  error: string = ""

  ngOnInit(){
    this.loginForm = this.fcService.loginForm
  }

  onSubmit(){
    const email = this.loginForm.get("email")?.value
    const password = this.loginForm.get("password")?.value

    if (this.view === "SIGNUP"){
      const name = this.loginForm.get("name")?.value
      const surname = this.loginForm.get("surname")?.value

      this.signUp(name,surname,email,password)
    }else{
      console.log("SIGNIN")
      this.signIn(email,password)
    }

  }

  switchView(){
    this.view === "LOGIN" ? this.view = "SIGNUP" : this.view = "LOGIN"
  }
  
  signIn(email: string, password: string){
    
    this.authService.signIn(email,password)
    .subscribe((response: any) => {
      response.access_token ? 
        (this.authService.setToken(response.access_token)): console.log("response") //TO FINISH
    })
  }

  signUp(name: string, surname:string, email:string, password: string){
    this.error = ""
    this.authService.signUp(name,surname,email,password)
      .subscribe((response: any) => {
        console.log(response)
        response.access_token ? (this.authService.setToken(response.access_token)) : null
        response.error ? this.error = response.error : null
      })
  }




}
