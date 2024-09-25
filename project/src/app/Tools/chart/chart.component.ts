import { Component, Input } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
@Component({
  selector: 't-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.sass']
})
export class ChartComponent {
  @Input() view: [number, number] = [700, 300]; // Dimensione del grafico
  @Input() showXAxis: boolean = true;
  @Input() showYAxis: boolean = true;
  @Input() gradient: boolean = false;
  @Input() showLegend: boolean = true;
  @Input() showXAxisLabel: boolean = true;
  @Input() xAxisLabel: string = 'Population';
  @Input() showYAxisLabel: boolean = true;
  @Input() yAxisLabel: string = 'Country';
  @Input() barPadding: number = 10;
  @Input() chartType: string = "VERTICAL"

  @Input() percentage: number = 40;
  @Input() colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  @Input() data: {name: string, value: any}[] = [];
  


  constructor() { }

  onSelect(event: any): void {
    console.log(event);
  }
}