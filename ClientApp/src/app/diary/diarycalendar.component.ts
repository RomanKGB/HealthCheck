import { Component, Inject, ViewChild, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, Calendar } from '@fullcalendar/angular';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { DiaryEntry } from './diary';
import { ApiResult } from '../base.service';
import { DiaryEntryCalendar } from './diarycalendar';


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
  protected baseUrl: string;
  protected posts = [];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = http;
    //this.onSelectTo(this.selectedDate);
  }


  calendarVisible = true;
  calendarOptions: CalendarOptions;
  /*= {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    //initialEvents: INITIAL_EVENTS,
    // alternatively, use the `events` setting to fetch from a feed
    events: [
      { title: 'event 1', date: '2021-04-01' },
      { title: 'event 2', date: '2021-04-02' }
    ],
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    //dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  };


  //currentEvents: EventApi[] = [];//{ title: 'event 1', date: '2019-04-01' },{ title: 'event 2', date: '2019-04-02' };

  //currentEvents.

  */

  


  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

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
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
    //{ title: 'event 1', date: '2019-04-01' }, { title: 'event 2', date: '2019-04-02' };
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
          initialView: 'dayGridMonth',
          events: result.data
        };
        console.log(result.data);
      }, error => console.error(error));

    
  }
}
