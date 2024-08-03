import { Component, Input } from '@angular/core';
import { Images } from '../../Interfaces/general';

@Component({
  selector: 't-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrl: './image-slider.component.sass'
})
export class ImageSliderComponent {
  @Input() images: Images[] = []
  @Input() imageSize: any
  @Input() autoSlide: any = {interval: 2, stopOnHover: true}
  @Input() infinite: boolean = true
  @Input() animationSpeed: number = 1
}
