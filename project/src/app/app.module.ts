import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { MatDrawer, matDrawerAnimations, MatDrawerContainer, MatDrawerContent } from '@angular/material/sidenav';
import { AuthenticationsComponent } from './Components/authentications/authentications.component';
import { ButtonComponent } from './Tools/button/button.component';
import { LoginFormComponent } from './Tools/login-form/login-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SidebarComponent,
    AuthenticationsComponent,
    ButtonComponent,
    LoginFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDrawerContent,
    MatDrawerContainer,
    MatDrawer,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
