import { Component, Inject, ViewChild, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar, FullCalendarComponent } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { DiaryEntry, Top10Months } from './diary';
import { ApiResult } from '../base.service';
import { DiaryEntryCalendar } from './diarycalendar';
import { MatDialog } from '@angular/material/dialog';
import { DiaryComponent } from './diary.component';
import { DiaryEntryComponent } from './diaryentry.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms'
import { DiaryService } from './diaryservice';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-diarycalendar',
  templateUrl: './diarycalendar.component.html',
  styleUrls: ['./diarycalendar.component.css']
})



  

export class DiaryCalendar {
  public http: HttpClient;
  public baseUrl: string; private
  public displayedColumns: string[] = ['diary_month', 'diary_year','avg_points_completed'];
  public posts = [];
  public selectedDateFrom = new Date("2013/01/01");
  public newDateFrom = new Date();
  public newFormattedDate: string = new Date().toLocaleDateString("en-US").toString();
  public selectedDateTo = new Date();
  public startAt = new Date("2000/01/01");
  public minDate = new Date('2012/01/01');
  public maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
  public currentMonth: string = new Date().getMonth().toString();
  public DayAndDateFrom: string;
 
  protected dlg: MatDialog;
  date = new FormControl(new Date());

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private router: Router, private diaryService: DiaryService) {
    this.baseUrl = baseUrl;
    this.http = http;
    
  }
  /*constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cityService: CityService
  ) { super(); }
  */
  calendarVisible = true;
  calendarOptions: CalendarOptions;

  @ViewChild('calendar') calendarObj: FullCalendarComponent;

  currentEvents: EventApi[] = [];
  top10: Top10Months[] = [];

  

  onSelectDate(event) {
    this.selectedDateFrom = event;
    const dateString = event.toDateString();
    this.currentMonth = new Date(dateString).getMonth.toString();

    const dateValue = dateString.split(' ');
    
    this.DayAndDateFrom = dateValue[0] + ',' + ' ' + dateValue[1] + ' ' + dateValue[2];
    this.loadEvents(new Date(this.selectedDateFrom).toLocaleDateString("en-US").toString(), "4/1/2021")
    this.calendarObj.getApi().gotoDate(this.selectedDateFrom);
  }



  myDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return true;//day !== 0 && day !== 6;
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

    var d = new Date(paramD);
    return gsDayNames[d.getDay()];
  }

  onSelectNewDate(event) {
    //console.log(event);
    this.newDateFrom = event;
    const dateString = event.toDateString();
    this.newFormattedDate = new Date(this.newDateFrom).toLocaleDateString("en-US").toString();
    
  }


  handleDateSelect(selectInfo: DateSelectArg) {
    //console.log(selectInfo);
    var selected_date = selectInfo.startStr;//.toLocaleDateString("en-US").toString();
    //console.log(selected_date);
    this.newFormattedDate = selected_date;
    this.createNew();


  
  }

  handleEventClick(clickInfo: EventClickArg) {
    /*this.dlg.open(DiaryEntryComponent, {
      data: { id: clickInfo.event.id, title: clickInfo.event.title, date: clickInfo.event.start, color: clickInfo.event.backgroundColor },
    });*/
    this.router.navigate(['/diaryentry', clickInfo.event.id]);
    
  }

  handleEvents(events: EventApi[]) {
    //this.currentEvents = events;
  }

  createNew() {
    this.diaryService.addNewEntry(this.newFormattedDate).subscribe(result => {
      this.router.navigate(['/diaryentry', result]);
    }, error => console.error(error));
  }

  ngOnInit() {
    this.loadEvents("1/1/2000", "12/1/2021");
    this.diaryService.getTop10Months<ApiResult<Top10Months>>().subscribe(result => {
      //console.log(result);
      this.top10 = result.data;
    });
  }

  loadEvents(selected_date_from: string = new Date().toString(), selected_date_to: string = new Date().toString()) {
    var url = this.baseUrl + 'api/diary/GetCalendarEvents';
    var params = new HttpParams()
      .set("dateFrom", selected_date_from)
      .set("dateTo", selected_date_to);

    

    this.http.get<ApiResult<DiaryEntryCalendar>>(url, { params })
      .subscribe(result => {
        this.calendarOptions = {
          headerToolbar: {
            left: 'prev,next today',
            center: 'title'
          },
          initialView: 'dayGridMonth',
          weekends: true,
          editable: true,
          selectable: true,
          selectMirror: true,
          dayMaxEvents: true,
          select: this.handleDateSelect.bind(this),
          eventClick: this.handleEventClick.bind(this),
          eventsSet: this.handleEvents.bind(this),
          events: result.data
        };
        console.log(result.data);
      }, error => console.error(error));

    
  }
}
