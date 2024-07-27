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
  @Input() centerLatitude: number = 42.9028;
  @Input() centerLongitude: number = 12.9999;
  @Input() zoomLevel: number = 3.5;
  @Input() width: number = 700;
  @Input() height: number = 250;
  @Input() scale: number = 2;
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
   
    this.endpoint = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&center=lonlat:${this.centerLongitude},${this.centerLatitude}&zoom=${this.zoomLevel}`;
  
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
  
    this.endpoint += `&scaleFactor=${this.scale}&width=${this.width}&height=${this.height}&apiKey=${this.apiKey}`;
    this.mapImage.nativeElement.src = this.endpoint;
    console.log(this.endpoint);
  }


}


