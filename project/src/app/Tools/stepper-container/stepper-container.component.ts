import { Component, Input } from '@angular/core';

@Component({
  selector: 't-stepper-container',
  templateUrl: './stepper-container.component.html',
  styleUrl: './stepper-container.component.sass'
})
export class StepperContainerComponent {
  @Input() nextDisabled: boolean = true;
  @Input() backDisabled: boolean = true;
}
