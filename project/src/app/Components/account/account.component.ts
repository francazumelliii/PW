import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { RoleService } from '../../Services/role.service';
import { Admin, APIResponse, Customer } from '../../Interfaces/general';
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

  user!: Customer | Admin 
  ngOnInit(){
    this.getAccount()

  }


  getAccount(){
    const role = this.roleService.role
    const mail = this.roleService.mail
    this.dbService.get(`/api/v1/user?mail=${mail}&role=${role}`)
      .subscribe((response: APIResponse) => {
        response.success ? this.user = response.data : null
        console.log(this.user)
      },(error : any) => {
        this.swal.fire("error","ERROR","Error retrieving account data... try later","")
        console.error(error)
      })
  }
}
