import { Component, Input } from '@angular/core';
import {Menu, Restaurant} from '../../Interfaces/general';
@Component({
  selector: 'app-restaurant-info',
  templateUrl: './restaurant-info.component.html',
  styleUrl: './restaurant-info.component.sass'
})
export class RestaurantInfoComponent {
  @Input() restaurant!: Restaurant
  @Input() menus!: Menu[]


}
