import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Restaurant } from '../../Interfaces/general';

@Component({
  selector: 't-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.sass'
})
export class CardComponent implements OnInit {
  @Input() item!: Restaurant
  @Output() btnClick = new EventEmitter<any>()
  ngOnInit(){

  }
  emitClick(){
    this.btnClick.emit(this.item.restaurant.id)
  }
}
