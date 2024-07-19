import { Component, Input, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from '../../Services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass']
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() childComponentType: any;
  @Input() childComponentInputs: any;
  @Input() title!: string;

  @ViewChild('modalContent', { read: ViewContainerRef, static: true }) modalContent!: ViewContainerRef;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private modalService: ModalService) {}

  ngOnInit() {
    if (this.childComponentType) {
      setTimeout(() => {
        console.log('Creating component...');
        const factory = this.componentFactoryResolver.resolveComponentFactory(this.childComponentType);
        const ref = this.modalContent.createComponent(factory);
  
        // Cast ref.instance to the expected component type
        const instance = ref.instance as any;
        Object.keys(this.childComponentInputs).forEach((key) => {
          instance[key] = this.childComponentInputs[key];
        });
  
        console.log('Component created:', ref.instance);
      });
    }
  }
  

  close() {
    this.modalService.close();
  }

  ngOnDestroy() {
    if (this.modalContent) {
      this.modalContent.clear();
    }
  }
}
