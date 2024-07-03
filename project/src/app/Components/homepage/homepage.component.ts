import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { APIResponse, Restaurant } from '../../Interfaces/general';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass'
})
export class HomepageComponent implements OnInit{
  constructor(
    private roleService: RoleService,
  ){}

  restaurantsList: Restaurant[] = [];


  ngOnInit(){
    this.getAllRestaurants()
  }

  getAllRestaurants(){
    this.roleService.getAllRestaurants()
      .subscribe((response: APIResponse) => {
        response.success ? this.restaurantsList = response.data : null
        console.log(response.data)
      },((error: any) => console.error(error)))
  }
}
