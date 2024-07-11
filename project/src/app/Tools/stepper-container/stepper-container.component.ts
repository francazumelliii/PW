import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 't-stepper-container',
  templateUrl: './stepper-container.component.html',
  styleUrl: './stepper-container.component.sass'
})
export class StepperContainerComponent {
  @Input() firstNextDisabled: boolean = true;
  @Input() lastNextDisabled: boolean = true;
  @Input() backDisabled: boolean = true;
  @Output() firstNextCallBack = new EventEmitter<any>()
  @Output() lastNextCallBack = new EventEmitter<any>()
  @Output() prevCallBack = new EventEmitter<any>()
}
