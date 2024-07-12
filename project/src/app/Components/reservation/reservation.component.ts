import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { APIResponse, Turn } from '../../Interfaces/general';
import { formatDate } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { DatabaseService } from '../../Services/database.service';
import { SweetalertService } from '../../Services/sweetalert.service';
import { FormControlService } from '../../Services/form-control.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.sass'
})
export class ReservationComponent implements OnInit {

  reservationForm!: FormGroup;
  today: string = formatDate(new Date(), 'dd/MM/yyyy', 'en-US');
  turns: Turn[] = [];
  _isDateInFuture: boolean = false;


  @Output() _isAvailable = new EventEmitter<boolean>()
  @Input() restaurantId!: number | string 

  constructor(
    private dbService: DatabaseService,
    private roleService: RoleService,
    private swal: SweetalertService,
    private formService: FormControlService
  ) {
    this.reservationForm = this.formService.reservationForm;
  }
  ngOnInit(){
    this.getTurns()
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
  checkForTables() {
    console.log(this.reservationForm.controls['turn'].value);
  }

  checkDate(event: any) {
    this._isDateInFuture = this.reservationForm.controls['date'].touched && event >= new Date();
  }


  checkTablesAvailability(id: number, date: string, turn: number, quantity: number){
    this.roleService.checkTablesAvailability(id, date, turn)
      .subscribe((response: APIResponse) => {
        if (response.success) {
          const available_seats = response.data.available_seats - quantity
          this._isAvailable.emit(available_seats >= 0)
        } else {
          this.swal.fire('error', 'Error', 'No available tables', '');
        }
      });
  }
  handleButtonClick(){
    const date = formatDate(this.reservationForm.controls['date'].value, "yyyy-MM-dd", "en-US")
    const turn_id = this.reservationForm.controls['turn'].value
    const quantity = this.reservationForm.controls['quantity'].value
    this.checkTablesAvailability(+this.restaurantId, date, turn_id, quantity)
  }

}
