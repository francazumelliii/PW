import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal-test',
  templateUrl: './modal-test.component.html',
  styleUrls: ['./modal-test.component.sass']
})
export class ModalTestComponent {
  @Input() data: any;
}
