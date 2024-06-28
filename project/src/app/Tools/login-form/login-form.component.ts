import { Component, OnInit } from '@angular/core';
import { FormControlService } from '../../Services/form-control.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.sass'
})
export class LoginFormComponent implements OnInit{

  constructor(
    private fcService: FormControlService
  ){}
  loginForm !: FormGroup

  ngOnInit(){
    this.loginForm = this.fcService.loginForm
  }

  onSubmit(){
    const email = this.loginForm.get("email")?.value
    const password = this.loginForm.get("password")?.value

      console.log(email,password)
      console.log(!this.loginForm.valid && this.loginForm.touched)
  }

}
