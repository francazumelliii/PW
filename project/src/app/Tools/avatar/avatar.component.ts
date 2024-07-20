import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 't-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.sass'
})
export class AvatarComponent implements OnInit{
  @Input() name: string = "Kanye West"
  @Input() size: number = 50
  @Input() background: string = "random"
  @Input() color: string = ""
  @Input() bold: boolean = true
  @Input() rounded: boolean = true


  endpoint: string = ""
  ngOnInit(){
    this.endpoint = `https://ui-avatars.com/api/?name=${this.name}&size=${this.size}&background=${this.background}&bold=${this.bold}&rounded=${this.rounded}`
    this.color ? this.endpoint+= `&color=${this.color}` : null

  }
}
