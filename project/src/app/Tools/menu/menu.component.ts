import { Component, Input, OnInit } from '@angular/core';
import { Dish, Menu } from "../../Interfaces/general";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  @Input() menu!: Menu;

  dishes: { [key: string]: Dish[] } = {};

  ngOnInit() {
    this.filterDishes();
  }

  filterDishes() {
    this.menu.dishes.forEach(dish => {
      const category = dish.category_name;
      if (!this.dishes[category]) {
        this.dishes[category] = [];
      }
      this.dishes[category].push(dish);
    });
  }

  get categories(): string[] {
    return Object.keys(this.dishes);
  }
}
