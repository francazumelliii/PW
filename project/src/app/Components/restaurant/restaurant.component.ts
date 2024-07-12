import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../Services/role.service';
import { APIResponse, Turn } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { FormControlService } from '../../Services/form-control.service';
import { FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Stepper } from 'primeng/stepper';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.sass']
})
export class RestaurantComponent implements OnInit {

  restaurantId!: string | number;

  constructor(
    private dbService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private swal: SweetalertService,
    private formService: FormControlService
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.restaurantId = params['id'];
      this.getRestaurantFromId();
    });

  }



  getRestaurantFromId() {
    this.roleService.getRestaurantFromId(this.restaurantId)
      .subscribe((response: APIResponse) => {
        if (response.success) {
          console.log(response.data);
        } else {
          this.swal.fire('error', 'Error', 'Error retrieving data', '');
        }
      });
  }

  handleAvailability(event: boolean){
    console.log(event)
  }
}
