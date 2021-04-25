import { Component, Inject, ViewChild, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { DiaryEntryCalendar } from './diarycalendar';
import { BaseFormComponent } from '../base.form.component';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { MatList, MatSelectionListChange, MatListOption } from '@angular/material/list';
import { DiaryService } from './diaryservice';


@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-diaryentry',
  templateUrl: './diaryentry.component.html',
  styleUrls: ['./diaryentry.component.css']
})

export class DiaryEntryComponent extends BaseFormComponent{
  public displayedColumns: string[] = ['id', 'description', 'points'];
  protected entryid: string;
  form: FormGroup;
  formTitle: string;
  diaryEntry: DiaryEntryCalendar;
  selectedDate = new FormControl(new Date());
  activitiesList = [
    { id: 1234, type: 'Health', description: 'Gym', points: 20 },
    { id: 4567, type: 'Career', description: 'Study', points: 30 },
    { id: 7890, type: 'Family', description: 'Sophie time', points: 20 }
  ];
  activitiesList2 = [
    { id: 1234, type: 'Health', description: 'Gym', points: 20 },
    { id: 4567, type: 'Career', description: 'Study', points: 30 },
    { id: 7890, type: 'Family', description: 'Sophie time', points: 20 },
    { id: 7890, type: 'Family', description: 'Sophie time2', points: 20 }
  ];
  activities_list: MatList;
  selected_activites: MatListOption[];
  @ViewChild('todays_tasks') firstListObj: MatList;

  constructor(protected http: HttpClient, @Inject('BASE_URL') protected baseUrl: string,
    private activatedRoute: ActivatedRoute, private router: Router,
    private diaryService: DiaryService) {
    super();
    //this.baseUrl = baseUrl;
    //this.http = http;
    //this.entryid = data.id;
    
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      entry_color: new FormControl('', Validators.required),
      date: new FormControl(''),
      new_activity_name: new FormControl('', Validators.required),
      new_activity_points: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,4})?$")]),
      activities_list: new FormControl('')
    }, null, null);
    this.loadData();
    
  }

  loadData() {
    //this.entryid = +this.activatedRoute.snapshot.paramMap.get('entryid').toString();
    this.entryid = this.activatedRoute.snapshot.paramMap.get('entryid').toString();
    console.log(this.entryid);
    if (this.entryid) {
      var url = this.baseUrl + "api/diary/" + this.entryid;
      this.http.get<DiaryEntryCalendar>(url).subscribe(result => {
        this.diaryEntry = result;
        this.formTitle = "Edit diary entry for " + this.diaryEntry.date;
        this.selectedDate.setValue(new Date(this.diaryEntry.date));
        this.form.patchValue(this.diaryEntry);
        //this.StartDate.setValue(new Date(this.diaryEntry.date));
        console.log(result);
      }, error => console.error(error));
    }
    else {
      this.formTitle = "Create a new entry";
    }



  }


  onAddToTodayClick(event: Event) {
    console.log(this.form.get("activities_list"));
    console.log(this.selected_activites.map(o => o.value));
    //this.diaryService.addActivityToEntry(parseInt(this.entryid), 4);
    console.log(parseInt(this.entryid));
    this.diaryService.addActivityToEntry(parseInt(this.entryid), 4).subscribe(result => {
      console.log(result);
    }, error => console.error(error));
  }

  onSelectFrom(event) {
    this.selectedDate = event;
    const dateString = event.toDateString();
    const dateValue = dateString.split(' ');
    
  }

  onSubmit() {


  }

  onActivitiesSelectChange(event: MatSelectionListChange) {
    this.selected_activites = event.source.selectedOptions.selected;
    
  }

}
