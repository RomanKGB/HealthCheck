import { Component, Inject, ViewChild, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar, FullCalendarComponent } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { DiaryEntry } from './diary';
import { ApiResult } from '../base.service';
import { DiaryEntryCalendar } from './diarycalendar';
import { MatDialog } from '@angular/material/dialog';
import { DiaryComponent } from './diary.component';
import { DiaryEntryComponent } from './diaryentry.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms'

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-diarycalendar',
  templateUrl: './diarycalendar.component.html',
  styleUrls: ['./diarycalendar.component.css']
})





export class DiaryCalendar {
  protected http: HttpClient;
  protected baseUrl: string;private 
  protected posts = [];
  protected selectedDateFrom = new Date("2021/01/01");
  protected selectedDateTo = new Date();
  protected startAt = new Date("2021/01/01");
  protected minDate = new Date('2012/01/01');
  protected maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
  protected currentMonth: string = new Date().getMonth().toString();
  protected DayAndDateFrom: string;
  protected dlg: MatDialog;
  date = new FormControl(new Date());
  
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private router: Router) {
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

  


  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    //need to create a new component to edit entries
    //this.dlg.open(new DiaryEntryComponent(this.http, this.baseUrl);

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId().toString(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
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

  ngOnInit() {
    this.loadEvents("1/1/2020","4/1/2021")
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
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
