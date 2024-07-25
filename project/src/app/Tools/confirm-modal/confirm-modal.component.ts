import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ModalService } from '../../Services/modal.service';


@Component({
  selector: 't-confirm-reservation',
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.sass'
})
export class ConfirmModalComponent {
  @Output() confirm = new EventEmitter<any>()
  @Output() back = new EventEmitter<any>()
  @Input() confirmBtnLabel: string = "OK"
  @Input() backBtnLabel: string = "BACK"
  @Input() titleText: string = "text"
  @Input() subtitleText: string = "subtitle"
  constructor(private modalService: ModalService){}


  confirmClick(){
    this.confirm.emit({ confirmed: true });
  }
  backClick(){
    this.back.emit("")
    this.modalService.close()
  }
}
