import { AfterContentInit, AfterViewInit, Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { APIResponse, Restaurant } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { CardContainerComponent } from '../../Tools/card-container/card-container.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.sass'
})
export class HomepageComponent implements AfterContentInit{
  constructor(
    private roleService: RoleService,
    private swal: SweetalertService,
    private cdr: ChangeDetectorRef
  ){}

  @ViewChild("cardContainer") cardContainer!: CardContainerComponent
  restaurantsList: Restaurant[] = [];
  nearestRestaurantsList: Restaurant[] = [];

  ngAfterContentInit(): void {
    this.getAllRestaurants()
  }

  getAllRestaurants(){
    this.roleService.getAllRestaurants()
      .subscribe((response: APIResponse) => {
        response.success ? this.restaurantsList = response.data : null
        console.log(response.data)
      },((error: any) => console.error(error)))
  }
  handleSearchbarLocation(event: any){
    const latitude = event.lat
    const longitude = event.lon
    const county = event.address.state
    this.roleService.getNearestRestaurants(latitude,longitude,county)
      .subscribe((response: APIResponse) => {
        if(response.success){
          this.nearestRestaurantsList = response.data
          this.cardContainer.list = this.nearestRestaurantsList
          this.cardContainer.circular = false
          this.cdr.detectChanges()
        }
    },((error: any) => {
      this.swal.error("error","Error", error.toString(), "")
    }))

  }

  handleSearchbarClear(){
    this.nearestRestaurantsList = []
    this.cardContainer.list = this.restaurantsList
    this.cardContainer.circular = true
    this.cdr.detectChanges()
  }




}
