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

  ngOnInit(){
    this.loginForm = this.fcService.loginForm
  }

  onSubmit(){
    const email = this.loginForm.get("email")?.value
    const password = this.loginForm.get("password")?.value
    this.view === "LOGIN" ? this.signIn(email,password) : this.signUp(email,password)

  }

  switchView(){
    this.view === "LOGIN" ? this.view = "SIGNUP" : this.view = "LOGIN"
  }
  
  signIn(email: string, password: string){
    
    this.authService.signIn(email,password)
    .subscribe((response: any) => {
      response.access_token ? 
        (localStorage.setItem("token", response.accessToken),
          this.router.navigate(['homepage'])
        )
          : null //TO FINISH
    })
  }

  signUp(email:string, password: string){
    
  }
}
