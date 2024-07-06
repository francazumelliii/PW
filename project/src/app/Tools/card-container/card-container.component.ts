import { Component, ElementRef, Input, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 't-card-container',
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.sass'
})
export class CardContainerComponent {
  @ViewChild('cardCarousel') cardCarousel!: ElementRef;
  @Input() list: any[] = []
  @Input() circular: boolean = true
  @Output() cardBtnClick = new EventEmitter<any>()
  constructor() { }

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];


  handleBtnClick(event: any){
    this.cardBtnClick.emit(event)
  }
}
