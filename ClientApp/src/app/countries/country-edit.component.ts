import { Component, Inject } from '@angular/core';
//import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl, AsyncValidatorFn, AsyncValidator } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Country } from './../countries/country';
import { error } from '@angular/compiler/src/util';
import { BaseFormComponent } from '../base.form.component';
import { CountryService } from './country.service';


@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.css']
})

export class CountryEditComponent extends BaseFormComponent {
  title: string;
  form: FormGroup;
  country: Country;

  id?: number;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private countryService: CountryService) {
    super();
    this.loadData();
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required, this.isDupeField("name")],
      iso2: ['', [Validators.required, Validators.pattern(/[a-zA-Z]{2}/)], this.isDupeField("iso2")],
      iso3: ['', [Validators.required, Validators.pattern(/[a-zA-Z]{3}/)], this.isDupeField("iso3")]
    });
    this.loadData();
  }

  loadData() {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');

    if (this.id) {
      //edit mode
      //var url = this.baseUrl + "api/countries/" + this.id;
      this.countryService.get<Country>(this.id).subscribe(result => {
        this.country = result;
        this.title = "Edit - " + this.country.name;
        this.form.patchValue(this.country);
      }, error => console.error(error));
    }
    else {
      this.title = "Add new country";
    }
  }

  onSubmit() {
    var country = (this.id) ? this.country : <Country>{};
    country.name = this.form.get("name").value;
    country.iso2 = this.form.get("iso2").value;
    country.iso3 = this.form.get("iso3").value;

    if (this.id) {
      //var url = this.baseUrl + "api/countries/" + this.country.id;
      this.countryService.put<Country>(country).subscribe(result => {
        console.log(country.name + " has been updated.");
        this.router.navigate(['/countries']);
      }, error => console.error(error));
    }
    else {
     // var url = this.baseUrl + "api/countries";
      this.countryService.post<Country>(country).subscribe(result => {
        console.log(country.name + " has been created");
        this.router.navigate(['/countries']);
      }, error => console.error(error));
    }
  }

  isDupeField(fieldName: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {

      /*var params = new HttpParams()
        .set("countryId", (this.id) ? this.id.toString() : "0")
        .set("fieldName", fieldName)
        .set("fieldValue", control.value);
      var url = this.baseUrl + "api/countries/IsDupeField";
        */
      var countryId = (this.id) ? this.id.toString() : "0";
      return this.countryService.isDupeField(countryId, fieldName, control.value)
        .pipe(map(result => {
          return (result ? { isDupeField: true } : null);
        }));
    }
  }

}
