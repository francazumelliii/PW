import { Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
  selector: 't-card-container',
  templateUrl: './card-container.component.html',
  styleUrl: './card-container.component.sass'
})
export class CardContainerComponent {
  @ViewChild('cardCarousel') cardCarousel!: ElementRef;
  @Input() list: any[] = []





  cardWidth = 19.6; 
  cardMargin = 1; 

  constructor() { }

  prevSlide(): void {
    const scrollAmount = (this.cardWidth + this.cardMargin) * Math.floor(this.cardCarousel.nativeElement.offsetWidth / (this.cardWidth + this.cardMargin));
    this.cardCarousel.nativeElement.scrollLeft -= scrollAmount;
  }

  nextSlide(): void {
    const scrollAmount = (this.cardWidth + this.cardMargin) * Math.floor(this.cardCarousel.nativeElement.offsetWidth / (this.cardWidth + this.cardMargin));
    this.cardCarousel.nativeElement.scrollLeft += scrollAmount;
  }
}
