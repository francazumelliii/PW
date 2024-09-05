import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {APIResponse, Menu, Restaurant} from '../../Interfaces/general';
import { DatabaseService } from '../../Services/database.service';
import { RoleService } from '../../Services/role.service';
import { SweetalertService } from '../../Services/sweetalert.service';
@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrl: './restaurant-info.component.sass'
})
export class RestaurantInfoComponent implements OnInit {
  @Input() role: string = "CUSTOMER"
  @Input() menus!: Menu[]
  @Input() restaurant!: Restaurant


  constructor(private dbService: DatabaseService, private roleService: RoleService, private swal: SweetalertService){

  }
  ngOnInit(){
   
  } 




}
