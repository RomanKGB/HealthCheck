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
  public entryid: string;
  public completed: number = 0;
  public planned: number = 0;
  public setDone: boolean = true;
  public is_highlight: boolean = false;
  form: FormGroup;
  formNewActivity: FormGroup;
  formTitle: string;
  diaryEntry: DiaryEntryCalendar;
  selectedDate = new FormControl(new Date());
  display_date: string = "";
  display_day_date: string = "";
  activitiesList: any;
  activitiesList2: any;
  activitiesListMaster: any;
  activities_list: MatList;
  selected_activites: MatListOption[];
  selection_string:string = "";
  selection = new SelectionModel<Activity>(true, []);
  @ViewChild('todays_tasks') firstListObj: MatList;
  searchVal: string = "";
  public searchValLocal: string = "";

  constructor(protected http: HttpClient, @Inject('BASE_URL') protected baseUrl: string,
    private activatedRoute: ActivatedRoute, private router: Router,
    private diaryService: DiaryService) {
    super();
    
    
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', Validators.required),
      weight: new FormControl('', [Validators.required, Validators.pattern("-?\\d+(?:\\.\\d+)?")]),
      date: new FormControl('')
    }, null, null);
    this.formNewActivity = new FormGroup({
      new_activity_name: new FormControl('', Validators.required),
      new_activity_points: new FormControl('', [Validators.required, Validators.pattern("-?\\d+(?:\\.\\d+)?")]),
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
    const numSelected = this.selection.selected.length;
    try {
      const numRows = this.activitiesList2.length;
      return numSelected === numRows;
    }
    catch { return 0;}
  }

  onSearchChange(searchValue: string) {
    //console.log(searchValue);
    this.activitiesList = this.filterList(this.activitiesListMaster, searchValue);
    this.searchValLocal = searchValue;
  }

  filterList(listOfNames: Activity[], nameToFilter: string): Activity[] {
    if (!listOfNames) return null;
    if (!nameToFilter) return listOfNames;

    return listOfNames.filter(n => n.activity_name.toUpperCase().indexOf(nameToFilter.toUpperCase()) >= 0);
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
    //console.log(this.form.get('title').value);
    this.diaryService.updateComment(this.form.get('title').value, this.form.get('weight').value, parseInt(this.entryid)).subscribe(result => {
      if (result) this.user_message="Saved comment..";
      else this.user_message = "Error saving..";
    }, error => console.error(error));
  }

  loadActivities() {
    this.diaryService.getActivities<ApiResult<Activity>>(this.entryid).subscribe(result => {
      this.activitiesListMaster = result.data;
      this.activitiesList = (this.searchValLocal == "" ? this.activitiesListMaster:this.filterList(this.activitiesListMaster, this.searchValLocal));
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
        this.planned += (a.activity_points < 0 ? 0 : a.activity_points);
      });
      //this.activitiesList2
    });
  }

  copyActivity() {
    var selected_activities_local = "";
    var next_day_entry_id = 0;
    this.selection.selected.map(a => selected_activities_local += a.activity_id.toString() + ",");
    //this.diaryService.deleteActivitiesFromEntry(parseInt(this.entryid), selected_activities_local).subscribe(result => {
    //  this.loadEntryActivities();
    //  this.loadActivities();
    //  this.selection.clear();
    //  this.user_message = "Selected actitvities deleted...";
    //}, error => console.error(error));
    console.log(selected_activities_local);

    var newDate = this.addDays(2, this.display_date);

    //this.updateComment();

    this.diaryService.addNewEntry(newDate.toString()).subscribe(result => {
      next_day_entry_id = result;
      this.diaryService.copyActivitiesToEntry(next_day_entry_id, selected_activities_local).subscribe(result => {
        //copy activities then navigate
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/diaryentry', next_day_entry_id]);
        });

        }, error => console.error(error));
    }, error => console.error(error));

    
  }



  checkboxLabel(activity?: Activity): string {
    if (!activity) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(activity) ? 'deselect' : 'select'} activity ${activity.activity_id + 1}`;
    
  }

  deleteSelected() {
    var selected_activities_local = "";
    this.selection.selected.map(a => selected_activities_local += a.activity_id.toString() + ",");
    this.diaryService.deleteActivitiesFromEntry(parseInt(this.entryid), selected_activities_local).subscribe(result => {
      this.loadEntryActivities();
      this.loadActivities();
      this.selection.clear();
      this.user_message = "Selected actitvities deleted...";
    }, error => console.error(error));
  }

  markDone(is_done:number) {
    var selected_activities_local = "";
    this.selection.selected.map(a => selected_activities_local += a.activity_id.toString() + ",");
    this.diaryService.markDone(parseInt(this.entryid), selected_activities_local, is_done).subscribe(result => {
      this.loadEntryActivities(); 
      this.selection.clear();
      this.user_message = "Activity status updated...";
    }, error => console.error(error));
  }

  addDays(num_days: number, old_date: string) {
    //console.log("--"+old_date);
    var date = new Date(old_date);
    //console.log("--" + date.toLocaleDateString("en-US").toString());
    //console.log("--" +num_days);
    date.setDate(date.getDate() + num_days);
    //console.log("--" +date);
    return date.toLocaleDateString("en-US").toString();
  }

  getDayOfWeek(paramD: Date) {
    var gsDayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ];

    var d = new Date(paramD.toString());
    return gsDayNames[(d.getDay() == 6 ? 0 : d.getDay()+1)];
  }


  setHighlight(eventObj) {
    this.is_highlight = eventObj.checked;
    this.diaryService.setHighlightDay(parseInt(this.entryid), (this.is_highlight?"Y":"N")).subscribe(result => {
      this.user_message = "Highlight status updated...";
    }, error => console.error(error));
  }

  loadData() {

    try {
      this.entryid = this.activatedRoute.snapshot.paramMap.get('entryid').toString();
      console.log("Get it here:" + this.activatedRoute.snapshot.paramMap.get('entryid').toString());
    }
    catch { }
    if (this.entryid) {
      //console.log("***"+this.entryid);
      var url = this.baseUrl + "api/diary/" + this.entryid;
      this.http.get<DiaryEntryCalendar>(url).subscribe(result => {
        this.diaryEntry = result;
        this.display_date = this.diaryEntry.date;
        this.display_day_date = this.diaryEntry.date + "  --  " + this.getDayOfWeek(new Date(this.diaryEntry.date));
        this.form.patchValue(this.diaryEntry);
        this.is_highlight = (this.diaryEntry.highlight=="Y");
        this.user_message = "Loaded successfully...";
      }, error => console.error(error));
    }
    else {
      this.formTitle = "Create a new entry";
    }



  }

  redirectTo(uri: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([uri]));
  }


  colorCell(entry_color: number) {

    if (entry_color >= 230) return "#8A39E1";
    if (entry_color >= 150) return "blue";
    if (entry_color >= 139) return "green";
    if (entry_color >= 129) return "yellow";
    if (entry_color >= 119) return "orange";
    else return "red";


  }

  colorCellFront(entry_color: number) {

    if (entry_color >= 129 && entry_color < 139) return "blue";
    else return "white";


  }

  thisMonth() {
    var pMonth = new Date(this.display_date).getMonth() + 1;
    var pYear = new Date(this.display_date).getFullYear();

    this.updateComment();

      //const currentUrl = this.router.url;
    //this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/calendar', pMonth,pYear]);
      //});

    //}, error => console.error(error));
  }

  moveDay(direction: string) {
    //console.log("sent to func"+this.display_date);
    var newDate = this.addDays((direction == 'next' ? 2 : 0), this.display_date);

    this.updateComment();

    this.diaryService.addNewEntry(newDate.toString()).subscribe(result => {
      console.log(result);
      //this.router.navigate(['/diaryentry', result]);

      const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/diaryentry', result]);
      });

    }, error => console.error(error));
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
    this.selected_activites.map(o => { activitiesToAdd += o.value + "," });
    console.log("--"+this.setDone);
    this.searchVal = "";
    this.diaryService.addActivityToEntry(parseInt(this.entryid), activitiesToAdd).subscribe(result => {
      this.loadEntryActivities();
      this.loadActivities();
      console.log(this.searchValLocal);
      this.activitiesList = this.filterList(this.activitiesListMaster, this.searchValLocal);
      this.user_message = "Activity added to entry...";
    }, error => console.error(error));
    console.log(this.setDone);
    if (this.setDone) {
      this.diaryService.markDone(parseInt(this.entryid), activitiesToAdd, 1).subscribe(result => {
        this.loadEntryActivities();
        this.selection.clear();
        this.user_message = "Activity status updated...";
      }, error => console.error(error));
    }
  }

  autoAdd() {
    var activitiesToAdd = "";
    this.selected_activites.map(o => { activitiesToAdd += o.value + "," });

    this.searchVal = "";
    this.diaryService.addActivityToEntry(parseInt(this.entryid), activitiesToAdd).subscribe(result => {
      this.loadEntryActivities();
      this.loadActivities();
      console.log(this.searchValLocal);
      this.activitiesList = this.filterList(this.activitiesListMaster, this.searchValLocal);
      this.user_message = "Activity added to entry...";
    }, error => console.error(error));
    console.log("-->"+this.setDone);
    if (this.setDone) {
      this.diaryService.markDone(parseInt(this.entryid), activitiesToAdd, 1).subscribe(result => {
        this.loadEntryActivities();
        this.selection.clear();
        this.user_message = "Auto done set...";
      }, error => console.error(error));
    }
    else {
      console.log("Not auto done...");
    }
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
    this.autoAdd();
  }

}
