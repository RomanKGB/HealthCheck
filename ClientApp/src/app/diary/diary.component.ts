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
  public displayedColumns: string[] = ['entry_id', 'entry_date', 'entry_text', 'entry_color'];
  public entries: MatTableDataSource<DiaryEntry>;
  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "entry_id";
  public defaultSortOrder: string = "asc";
  defaultFilterColumn: string = "entry_date";
  filterQuery: string = null;
  protected http: HttpClient;
  protected baseUrl: string;
  title = 'ng-calendar-demo';
  selectedDate = new Date("2021/01/01");
  startAt = new Date("2021/01/01");
  minDate = new Date('2012/01/01');
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 1));
  year: any;
  DayAndDate: string;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
    this.http = http;
    this.onSelect(this.selectedDate);
  }

  ngOnInit() {
    this.loadData(null);
  }

  

  onSelect(event) {
    console.log(event);
    this.selectedDate = event;
    const dateString = event.toDateString();
    console.log(new Date().toLocaleDateString("en-US").toString());
    console.log(new Date(dateString).toLocaleDateString("en-US").toString());
    const dateValue = dateString.split(' ');
    this.year = dateValue[3];
    this.DayAndDate = dateValue[0] + ',' + ' ' + dateValue[1] + ' ' + dateValue[2];
    
    this.getEntries(new Date(dateString).toLocaleDateString("en-US").toString());
  }

  myDateFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
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


    this.http.get < ApiResult<DiaryEntry>>(url, { params })
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
