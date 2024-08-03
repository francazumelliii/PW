import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetalertService {

  constructor(
  ) { }


  fire(icon: any = "error",title: any = null,text: string = "Something went wrong", footer: string = "", ){
    Swal.fire({
      icon: icon,
      title: title,
      text: text,
      footer: footer
    })
  }
}
