import { Component, ElementRef, Input, Output, ViewChild, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 't-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.sass']
})
export class CardContainerComponent implements OnChanges {
  @ViewChild('cardCarousel') cardCarousel!: ElementRef;
  @Input() list: any[] = [];
  @Input() circular: boolean = true;
  @Input() width: string = "19.6rem"
  @Input() height: string = "11.025rem"
  @Output() cardBtnClick = new EventEmitter<any>();

  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 3 },
    { breakpoint: '768px', numVisible: 2, numScroll: 2 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list']) {
      console.log('List changed:', changes['list'].currentValue);

    }
  }

  handleBtnClick(event: any): void {
    this.cardBtnClick.emit(event);
  }
  trackByFn(index: number, item: any): any {
    return item.id; 
  }
  
}
