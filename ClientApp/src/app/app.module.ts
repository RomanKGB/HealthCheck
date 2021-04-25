import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { AppComponent } from './app.component';
import { BaseFormComponent } from './base.form.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { HealthCheckComponent } from './health-check/health-check.component';
import { CitiesComponent } from './cities/cities.component';
import { CityEditComponent } from './cities/city-edit.component';
import { CountriesComponent } from './countries/countries.component';
import { CountryEditComponent } from './countries/country-edit.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './angular-material.module';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { CityService } from './cities/city.service';
import { CountryService } from './countries/country.service';
import { DiaryService } from './diary/diaryservice';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DiaryComponent } from './diary/diary.component';
import { DiaryCalendar } from './diary/diarycalendar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatNativeDateModule } from '@angular/material/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DiaryEntryComponent } from './diary/diaryentry.component';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
    declarations: [
        AppComponent,
        BaseFormComponent,
        NavMenuComponent,
        HomeComponent,
        HealthCheckComponent,
        CitiesComponent,
        CityEditComponent,
    CountriesComponent,
    CountryEditComponent,
    DiaryComponent,
    DiaryCalendar,
    DiaryEntryComponent
    ],
    imports: [
        BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
        HttpClientModule,
      FormsModule,
      ApiAuthorizationModule,
        RouterModule.forRoot([
            { path: '', component: HomeComponent, pathMatch: 'full' },
          { path: 'health-check', component: HealthCheckComponent },
          { path: 'cities', component: CitiesComponent },
          { path: 'city/:id', component: CityEditComponent, canActivate: [AuthorizeGuard] },
          { path: 'city', component: CityEditComponent, canActivate: [AuthorizeGuard] },
          { path: 'countries', component: CountriesComponent },
          { path: 'country/:id', component: CountryEditComponent, canActivate: [AuthorizeGuard] },
          { path: 'country', component: CountryEditComponent, canActivate: [AuthorizeGuard] },
          { path: 'diary', component: DiaryComponent },
          { path: 'calendar', component: DiaryCalendar },
          { path: 'diaryentry/:entryid', component: DiaryEntryComponent }
        ]),
      ServiceWorkerModule.register('ngsw-worker.js', { registrationStrategy:'registerImmediately' }),
      BrowserAnimationsModule,
      AngularMaterialModule,
      MatDatepickerModule,
      MatGridListModule,
      MatListModule,
      MatButtonModule,
      MatNativeDateModule,
      FullCalendarModule,
      ReactiveFormsModule,
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      })
  ],
  providers: [CityService, CountryService, DiaryComponent, DiaryService, { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor, multi: true }],
    bootstrap: [AppComponent]
})
export class AppModule { }
