import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 't-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.sass']
})
export class ButtonComponent {

  @Input() icon: string = "";
  @Input() classes: string = "";
  @Input() btnClasses: string = "";
  @Input() showIcon: boolean = true;
  @Input() iconClasses: string = "";
  @Input() type: string = "button";
  @Input() label: string = "LABEL";
  @Input() bgColor: string = "";
  @Input() color: string = "";
  @Input() disabled: boolean = false;
  @Input() borderColor: string = "";
  @Input() hoverClass: string = "";
  @Output() onClick = new EventEmitter<any>();

  click() {
    this.onClick.emit("");
  }
}
