import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterContentInit, platformCore, ComponentRef, ComponentFactoryResolver } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { APIResponse, Images, Menu, Reservation, Restaurant } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { MapComponent } from '../map/map.component';
import { Router } from '@angular/router';
import { ModalService } from '../../Services/modal.service';
import { UpdateModalComponent } from '../../Tools/update-modal/update-modal.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.sass']
})
export class HomepageComponent implements OnInit {
  restaurantsList: Restaurant[] = [];
  nearestRestaurantsList: Restaurant[] = [];
  showNearestRestaurants: boolean = false;
  images: Images[] = []
  menus: Menu[] = []
  reservations: Reservation[] = []

  @ViewChild("map") map!: MapComponent;
  circular: boolean = true;

  constructor(
    public roleService: RoleService,
    private swal: SweetalertService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private modalService: ModalService,

  ){}

  ngOnInit(): void {
    this.getAllRestaurants();
  }


  getAllRestaurants() {
    this.roleService.getAllRestaurants().subscribe((response: APIResponse) => {
      if(response.success) {
        this.restaurantsList = [...response.data];
        console.log(this.restaurantsList)
        if (this.map) {
          this.map.list = response.data;
        }
        this.getRestaurantImages(+response.data[0].id);
        this.getRestaurantReservations(+response.data[0].id);
        this.getAllMenus(+response.data[0].id);
        this.showNearestRestaurants = false; // Reset to show all restaurants initially
        this.circular = false; // Stop loading indicator
        this.cdr.detectChanges();
      }
    }, (error: any) => {
      console.error(error);
    });
  }

  getRestaurantImages(id: number) {
    this.roleService.getRestaurantImages(id).subscribe((response: APIResponse) => {
      if (response.success) {
        this.images = response.data;
        this.cdr.detectChanges();
      }
    }, (error: any) => {
      console.error(error);
      this.swal.fire("error", "ERROR", "Error retrieving data... try later", "");
    });
  }

  getAllMenus(id: number) {
    this.roleService.getAllMenus(id).subscribe((response: APIResponse) => {
      if (response.success) {
        this.menus = response.data;
        this.cdr.detectChanges();
      }
    }, (error: any) => {
      console.error(error);
      this.swal.fire("error", "ERROR", "Error retrieving data... try later", "");
    });
  }

  handleSearchbarLocation(event: any) {
    const latitude = event.lat;
    const longitude = event.lon;
    const county = event.address.state;

    this.roleService.getNearestRestaurants(latitude, longitude).subscribe((response: APIResponse) => {
      if (response.success) {
        this.nearestRestaurantsList = [...response.data];
        this.showNearestRestaurants = true;
        this.circular = false;
        this.cdr.detectChanges(); 
      }
    }, (error: any) => {
      this.swal.fire("error", "Error", error.toString(), "");
    });
  }

  handleSearchbarClear() {
    this.nearestRestaurantsList = [];
    this.showNearestRestaurants = false;
    this.circular = true;
    this.cdr.detectChanges(); // Trigger change detection after clearing search
  }

  handleCardBtnClick(event: any) {
    this.router.navigate(['/restaurant', event]);
  }

  handleSearchedText(event: string) {
    if (event.length > 0) {
      this.searchRestaurants(event);
      this.handleSearchbarClear();
    }
  }

  searchRestaurants(toSearch: string) {
    this.roleService.searchRestaurants(toSearch).subscribe((response: APIResponse) => {
      if (response.success) {
        this.nearestRestaurantsList = [...response.data];
        this.showNearestRestaurants = true;
        this.circular = false;
        this.cdr.detectChanges(); // Trigger change detection after updating lists
      }
    }, (error: any) => {
      console.error(error);
      this.swal.fire("error", "ERROR", "Error retrieving data... try later", "");
    });
  }
  openModal() {
    this.modalService.open(UpdateModalComponent, {restaurant: this.restaurantsList}, "UPDATE")
  }
  
  getRestaurantReservations(id: number){
      this.roleService.getRestaurnatReservations(id)
        .subscribe((response: APIResponse) => {
          response.success ? this.reservations = response.data : null
          
        },(error: any ) => {
          console.error(error);
        })
  }

  handleReservationModalChanges(){
    this.getRestaurantReservations(+this.restaurantsList[0].id)
  }



}
