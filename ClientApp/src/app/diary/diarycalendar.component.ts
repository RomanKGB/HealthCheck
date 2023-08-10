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
  public displayedColumns: string[] = ['diary_month', 'diary_year', 'avg_points_completed'];
  public displayedColumns2: string[] = ['date','title','weight'];
  public posts = [];
  public selectedDateFrom = new Date("2013/01/01");
  public newDateFrom = new Date();
  public newFormattedDate: string = new Date().toLocaleDateString("en-US").toString();
  public selectedDateTo = new Date();
  public startAt = new Date("2000/01/01");
  public minDate = new Date('2012/01/01');
  public maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
  public currentMonth: string = new Date().getMonth().toString();
  public currentYear: string = new Date().getFullYear().toString();
  public DayAndDateFrom: string;
  public highlightsMonth: string = (new Date().getMonth() + 1).toString();
  public highlightsYear: string = new Date().getFullYear().toString();
 
  protected dlg: MatDialog;
  date = new FormControl(new Date());

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private router: Router, private diaryService: DiaryService,
    private activatedRoute: ActivatedRoute) {
    this.baseUrl = baseUrl;
    this.http = http;
    
  }
  
  calendarVisible = true;
  calendarOptions: CalendarOptions;

  @ViewChild('calendar') calendarObj: FullCalendarComponent;

  currentEvents: EventApi[] = [];
  top10: Top10Months[] = [];
  month_highlights: DiaryEntryCalendar[] = [];

  getRecord(rowObj) {
    this.calendarObj.getApi().gotoDate(new Date(rowObj.diary_month + "/1/" + rowObj.diary_year));
    this.highlightsMonth = rowObj.diary_month;
    this.highlightsYear = rowObj.diary_year;
    this.loadHighlights();
  }

  getRecordEntry(rowObj) {
    this.router.navigate(['/diaryentry', rowObj.id]);
  }

  onSelectDate(event) {
    this.selectedDateFrom = event;
    const dateString = event.toDateString();
    this.currentMonth = new Date(dateString).getMonth.toString();

    const dateValue = dateString.split(' ');
    
    this.DayAndDateFrom = dateValue[1] + ',' + ' ' + dateValue[2] + ' ' + dateValue[3];
    this.newDateFrom = this.selectedDateFrom;
    //this.loadEvents(new Date(this.DayAndDateFrom).toLocaleDateString("en-US").toString(), this.maxDate.toLocaleDateString("en-US").toString());
    this.calendarObj.getApi().gotoDate(this.selectedDateFrom);
    this.currentMonth = (this.selectedDateFrom.getMonth()+1).toString();
    this.currentYear = this.selectedDateFrom.getFullYear().toString();

    this.loadHighlights();
    this.diaryService.getTop10Months<ApiResult<Top10Months>>(this.currentMonth, this.currentYear).subscribe(result => {
      this.top10 = result.data;
    });
  }



  myDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    
    return true;
    // Prevent Saturday and Sunday from being selected.
    //day !== 0 && day !== 6;
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
    return gsDayNames[d.getDay()];
  }

  onSelectNewDate(event) {
    //console.log(event);
    this.newDateFrom = event;
    const dateString = event.toDateString();
    //this.newFormattedDate = new Date(this.newDateFrom).toLocaleDateString("en-US").toString();
    this.newFormattedDate = this.newDateFrom.toLocaleDateString("en-US").toString();
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
    try {
      this.currentMonth = this.activatedRoute.snapshot.paramMap.get('cal_month').toString();
      this.currentYear = this.activatedRoute.snapshot.paramMap.get('cal_year').toString();
    }
    catch(e) {
      this.currentMonth = (new Date().getMonth()+1).toString();
      this.currentYear = new Date().getFullYear().toString();
    }
    console.log("Month:" + this.currentMonth + "Year:" + this.currentYear);
    this.loadEvents("1/1/2000", "12/1/2025");
    this.diaryService.getTop10Months<ApiResult<Top10Months>>(this.currentMonth, this.currentYear).subscribe(result => {
      this.top10 = result.data;
    });
    this.loadHighlights();
    
  }

  loadHighlights() {
    var url = this.baseUrl + 'api/diary/getmonthhighlights';
    var params = new HttpParams()
      //.set("month", this.highlightsMonth)
      //.set("year", this.highlightsYear);
      .set("month", this.currentMonth)
      .set("year", this.currentYear);

    console.log("Load current month:" + this.currentMonth);
    this.http.get<ApiResult<DiaryEntryCalendar>>(url, { params })
      .subscribe(result => {
        this.month_highlights = result.data;
        console.log(result.data);
      }, error => console.error(error));


  }

  nextMonth(): void {
    this.currentYear = (parseInt(this.currentMonth) == 12 ? (parseInt(this.currentYear) + 1).toString(): this.currentYear);
    this.currentMonth = (parseInt(this.currentMonth) == 12 ? 1 : parseInt(this.currentMonth) + 1).toString();
    console.log("Next current month:" + this.currentMonth);
    console.log("Next current year:" + this.currentYear);
    this.calendarObj.getApi().next();
    this.loadHighlights();
    this.diaryService.getTop10Months<ApiResult<Top10Months>>(this.currentMonth, this.currentYear).subscribe(result => {
      this.top10 = result.data;
    });
  }

  prevMonth(): void {
    this.currentYear = (parseInt(this.currentMonth) == 12 ? (parseInt(this.currentYear) - 1).toString() : this.currentYear);
    this.currentMonth = (parseInt(this.currentMonth) == 1 ? 12 : parseInt(this.currentMonth) - 1).toString();
    console.log("Prev current month:" + this.currentMonth);
    console.log("Prev current year:" + this.currentYear);
    this.calendarObj.getApi().prev();
    this.loadHighlights();
    this.diaryService.getTop10Months<ApiResult<Top10Months>>(this.currentMonth, this.currentYear).subscribe(result => {
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
          customButtons: {
            next: {
              click: this.nextMonth.bind(this),
            },
            prev: {
              click: this.prevMonth.bind(this),
            },
            today: {
              text: "Today",
              //click: this.currentMonth.bind(this),
            },
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
        this.calendarObj.getApi().gotoDate(new Date(this.currentMonth + "/1/" + this.currentYear));
        this.newDateFrom = new Date(this.currentMonth + "/" + new Date().getDay + "/" +this.currentYear);
      }, error => console.error(error));

    
  }
}
