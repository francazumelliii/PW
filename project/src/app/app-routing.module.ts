import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';

const routes: Routes = [
  {path: "", redirectTo: "/homepage", pathMatch:"full"},
  {path: "homepage", component: SidebarComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
