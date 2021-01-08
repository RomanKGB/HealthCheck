import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { City } from './city';


@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent {
  title: string;
  form: FormGroup;
  city: City;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(''),
      lat: new FormControl(''),
      lon: new FormControl('')
    });
  }
    loadData(){
      var id = this.activatedRoute.snapshot.paramMap.get('id');
      var url = this.baseUrl + "api/cities/" + id;
      this.http.get<City>(url).subscribe(result => {
        this.city = result;
        this.title = "Edit - " + this.city.name;
        this.form.patchValue(this.city);
      }, error => console.error(error));
    }

    onSubmit(){
      var city = this.city;
      city.name = this.form.get("name").value;
      city.lon = this.form.get("lon").value;
      city.lat = this.form.get("lat").value;

      var url = this.baseUrl + "api/cities/" + this.city.id;
      this.http
        .put<City>(url, city)
        .subscribe(result => {
          console.log("City " + city.name + " has been updated.");
          this.router.navigate(['/cities']);
        }, error => console.error(error));
    }
  }

