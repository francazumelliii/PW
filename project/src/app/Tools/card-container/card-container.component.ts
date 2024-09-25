import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 't-card-container',
  templateUrl: './card-container.component.html',
  styleUrls: ['./card-container.component.sass']
})
export class CardContainerComponent implements OnChanges {
  @Input() list: any[] = [];
  @Input() circular: boolean = true;
  @Input() width: string = "19.6rem";
  @Input() height: string = "11.025rem";
  @Input() interval: number = 3000;
  @Output() cardBtnClick = new EventEmitter<any>();

  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisible: 3, numScroll: 3 },
    { breakpoint: '768px', numVisible: 2, numScroll: 2 },
    { breakpoint: '560px', numVisible: 1, numScroll: 1 }
  ];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['list'] && changes['list'].currentValue !== changes['list'].previousValue) {
      console.log('List changed:', changes['list'].currentValue);
      this.updateCarousel();
    }
  }

  handleBtnClick(event: any): void {
    this.cardBtnClick.emit(event);
  }

  trackByFn(index: number, item: any): any {
    return item.id; 
  }

  private updateCarousel(): void {
    this.cdr.detectChanges();
  }
}
