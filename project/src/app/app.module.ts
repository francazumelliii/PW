import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { AuthenticationsComponent } from './Components/authentications/authentications.component';
import { ButtonComponent } from './Tools/button/button.component';
import { LoginFormComponent } from './Tools/login-form/login-form.component';
import {MatList, MatListModule} from '@angular/material/list';

import { CarouselModule } from 'primeng/carousel';
// Import Angular Material modules
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar'; // Import MatToolbarModule
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { CardComponent } from './Tools/card/card.component';
import { CardContainerComponent } from './Tools/card-container/card-container.component';
import {MatExpansionModule} from '@angular/material/expansion';
import { SearchbarComponent } from './Components/searchbar/searchbar.component';
import { MapComponent } from './Components/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    SidebarComponent,
    AuthenticationsComponent,
    ButtonComponent,
    LoginFormComponent,
    CardComponent,
    CardContainerComponent,
    SearchbarComponent,
    MapComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    CarouselModule,
    MatExpansionModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



