import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from '../../Services/database.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleService } from '../../Services/role.service';
import { APIResponse, Turn } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { FormControlService } from '../../Services/form-control.service';
import { FormGroup } from '@angular/forms';
import { formatDate } from '@angular/common';
import { Stepper } from 'primeng/stepper';
import { AuthenticationService } from '../../Services/authentication.service';
import { ModalService } from '../../Services/modal.service';
import { ReservationComponent } from '../reservation/reservation.component';
import { LoginFormComponent } from '../../Tools/login-form/login-form.component';
import { ModalTestComponent } from '../../Tools/modal-test/modal-test.component';
import { dirname } from 'node:path';
import { ConfirmModalComponent } from '../../Tools/confirm-modal/confirm-modal.component';
import { INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS } from '@angular/cdk/a11y';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.sass']
})
export class RestaurantComponent implements OnInit {
  
  reservationForm = this.formService.reservationForm
  restaurantId!: string | number;
  _isAvailable!: boolean ;
  constructor(
    private dbService: DatabaseService,
    private route: ActivatedRoute,
    private router: Router,
    private roleService: RoleService,
    private swal: SweetalertService,
    private formService: FormControlService,
    private authService: AuthenticationService,
    private modalService: ModalService
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
        }
      },
      (error: any) => {
        console.error(error),
        this.swal.fire('error', 'Error', 'Cannot find restaurant... try later ', '');
      });
  }

  handleAvailability(event: boolean){
    //event ? this.postReservation() : this._isAvailable = false 
    event ? this.showConfirmModal() : this._isAvailable = false;
  }

  showConfirmModal(){
    this.modalService.open(ConfirmModalComponent, {
      confirmBtnLabel: "CONFIRM",
      backBtnLabel: "NOT SURE",
      titleText: "Tables are Available!",
      subtitleText: "Do you want to confirm your reservation? "
    }, "CONFIRM RESERVATION")
      .then((modalRef: ComponentRef<ConfirmModalComponent>) => {
        const instance = modalRef.instance as ConfirmModalComponent;
        instance.confirm.subscribe((data: any) => {
          this.postReservation()
          this.modalService.close();
          this.router.navigate(['/account'])
          
        });
      })
      .catch((error) => {
        console.error('Errore nella creazione del componente figlio:', error);
      });
  
    
  }

  postReservation(){
    const body = {
      "mail" : this.reservationForm.controls['mail'].value,
      "quantity" : this.reservationForm.controls['quantity'].value,
      "date" : formatDate(this.reservationForm.controls['date'].value, "yyyy-MM-dd", "en-US"),
      "turn_id" : this.reservationForm.controls['turn'].value,
      "restaurant_id" : this.restaurantId
    }
    this.dbService.post('/api/v1/restaurant/reservation', body)
      .subscribe((response:APIResponse) => {
        response.success ? (
          console.log(response.data)
        ) : null
        //redirect to order page
      },
      (error: any) => {
        console.error(error),
        this.swal.fire("error","ERROR", "Error during data transfer... try later","")
      })



  }


  
}
