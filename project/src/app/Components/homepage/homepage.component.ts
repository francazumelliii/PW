import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit, AfterContentInit} from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { APIResponse, Restaurant } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { CardContainerComponent } from '../../Tools/card-container/card-container.component';
import { MapComponent } from '../map/map.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.sass']
})
export class HomepageComponent implements AfterContentInit {
  constructor(
    private roleService: RoleService,
    private swal: SweetalertService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ){}

  restaurantsList: Restaurant[] = [];
  nearestRestaurantsList: Restaurant[] = [];

  @ViewChild("map") map!: MapComponent;
  @ViewChild("cardContainer") cardContainer!: CardContainerComponent;

  ngAfterContentInit(): void {
    this.getAllRestaurants();
  }

  getAllRestaurants() {
    this.roleService.getAllRestaurants().subscribe((response: APIResponse) => {
      if(response.success) {
        this.restaurantsList = response.data;
        this.map.list = this.restaurantsList;
      }
    }, (error: any) => {
      console.error(error);
    });
  }

  handleSearchbarLocation(event: any) {
    const latitude = event.lat;
    const longitude = event.lon;
    const county = event.address.state;

    this.roleService.getNearestRestaurants(latitude, longitude, county).subscribe((response: APIResponse) => {
      if (response.success) {
        this.nearestRestaurantsList = response.data;
        this.cardContainer.list = this.nearestRestaurantsList;
        this.cardContainer.circular = false;
        this.cdr.detectChanges();
      }
    }, (error: any) => {
      this.swal.fire("error", "Error", error.toString(), "");
    });
  }

  handleSearchbarClear() {
    this.nearestRestaurantsList = [];
    this.cardContainer.list = this.restaurantsList;
    this.cardContainer.circular = true;
    this.cdr.detectChanges();
  }
  handleCardBtnClick(event: any){
    console.log(event)
    this.router.navigate(['/restaurant',event])
  }
}
