import { Component, Input } from '@angular/core';
import { APIResponse, Reservation, Restaurant, Turn, Village } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { DatabaseService } from '../../Services/database.service';
import { ModalComponent } from '../modal/modal.component';
import { ModalService } from '../../Services/modal.service';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../../Services/form-control.service';
import { ApiService } from '../../Services/api.service';

@Component({
  selector: 'app-update-modal',
  templateUrl: './update-modal.component.html',
  styleUrl: './update-modal.component.sass'
})
export class UpdateModalComponent {
  @Input() restaurant!: Restaurant[]
  @Input() reservation !: Reservation
  villages: Village[] = [];
  updateRestaurantForm!: FormGroup
  updateReservationForm !: FormGroup
  _isDateInFuture: boolean = false
  today = new Date()
  reservationDate = new Date()
  turns: Turn[] = []

  constructor(
    private swal: SweetalertService,
    private dbService: DatabaseService,
    private modalService: ModalService,
    private fcService: FormControlService
  ){
    this.updateRestaurantForm = this.fcService.updateRestaurantForm
    this.updateReservationForm = this.fcService.updateReservationForm
  }

  ngOnInit(){
    if(this.restaurant != null ){
      this.getVillages()
      this.fillUpdateRestaurantForm()
    }else if(this.reservation != null){
      this.getAllTurns()
    }
  }

  getVillages(){
    this.dbService.get(`/api/v1/villages?county=${this.restaurant[0].coords.county_code}`)
    .subscribe((response: APIResponse) => {
      response.success ? this.villages = response.data : null
      console.log(response)
    }, (error: any) => {
      this.swal.fire("error", "ERROR", "Error retrieving data for villages... try later", ""),
      console.error(error)
    })
      
  }

  fillUpdateRestaurantForm(){
    this.updateRestaurantForm.controls['name'].setValue(this.restaurant[0].restaurant.name);
    this.updateRestaurantForm.controls['description'].setValue(this.restaurant[0].restaurant.description);
    this.updateRestaurantForm.controls['street'].setValue(this.restaurant[0].restaurant.street);
    this.updateRestaurantForm.controls['streetNumber'].setValue(this.restaurant[0].restaurant.street_number);
    this.updateRestaurantForm.controls['maxChairs'].setValue(this.restaurant[0].restaurant.max_chairs);
    this.updateRestaurantForm.controls['latitude'].setValue(this.restaurant[0].coords.latitude);
    this.updateRestaurantForm.controls['longitude'].setValue(this.restaurant[0].coords.longitude);
    this.updateRestaurantForm.controls['banner'].setValue(this.restaurant[0].restaurant.banner);
    this.updateRestaurantForm.controls['village'].setValue(this.restaurant[0].coords.village_id);

  }

  patchRestaurant(){
    const body = {
      name: this.updateRestaurantForm.controls['name'].value,
      description: this.updateRestaurantForm.controls['description'].value,
      street: this.updateRestaurantForm.controls['street'].value,
      street_number: this.updateRestaurantForm.controls['streetNumber'].value,
      max_chairs: this.updateRestaurantForm.controls['maxChairs'].value,
      latitude: this.updateRestaurantForm.controls['latitude'].value,
      longitude: this.updateRestaurantForm.controls['longitude'].value,
      banner: this.updateRestaurantForm.controls['banner'].value,
      village: this.updateRestaurantForm.controls['village'].value

    }
    this.dbService.patch(`/api/v1/restaurant?id=${this.restaurant[0].restaurant.id}`, body)
      .subscribe((response: APIResponse) => {
        response.success ? this.swal.fire("success", "SUCCESS!", "Restaurant successfully updated!", "") : null
        this.modalService.close();
        this.restaurant[0] = response.data
        this.fillUpdateRestaurantForm()
      },(error: any) => [
        this.swal.fire("error", "ERROR", "Error retrieving data... try later", ""),
        console.error(error)
      ])

    

  }
  closeModal(){
    this.modalService.close()
  }
  ngOnDestroy(): void {
    this.updateRestaurantForm.reset()
  }
  fillReservationForm(){
    this.updateReservationForm.controls['quantity'].setValue(this.reservation.reservation.quantity);
    this.updateReservationForm.controls['date'].setValue(this.reservation.reservation.date);
    const turn = this.turns.find((turn: Turn) => turn.start_time === this.reservation.reservation.start_time);
    this.updateReservationForm.controls['turn'].setValue(turn?.id);
    this.updateReservationForm.controls['mail'].setValue(this.reservation.reservation.mail);
    this.updateReservationForm.controls['restaurantName'].setValue(this.reservation.restaurant.name);
    this.updateReservationForm.controls['restaurantStreet'].setValue(this.reservation.restaurant.street);
    this.updateReservationForm.controls['restaurantStreetNumber'].setValue(this.reservation.restaurant.street_number);
    this.reservationDate = new Date(this.updateReservationForm.controls['date'].value)
    console.log(this.reservationDate, this.today)
  }
  
  getAllTurns() {
    this.dbService.get("/api/v1/turns")
      .subscribe((response: APIResponse) => {
        response.success ? this.turns = response.data : null
        this.fillReservationForm();  
        console.log(response);
      },
      (error: any) => {
        console.error(error);
        this.swal.fire("error", "ERROR", "Error retrieving data for turns... try later");
      }
    );
  }
  

  checkDate() {
    this._isDateInFuture = this.updateReservationForm.controls['date'].touched && new Date(this.updateReservationForm.controls['date'].value) >= new Date();
  }

  patchReservation(){
    const turn_id = this.updateReservationForm.controls['turn'].value;
    const quantity = this.updateReservationForm.controls['quantity'].value;
    const date = this.updateReservationForm.controls['date'].value;
    const mail = this.updateReservationForm.controls['mail'].value;
    const body = {
      turn_id: turn_id,
      quantity: quantity,
      date: date,
      mail: mail
    }
    this.dbService.patch(`/api/v1/restaurant/reservation?id=${this.reservation.reservation.id}`, body)
      .subscribe((response: APIResponse) => {
        response.success ? this.modalService.close() : null
        this.swal.fire("success", "SUCCESS!", "Reservation successfully updated!", "")
        this.modalService.close()
      },(error: any) => {
        console.error(error),
        this.swal.fire("error", "ERROR", "Error retrieving data for patch reservation", "")
      })
  }
  
}
