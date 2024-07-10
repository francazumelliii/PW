import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../Services/role.service';
import { APIResponse, Turn } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { FormControlService } from '../../Services/form-control.service';
import { FormGroup } from '@angular/forms';
import { Dropdown } from 'primeng/dropdown';
import { formatDate } from '@angular/common';
import { Calendar } from 'primeng/calendar';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrl: './restaurant.component.sass'
})
export class RestaurantComponent implements OnInit{

  constructor(
    private dbService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private swal: SweetalertService,
    private formService: FormControlService
  ){
    this.reservationForm = this.formService.reservationForm
  }
  restaurantId!: string | number
  reservationForm!: FormGroup 
  today:string = formatDate(new Date(), "dd/MM/yyyy", "en-US")
  turns: Turn[] = []
  _isDateInFuture: boolean = false

  ngOnInit(){
    this.route.params.subscribe((params:any) => {
      this.restaurantId = params["id"]
      this.getRestaurantFromId()
    })

    this.getTurns()
  }
  getTurns(){
    this.roleService.getTurns()
      .subscribe((response: APIResponse) => {
        response.success ? this.turns = response.data : this.swal.fire("error", "ERROR", "Error retriving data","")
      })
  }

  getRestaurantFromId(){
    this.roleService.getRestaurantFromId(this.restaurantId)
      .subscribe((response: APIResponse) => {
        response.success ? (
          console.log(response.data)
        ) : this.swal.fire("error","Error","Error retriving data","")
      })
  }

  checkForTables(){
    console.log(this.reservationForm.controls['turn'].value)
  }


  checkDate(event: any){
    this._isDateInFuture = this.reservationForm.controls['date'].touched && event >= new Date()
  }

}
