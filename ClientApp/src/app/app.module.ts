import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ApiAuthorizationModule } from 'src/api-authorization/api-authorization.module';
import { AuthorizeGuard } from 'src/api-authorization/authorize.guard';
import { AuthorizeInterceptor } from 'src/api-authorization/authorize.interceptor';
import { CityService } from './cities/city.service';
import { CountryService } from './countries/country.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DiaryComponent } from './diary/diary.component';

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
    CountryEditComponent
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
          { path: 'diaries', component: DiaryComponent },
        ]),
      ServiceWorkerModule.register('ngsw-worker.js', { registrationStrategy:'registerImmediately' }),
      BrowserAnimationsModule,
      AngularMaterialModule,
      ReactiveFormsModule,
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory
      })
  ],
  providers: [CityService, CountryService, { provide: HTTP_INTERCEPTORS, useClass: AuthorizeInterceptor,multi:true }],
    bootstrap: [AppComponent]
})
export class AppModule { }
