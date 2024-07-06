import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivateFn } from '@angular/router';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { AuthenticationsComponent } from './Components/authentications/authentications.component';
import { authGuard } from './Guards/auth-guard.guard';
import { RestaurantComponent } from './Components/restaurant/restaurant.component';

const routes: Routes = [
  {path: "", redirectTo: "/authentication", pathMatch:"full"},
  {path: 'authentication', component: SidebarComponent,children: [{ path: '', component: AuthenticationsComponent }]},
  {path: 'homepage', component: SidebarComponent,children: [{ path: '', component: HomepageComponent }], canActivate:[authGuard]},
  {path: 'restaurant/:id', component: SidebarComponent,children: [{path: "",component: RestaurantComponent}], canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
