import { Component, Input, OnInit } from '@angular/core';
import { Dish, Menu } from "../../Interfaces/general";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  @Input() menu!: Menu;

  appetizers: Dish[] = [];
  firstDishes: Dish[] = [];
  desserts: Dish[] = [];
  categories: string[] = ["Antipasti", "Primi Piatti", "Desserts"];
  dishes: { [key: string]: Dish[] } = {};

  ngOnInit() {
    this.filterDishes();
  }

  filterDishes() {
    this.menu.dishes.forEach(dish => {
      if (dish.category_name === "Primi Piatti") {
        this.firstDishes.push(dish);
      } else if (dish.category_name === "Antipasti") {
        this.appetizers.push(dish);
      } else if (dish.category_name === "Desserts") {
        this.desserts.push(dish);
      }
    });

    this.dishes["Primi Piatti"] = this.firstDishes;
    this.dishes["Antipasti"] = this.appetizers;
    this.dishes["Desserts"] = this.desserts;
  }
}
