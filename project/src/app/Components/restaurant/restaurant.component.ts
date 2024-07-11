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

  @ViewChild('stepper') stepper!: Stepper;
  activeStep: number = 0;
  restaurantId!: string | number;
  reservationForm!: FormGroup;
  today: string = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
  turns: Turn[] = [];
  _isDateInFuture: boolean = false;

  constructor(
    private dbService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private swal: SweetalertService,
    private formService: FormControlService
  ) {
    this.reservationForm = this.formService.reservationForm;
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.restaurantId = params['id'];
      this.getRestaurantFromId();
    });

    this.getTurns();
  }

  getTurns() {
    this.roleService.getTurns()
      .subscribe((response: APIResponse) => {
        if (response.success) {
          this.turns = response.data;
        } else {
          this.swal.fire('error', 'ERROR', 'Error retrieving data', '');
        }
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

  checkForTables() {
    console.log(this.reservationForm.controls['turn'].value);
  }

  checkDate(event: any) {
    this._isDateInFuture = this.reservationForm.controls['date'].touched && event >= new Date();
  }

  handleFirstNextClick() {
    const date = formatDate(this.reservationForm.controls['date'].value, 'yyyy-MM-dd', 'en-US');
    const turn_id = this.reservationForm.controls['turn'].value;
    this.checkTablesAvailability(+this.restaurantId, date, turn_id);
    this.activeStep += 1
  }

  handleLastNextClick() {
    this.activeStep += 1;
  }

  handlePrevClick() {
    this.activeStep -= 1;
  }

  onStepChange(event: any) {
    this.activeStep = event.index;
  }

  checkTablesAvailability(id: number, date: string, turn: number){
    this.roleService.checkTablesAvailability(id, date, turn)
      .subscribe((response: APIResponse) => {
        console.log(response);
        if (response.success) {
          this.activeStep += 1;
        } else {
          this.swal.fire('error', 'Error', 'No available tables', '');
        }
      });
  }
}
