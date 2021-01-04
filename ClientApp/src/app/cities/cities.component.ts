import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { City } from './city';


@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})

export class CitiesComponent {
  public displayedColumns: string[] = ['id', 'name', 'lat', 'lon'];
  public cities: City[];

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseURL: string) { }

  ngOnInit() {
    this.http.get<City[]>(this.baseURL + 'api/Cities')
      .subscribe(result => {
        this.cities = result;
      }, error => console.error(error));
  }

}
