import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { ApiService } from '../../Services/api.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { SweetalertService } from '../../Services/sweetalert.service';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrl: './searchbar.component.sass'
})
export class SearchbarComponent {
  @ViewChild("searchBar") searchBar!: ElementRef
  @Output() location = new EventEmitter<GeolocationPosition>()
  @Output() address = new EventEmitter<any>()
  @Output() onClear = new EventEmitter<any>()
  @Input() placeholder: string = ""
  position!: GeolocationPosition 
  _isLoading: boolean = false


  constructor(
    private APIService: ApiService,
    private swal: SweetalertService

  ){
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
  }

  options: any = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  
  success(position: GeolocationPosition){
    this.location.emit(position)
    this.position = position
    this.innerSearchBar(position.coords.latitude, position.coords.longitude)
  }
  error(error: GeolocationPositionError){
    this.swal.fire(null,"Error", "Something went wrong", error.toString())
  }

  getCurrentLocation(){
    navigator.geolocation.getCurrentPosition(this.success,this.error,this.options)
  }

  innerSearchBar(latitude: number, longitude: number){
    this._isLoading = true
    const token = "pk.5a08ad60108a9560e595db7aa7f35b81"
    this.APIService.reverseGeolocation(token,latitude,longitude)
      .subscribe((response: any) => {
        this.searchBar.nativeElement.value = response.display_name
        this.address.emit(response)
        this._isLoading = false
      })
  }
  clearSearchBar(){
    this.searchBar.nativeElement.value = ""
    this.onClear.emit("")
  }
}
