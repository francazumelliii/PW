import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../Services/api.service';
import { Marker, Restaurant } from '../../Interfaces/general';

@Component({
  selector: 't-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit {
  @ViewChild("mapImage") mapImage !: ElementRef
  @Input() list!: Restaurant[];
  apiKey = "31274a2ec68e438ebcd9883478bb9d2a";
  endpoint: string = "";

  constructor(private APIService: ApiService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.list && this.list.length > 0) {
      this.initMap();
    }
  }

  initMap() {
    if (this.list.length === 0) {
      console.log("No restaurants to display on map");
      return;
    }
  
    let minLatitude = this.list[0].coords.latitude;
    let maxLatitude = this.list[0].coords.latitude;
    let minLongitude = this.list[0].coords.longitude;
    let maxLongitude = this.list[0].coords.longitude;
  
    this.list.forEach((res: Restaurant) => {
      if (res.coords.latitude < minLatitude) {
        minLatitude = res.coords.latitude;
      }
      if (res.coords.latitude > maxLatitude) {
        maxLatitude = res.coords.latitude;
      }
      if (res.coords.longitude < minLongitude) {
        minLongitude = res.coords.longitude;
      }
      if (res.coords.longitude > maxLongitude) {
        maxLongitude = res.coords.longitude;
      }
    });
  
    const centerLatitude = (minLatitude + maxLatitude) / 2;
    const centerLongitude = (minLongitude + maxLongitude) / 2;
    const zoomLevel = 0;
   
    this.endpoint = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&center=lonlat:${centerLongitude},${centerLatitude}&zoom=${zoomLevel}`;
  
    if (this.list.length > 0) {
      this.endpoint += "&marker=";
      this.list.forEach((res: Restaurant, index: number) => {
        const url = `lonlat:${res.coords.longitude},${res.coords.latitude};color:red;icon:utensils`;
        if (index > 0) {
          this.endpoint += "|";
        }
        this.endpoint += url;
      });
    }
  
    this.endpoint += `&scaleFactor=2&width=700&height=250&apiKey=${this.apiKey}`;
    this.mapImage.nativeElement.src = this.endpoint;
    console.log(this.endpoint);
  }
  
}