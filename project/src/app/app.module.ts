import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './Components/homepage/homepage.component';
import { SidebarComponent } from './Components/sidebar/sidebar.component';
import { AuthenticationsComponent } from './Components/authentications/authentications.component';
import { ButtonComponent } from './Tools/button/button.component';
import { LoginFormComponent } from './Tools/login-form/login-form.component';
import { MatListModule } from '@angular/material/list';
import { StepperModule } from 'primeng/stepper';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CardComponent } from './Tools/card/card.component';
import { CardContainerComponent } from './Tools/card-container/card-container.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { SearchbarComponent } from './Components/searchbar/searchbar.component';
import { MapComponent } from './Components/map/map.component';
import { RestaurantComponent } from './Components/restaurant/restaurant.component';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { ReservationComponent } from './Components/reservation/reservation.component';
import { ModalComponent } from './Tools/modal/modal.component';
import { ModalTestComponent } from './Tools/modal-test/modal-test.component';
import { ModalService } from './Services/modal.service';
import { AccountComponent } from './Components/account/account.component';
import { AvatarComponent } from './Tools/avatar/avatar.component';


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
    RestaurantComponent,
    ReservationComponent,
    ModalComponent,
    ModalTestComponent,
    AccountComponent,
    AvatarComponent
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
    MatExpansionModule,
    StepperModule,
    ButtonModule,
    CalendarModule,
    DropdownModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'en-US' }, ModalService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
