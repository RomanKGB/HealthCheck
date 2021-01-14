import { Component, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { City } from './city';
import { Country } from './../countries/country';


@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent {
  title: string;
  form: FormGroup;
  city: City;
  id?: number;
  countries: Country[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      lat: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,4})?$")]),
      lon: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,4})?$")]),
      countryId: new FormControl('', Validators.required)
    }, null, this.isDupeCity());
    this.loadData();
  }

  isDupeCity(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      var city = <City>{};
      city.id = (this.id) ? this.id : 0;
      city.name = this.form.get("name").value;
      city.lat = +this.form.get("lat").value;
      city.lon = +this.form.get("lon").value;
      city.countryId = +this.form.get("countryId").value;

      var url = this.baseUrl + "api/cities/IsDupeCity";
      console.log(url);
      return this.http.post<boolean>(url, city).pipe(map(result => {

        return (result ? { isDupeCity: true } : null);
      }));
    }
  }



  loadData() {
    this.loadCountries();
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
      if (this.id) {
        var url = this.baseUrl + "api/cities/" +this.id;
        this.http.get<City>(url).subscribe(result => {
          this.city = result;
          this.title = "Edit - " + this.city.name;
          console.log("Country ID:" + this.city.countryId);
          console.log("Result:" + result.countryId);
          this.form.patchValue(this.city);
        }, error => console.error(error));
      }
      else {
        this.title = "Create a new city";
      }
      
      
      
  }



  loadCountries() {
    var url = this.baseUrl + "api/countries";
    var params = new HttpParams()
      .set("pageSize", "9999")
      .set("sortColumn", "name");

    this.http.get<any>(url, { params }).subscribe(result => {
      this.countries = result.data;
    }, error => console.error(error));
  }

    onSubmit(){
      var city = (this.id) ? this.city : <City>{};
      city.name = this.form.get("name").value;
      city.lon = +this.form.get("lon").value;
      city.lat = +this.form.get("lat").value;
      city.countryId = +this.form.get("countryId").value;

      if (this.id) {
        var url = this.baseUrl + "api/cities/" + this.city.id;
        this.http
          .put<City>(url, city)
          .subscribe(result => {
            console.log("City " + city.name + " has been updated.");
            this.router.navigate(['/cities']);
          }, error => console.error(error));
      }
      else {
        var url = this.baseUrl + "api/cities";
        this.http
          .post<City>(url, city)
          .subscribe(result => {
            console.log("City" + result.name + " has been created.");
            this.router.navigate(['/cities']);
          }, error => console.error(error));
      }
      
    }
  }

