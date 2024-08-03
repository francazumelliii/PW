import {Component, Input} from '@angular/core';
import {Menu} from "../../Interfaces/general";
import {ModalService} from "../../Services/modal.service";
import {MenuComponent} from "../menu/menu.component";

@Component({
  selector: 't-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.sass'
})
export class MenuButtonComponent {
  @Input() menu!: Menu

  constructor(
    private modalService: ModalService
  ) {}
  openModal(){
    this.modalService.open(MenuComponent, {menu:this.menu}, "MENU")
  }
}
