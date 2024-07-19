import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ComponentRef } from '@angular/core';
import { ModalComponent } from '../Tools/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalComponentRef: ComponentRef<ModalComponent> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector
  ) {}

  open(component: any, inputs: any = {}, title: string = ''): void {
    if (this.modalComponentRef) {
      this.close(); // Chiudi eventuali modali aperti
    }

    // Crea una referenza al componente del modal
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(ModalComponent)
      .create(this.injector);

    // Attacca il componente all'albero dei componenti di Angular
    this.appRef.attachView(componentRef.hostView);

    // Ottieni l'elemento DOM del componente
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;

    document.body.appendChild(domElem);

    // Imposta il tipo di componente e gli input del contenuto del modal
    (componentRef.instance as ModalComponent).childComponentType = component;
    (componentRef.instance as ModalComponent).childComponentInputs = inputs;
    (componentRef.instance as ModalComponent).title = title;

    this.modalComponentRef = componentRef;
  }

  close(): void {
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
    }
  }
}
