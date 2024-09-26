import { Component, Input, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnDestroy, OnInit, AfterViewInit, ComponentRef, ChangeDetectorRef } from '@angular/core';
import { ModalService } from '../../Services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.sass']
})
export class ModalComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() childComponentType: any;
  @Input() childComponentInputs: any;
  @Input() title!: string;

  @ViewChild('modalContent', { read: ViewContainerRef, static: true }) modalContent!: ViewContainerRef;

  public childComponentRef: ComponentRef<any> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private modalService: ModalService,
    private cdr: ChangeDetectorRef // Importa ChangeDetectorRef
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.createChildComponent();
  }

  createChildComponent() {
    if (this.childComponentType) {
      const factory = this.componentFactoryResolver.resolveComponentFactory(this.childComponentType);
      this.childComponentRef = this.modalContent.createComponent(factory);

      const instance = this.childComponentRef.instance as any;
      Object.keys(this.childComponentInputs).forEach((key) => {
        instance[key] = this.childComponentInputs[key];
      });

      // Forza il rilevamento delle modifiche dopo la creazione del componente
      this.cdr.detectChanges();
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
