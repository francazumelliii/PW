import { Component, OnInit } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { Restaurant } from '../../Interfaces/general';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass'
})
export class HomepageComponent implements OnInit{
  constructor(
    private roleService: RoleService,
  ){}


  ngOnInit(){
    this.roleService.getAllRestaurants().subscribe((res:Restaurant) => console.log(res))
  }
}
