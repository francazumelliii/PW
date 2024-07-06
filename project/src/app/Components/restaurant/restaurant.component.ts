import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../Services/role.service';
import { APIResponse } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';

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
    private swal: SweetalertService
  ){}
  restaurantId!: string | number

  ngOnInit(){
    this.route.params.subscribe((params:any) => {
      this.restaurantId = params["id"]
      this.getRestaurantFromId()
    })
  }

  getRestaurantFromId(){
    this.roleService.getRestaurantFromId(this.restaurantId)
      .subscribe((response: APIResponse) => {
        response.success ? (
          console.log(response.data)
        ) : this.swal.error("error","Error","Error retriving data","")
      })
  }
}
