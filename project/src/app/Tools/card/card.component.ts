import { Component, Input, OnInit } from '@angular/core';
import { Restaurant } from '../../Interfaces/general';

@Component({
  selector: 't-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.sass'
})
export class CardComponent implements OnInit {
  @Input() item!: Restaurant

  ngOnInit(){

  }
}
