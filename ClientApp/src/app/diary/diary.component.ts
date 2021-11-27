import { Component, Inject, ViewChild, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DiaryEntry } from './diary';
import { Observable } from 'rxjs';
import { ApiResult } from '../base.service';
import { FormGroup, FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-diaries',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})

export class DiaryComponent {
  public displayedColumns: string[] = ['entry_date', 'entry_text', 'entry_color'];
  public entries: MatTableDataSource<DiaryEntry>;
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "entry_date";
  public defaultSortOrder: string = "asc";
  defaultFilterColumn: string = "entry_date";
  filterQuery: string = null;
  protected http: HttpClient;
  protected baseUrl: string;
  title = 'ng-calendar-demo';
  selectedDateFrom = new Date("2021/01/01");
  selectedDateTo = new Date();
  startAt = new Date("2021/01/01");
  startAtTo = new Date();
  minDate = new Date('2012/01/01');
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
  yearFrom: any;
  yearTo: any;
  DayAndDateFrom: string;
  DayAndDateTo: string;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = http;
    //this.onSelectTo(this.selectedDate);
  }

  ngOnInit() {
    //set start date
    var dateString = this.selectedDateFrom.toDateString();
    var dateValue = dateString.split(' ');
    this.yearFrom = dateValue[3];
    this.DayAndDateFrom = dateValue[0] + ',' + ' ' + dateValue[1] + ' ' + dateValue[2];
    //set end date
    dateString = this.selectedDateTo.toDateString();
    dateValue = dateString.split(' ');
    this.yearTo = dateValue[3];
    this.DayAndDateTo = dateValue[0] + ',' + ' ' + dateValue[1] + ' ' + dateValue[2];
    //this.loadData(null);
    this.getEntries2(new Date(this.selectedDateFrom).toLocaleDateString("en-US").toString(), new Date(this.selectedDateTo).toLocaleDateString("en-US").toString());
  }

  colorCell(entry_color: number) {
    
    if (entry_color >= 150) return "blue";
    if (entry_color >= 139) return "green";
    if (entry_color >= 129) return "yellow";
    if (entry_color >= 119) return "orange";
    else return "red";


  }

  onSelectFrom(event) {
    
    this.selectedDateFrom = event;
    const dateString = event.toDateString();
    console.log(dateString);
    const dateValue = dateString.split(' ');
    this.yearFrom = dateValue[3];
    this.DayAndDateFrom = dateValue[0] + ',' + ' ' + dateValue[1] + ' ' + dateValue[2];
    console.log(this.DayAndDateFrom);
    
    this.getEntries2(new Date(this.selectedDateFrom).toLocaleDateString("en-US").toString(), new Date(this.selectedDateTo).toLocaleDateString("en-US").toString());
  }

  onSelectTo(event) {
    
    this.selectedDateTo = event;
    const dateString = event.toDateString();
    
    const dateValue = dateString.split(' ');
    this.yearTo = dateValue[3];
    this.DayAndDateTo = dateValue[0] + ',' + ' ' + dateValue[1] + ' ' + dateValue[2];

    
    this.getEntries2(new Date(this.selectedDateFrom).toLocaleDateString("en-US").toString(), new Date(this.selectedDateTo).toLocaleDateString("en-US").toString());
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

  formatText=(stringToFormat:string): string=>{
    var arrItems = stringToFormat.split("<li>");
    var retString = "";

    for (var i = 0; i < arrItems.length; i++) {
      console.log(arrItems[i].toString());
      retString = retString + "<p>" +  arrItems[i].toString() +"</p>";
    }
    console.log(retString);
    return stringToFormat;
}

  loadData(query: string = null) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    if (query) {
      this.filterQuery = query;
    }
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {
    var url = this.baseUrl + 'api/diary';
    var params = new HttpParams()
      .set("pageIndex", event.pageIndex.toString())
      .set("pageSize", event.pageSize.toString())
      .set("sortColumn", (this.sort)
        ? this.sort.active
        : this.defaultSortColumn)
      .set("sortOrder", (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder);
    if (this.filterQuery) {
      params = params.set("filterColumn", this.defaultFilterColumn)
        .set("filterQuery", this.filterQuery);
    }



    var sortColumn = (this.sort) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort) ? this.sort.direction : this.defaultSortOrder;
    var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    var filterQuery = (this.filterQuery) ? this.filterQuery : null;


    
    this.getEntries2(this.selectedDateFrom.toString(), this.selectedDateTo.toString(), event.pageIndex.toString(), event.pageSize.toString())
  }

  getEntries2(selected_date_from: string = new Date().toString(), selected_date_to: string = new Date().toString(),
            paramPageIndex:string="0", paramPageSize:string="50") {
    console.log("From:" + new Date(this.selectedDateFrom).toLocaleDateString("en-US").toString() + ", To:" + new Date(this.selectedDateTo).toLocaleDateString("en-US").toString());
    var url = this.baseUrl + 'api/diary/GetRange';
    var params = new HttpParams()
      .set("pageIndex", paramPageIndex)
      .set("pageSize", paramPageSize)
      .set("sortColumn", (this.sort)
        ? this.sort.active
        : this.defaultSortColumn)
      .set("sortOrder", (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder);
    
    params = params.set("dateFrom", new Date(this.selectedDateFrom).toLocaleDateString("en-US").toString() )
      .set("dateTo", new Date(this.selectedDateTo).toLocaleDateString("en-US").toString());
    



    var sortColumn = (this.sort) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort) ? this.sort.direction : this.defaultSortOrder;
    var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    var filterQuery = (this.filterQuery) ? this.filterQuery : null;


    this.http.get<ApiResult<DiaryEntry>>(url, { params })
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.entries = new MatTableDataSource<DiaryEntry>(result.data);
      }, error => console.error(error));

    
  }

  getEntries(selected_date: string = new Date().toString()) {
    var url = this.baseUrl + 'api/diary';
    var params = new HttpParams()
      .set("pageIndex", this.defaultPageIndex.toString())
      .set("pageSize", this.defaultPageSize.toString())
      .set("sortColumn", (this.sort)
        ? this.sort.active
        : this.defaultSortColumn)
      .set("sortOrder", (this.sort)
        ? this.sort.direction
        : this.defaultSortOrder);
    //if (this.filterQuery) {
      params = params.set("filterColumn", this.defaultFilterColumn)
        .set("filterQuery", selected_date);
        //.set("filterQuery", "01/01/2018");
    //}

    //params = params.set("selected_date", selected_date);


    var sortColumn = (this.sort) ? this.sort.active : this.defaultSortColumn;
    var sortOrder = (this.sort) ? this.sort.direction : this.defaultSortOrder;
    var filterColumn = (this.filterQuery) ? this.defaultFilterColumn : null;
    var filterQuery = (this.filterQuery) ? this.filterQuery : null;


    this.http.get<ApiResult<DiaryEntry>>(url, { params })
      .subscribe(result => {
        this.paginator.length = result.totalCount;
        this.paginator.pageIndex = result.pageIndex;
        this.paginator.pageSize = result.pageSize;
        this.entries = new MatTableDataSource<DiaryEntry>(result.data);
      }, error => console.error(error));
  }
}
