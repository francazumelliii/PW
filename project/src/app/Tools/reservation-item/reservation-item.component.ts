import { Component, ComponentRef, EventEmitter, Input, Output } from '@angular/core';
import { APIResponse, Reservation } from '../../Interfaces/general';
import { RoleService } from '../../Services/role.service';
import { response } from 'express';
import { SweetalertService } from '../../Services/sweetalert.service';
import { ModalService } from '../../Services/modal.service';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { Router, TitleStrategy } from '@angular/router';

@Component({
  selector: 't-reservation-item',
  templateUrl: './reservation-item.component.html',
  styleUrl: './reservation-item.component.sass'
})
export class ReservationItemComponent {
  @Input() reservation!: Reservation
  @Output() changes = new EventEmitter<any>()
  @Input() role: string = "CUSTOMER"
  _isDeletable:boolean = false;
  constructor(
    private roleService: RoleService,
    private swal: SweetalertService,
    private modalService: ModalService,
    private router: Router

    ){}

  ngOnInit(){
    const today = new Date()
    this._isDeletable = new Date(this.reservation.date) > today
  }

  openModal(){
    this.modalService.open(ConfirmModalComponent, {
      confirmBtnLabel: "DELETE",
      backBtnLabel: "NOT SURE",
      titleText: "Are you sure you want to delete the reservation? ",
      subtitleText: "The operation is permanent"
    }, "DELETE RESERVATION?")
    .then((modalRef: ComponentRef<ConfirmModalComponent>) => {
      const instance = modalRef.instance as ConfirmModalComponent;
      instance.confirm.subscribe((data: any) => {
        this.deleteReservation()
        this.modalService.close();

      })
    })
    .catch((error) => {
      console.error('Error during child component creation:', error);
    });
  }
  deleteReservation(){
    const id = this.reservation.id
    this.roleService.deleteReservation(id)
      .subscribe((response:APIResponse) => {
        response.success ? this.changes.emit("") : null
      }, (error: any) => {
        this.swal.fire("error","ERROR", error.status_code == 401 ? 'Reservation not found' : "Error while deleting reservation", "")
        console.error(error)

      })
  }

  handleViewClick(){
    /* this.router.navigate(['/restaurant/' + this.reservation.restaurant.id])
    return */
    this.roleService.openViewModalOrRedirect(this.reservation);
  }
}
