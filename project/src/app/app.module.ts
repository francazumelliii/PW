import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { MatDrawer, matDrawerAnimations, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDrawerContent,
    MatDrawerContainer,
    MatDrawer
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
