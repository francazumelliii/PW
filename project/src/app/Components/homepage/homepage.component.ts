import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { RoleService } from '../../Services/role.service';
import { APIResponse, Images, Menu, Restaurant } from '../../Interfaces/general';
import { SweetalertService } from '../../Services/sweetalert.service';
import { MapComponent } from '../map/map.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.sass']
})
export class HomepageComponent implements AfterContentInit {
  restaurantsList: Restaurant[] = [];
  nearestRestaurantsList: Restaurant[] = [];
  showNearestRestaurants: boolean = false;
  images: Images[] = []
  menus: Menu[] = []

  @ViewChild("map") map!: MapComponent;
  circular:boolean = true

  constructor(
    public roleService: RoleService,
    private swal: SweetalertService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ){}

  ngAfterContentInit(): void {
    this.getAllRestaurants();
  }
  
  getAllRestaurants() {
    this.roleService.getAllRestaurants().subscribe((response: APIResponse) => {
      if(response.success) {
        this.restaurantsList = [...response.data];
        this.map ? this.map.list = response.data : null;
        this.getRestaurantImages(+response.data[0].restaurant.id);
        this.getAllMenus(+response.data[0].restaurant.id)
      }
    }, (error: any) => {
      console.error(error);
    });
  }
  getRestaurantImages(id: number){
    this.roleService.getRestaurantImages(id)
      .subscribe((response: APIResponse) => {
        response.success ? this.images = response.data : null
      }, (error : any) => {
        console.error(error),
        this.swal.fire("error","ERROR","Error retrieving data... try later", "")
      })
  }

  handleSearchbarLocation(event: any) {
    const latitude = event.lat;
    const longitude = event.lon;
    const county = event.address.state;

    this.roleService.getNearestRestaurants(latitude, longitude).subscribe((response: APIResponse) => {
      if (response.success) {
        console.log('Received nearest restaurants data:', response.data);
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
    this.cdr.detectChanges();
  }

  handleCardBtnClick(event: any){
    console.log(event);
    this.router.navigate(['/restaurant', event]);
  }

  handleSearchedText(event: string){
    if (event.length > 0) {
      this.searchRestaurants(event);
      this.handleSearchbarClear();
    }
  }

  searchRestaurants(toSearch: string){
    this.roleService.searchRestaurants(toSearch)
      .subscribe((response: APIResponse) => {
        if (response.success) {
          this.nearestRestaurantsList = [...response.data];
          this.showNearestRestaurants = true;
          this.circular = false;
        }
      }, (error: any) => {
        console.error(error);
        this.swal.fire("error","ERROR","Error retrieving data...try later", "");
      });
  }
  getAllMenus(id: number){
    return this.roleService.getAllMenus(id)
      .subscribe((response: APIResponse) => {
        response.success ? this.menus = response.data : null
      },(error: any) => {
        console.error("error"),
        this.swal.fire("error","ERROR","Error retrieving data... try later", "")
      })
  }
}
