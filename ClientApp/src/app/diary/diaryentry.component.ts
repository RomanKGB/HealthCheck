import { Component, Inject, ViewChild, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { DiaryEntryCalendar } from './diarycalendar';
import { Activity } from './activity';
import { BaseFormComponent } from '../base.form.component';
import { ActivatedRoute, Event, Router } from '@angular/router';
import { MatList, MatSelectionListChange, MatListOption } from '@angular/material/list';
import { DiaryService } from './diaryservice';
import { ApiResult } from '../base.service';
import { SelectionModel } from '@angular/cdk/collections';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-diaryentry',
  templateUrl: './diaryentry.component.html',
  styleUrls: ['./diaryentry.component.css']
})

export class DiaryEntryComponent extends BaseFormComponent{
  //public displayedColumns: string[] = ['select', 'id', 'description', 'points'];
  public displayedColumns: string[] = ['select', 'description', 'points','done'];
  public user_message: string="";
  protected entryid: string;
  public completed: number = 0;
  public planned: number = 0;
  form: FormGroup;
  formNewActivity: FormGroup;
  formTitle: string;
  diaryEntry: DiaryEntryCalendar;
  selectedDate = new FormControl(new Date());
  display_date: string = "";
  activitiesList: any;
  activitiesList2:any;
  activities_list: MatList;
  selected_activites: MatListOption[];
  selection = new SelectionModel<Activity>(true, []);
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
      //entry_color: new FormControl('', Validators.required),
      date: new FormControl('')
    }, null, null);
    this.formNewActivity = new FormGroup({
      new_activity_name: new FormControl('', Validators.required),
      new_activity_points: new FormControl('', [Validators.required, Validators.pattern("^[0-9]+(.[0-9]{0,4})?$")]),
      activities_list: new FormControl('')
    }, null, null);
    
    
    this.loadData();
    this.loadActivities();
    this.loadEntryActivities();
  }

  formatActivityValue(is_done: number) {
    return (is_done==1 ? "Yes" : "No");
  }

  isAllSelected() {
    //console.log("Check All Selected");
    const numSelected = this.selection.selected.length;
    //const numRows=0;
    try {
      const numRows = this.activitiesList2.length;
      return numSelected === numRows;
    }
    catch { return 0;}
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.activitiesList2);
  }

  updateComment() {
    console.log(this.form.get('title').value);
    this.diaryService.updateComment(this.form.get('title').value, parseInt(this.entryid)).subscribe(result => {
      if (result) this.user_message="Saved comment..";
      else this.user_message = "Error saving..";
    }, error => console.error(error));
  }

  loadActivities() {
    this.diaryService.getActivities<ApiResult<Activity>>(this.entryid).subscribe(result => {
      //console.log(result.data);
      this.activitiesList = result.data;
    });
  }

  loadEntryActivities() {
    this.diaryService.getEntryActivities<ApiResult<Activity>>(this.entryid).subscribe(result => {
      //console.log("Loaded entry activities");
      this.activitiesList2 = result.data;
      this.completed = 0;
      this.planned = 0;
      result.data.map(a => {
        if (a.done == 1) this.completed += a.activity_points;
        this.planned += a.activity_points;
      });
      //this.activitiesList2
    });
  }

  checkboxLabel(activity?: Activity): string {
    if (!activity) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(activity) ? 'deselect' : 'select'} row ${activity.activity_id + 1}`;
    
  }

  deleteSelected() {
    var selected_activities = "";
    this.selection.selected.map(a => selected_activities += a.activity_id.toString() + ",");
    this.diaryService.deleteActivitiesFromEntry(parseInt(this.entryid),selected_activities).subscribe(result => {
      this.loadEntryActivities();
      this.loadActivities();
      this.user_message = "Selected actitvities deleted...";
    }, error => console.error(error));
  }

  markDone(is_done:number) {
    var selected_activities = "";
    this.selection.selected.map(a => selected_activities += a.activity_id.toString()+",");
    this.diaryService.markDone(parseInt(this.entryid), selected_activities, is_done).subscribe(result => {
      this.loadEntryActivities(); 
      this.user_message = "Activity status updated...";
    }, error => console.error(error));
  }

  

  loadData() {

    try {
      this.entryid = this.activatedRoute.snapshot.paramMap.get('entryid').toString();
    }
    catch { }
    if (this.entryid) {
      var url = this.baseUrl + "api/diary/" + this.entryid;
      this.http.get<DiaryEntryCalendar>(url).subscribe(result => {
        this.diaryEntry = result;
        console.log(result);
        this.formTitle = "Edit diary entry for " + this.diaryEntry.date;
        //this.selectedDate.setValue(new Date(this.diaryEntry.date));
        this.display_date = this.diaryEntry.date;
        this.form.patchValue(this.diaryEntry);
        this.user_message = "Loaded successfully...";
      }, error => console.error(error));
    }
    else {
      this.formTitle = "Create a new entry";
    }



  }


  onAddNewActivity(event: Event) {
    //console.log(this.formNewActivity.get("new_activity_name").value + ":" + this.formNewActivity.get("new_activity_points").value);
    this.diaryService.addNewActivity(this.formNewActivity.get("new_activity_name").value, parseInt(this.formNewActivity.get("new_activity_points").value)).subscribe(result => {
      this.formNewActivity.reset();
      this.loadActivities();
      this.user_message = "New activity created...";
    }, error => console.error(error));
  }

  onAddToTodayClick(event: Event) {
    //console.log(this.form.get("activities_list"));
    var activitiesToAdd = "";
    this.selected_activites.map(o => { activitiesToAdd+=o.value+"," });
    //this.diaryService.addActivityToEntry(parseInt(this.entryid), 4);
    //console.log(parseInt(this.entryid));
    this.diaryService.addActivityToEntry(parseInt(this.entryid), activitiesToAdd).subscribe(result => {
      this.loadEntryActivities();
      this.loadActivities();
      this.user_message = "Activity added to entry...";
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
