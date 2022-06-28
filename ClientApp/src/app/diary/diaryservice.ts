import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from '../base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class DiaryService extends BaseService {

  constructor(
    http: HttpClient,
    @Inject('BASE_URL') baseUrl: string) {
    super(http, baseUrl)
  }

  getData<ApiResult>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult> {

    var url = this.baseUrl + 'api/Cities';
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterQuery) {
      params = params
        .set("filterQuery", filterQuery)
        .set("filterColumn", filterColumn);
    }

    return this.http.get<ApiResult>(url, { params });
  }

  get<City>(id): Observable<City> {
    var url = this.baseUrl + "api/Cities/" + id;
    return this.http.get<City>(url);
  }

  put<City>(item): Observable<City> {
    var url = this.baseUrl + "api/Cities/" + item.id;
    return this.http.put<City>(url, item);
  }

  post<City>(item): Observable<City> {
    var url = this.baseUrl + "api/Cities";
    return this.http.post<City>(url, item);
  }

  addActivityToEntry(entry_id: number, activity_id: string): Observable<boolean>  {
    var url = this.baseUrl + "api/diary/addactivity?entry_id=" + entry_id + "&activity_id=" + activity_id;
    return this.http.post<boolean>(url, null);
     
  }

  setHighlightDay(entry_id: number, highlight: string): Observable<boolean> {
    var url = this.baseUrl + "api/diary/sethighlight?entry_id=" + entry_id + "&highlight=" + highlight;
    return this.http.post<boolean>(url, null);

  }

  deleteActivitiesFromEntry(entry_id: number, activity_id: string): Observable<boolean> {
    var url = this.baseUrl + "api/diary/deleteactivity?entry_id=" + entry_id + "&activity_id=" + activity_id;
    return this.http.post<boolean>(url, null);

  }

  markDone(entry_id: number, activity_id: string, is_done: number): Observable<boolean> {
    var url = this.baseUrl + "api/diary/markdone?entry_id=" + entry_id + "&activity_id=" + activity_id + "&is_done=" + is_done;
    return this.http.post<boolean>(url, null);

  }

  addNewActivity(activity_name: string, activity_points: number): Observable<boolean> {
    var url = this.baseUrl + "api/diary/addnewactivity?activity_name=" + activity_name + "&activity_points=" + activity_points;
    return this.http.post<boolean>(url, null);
  }

  addNewEntry(entry_date:string): Observable<boolean> {
    var url = this.baseUrl + "api/diary/addnewentry?entry_date="+entry_date;
    return this.http.post<boolean>(url, null);
  }

  updateComment(comment: string, weight: number, entry_id: number): Observable<boolean> {
    var url = this.baseUrl + "api/diary/updatecomment?comment=" + comment + "&weight=" + weight + "&entry_id=" + entry_id;
    return this.http.post<boolean>(url, null);

  }

  getCountries<ApiResult>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult> {
    var url = this.baseUrl + 'api/Countries';
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterQuery) {
      params = params
        .set("filterQuery", filterQuery)
        .set("filterColumn", filterColumn);
    }

    return this.http.get<ApiResult>(url, { params });
  }

  getDiaryEntries<ApiResult>(
    pageIndex: number,
    pageSize: number,
    sortColumn: string,
    sortOrder: string,
    filterColumn: string,
    filterQuery: string): Observable<ApiResult> {
    var url = this.baseUrl + 'api/Diary';
    var params = new HttpParams()
      .set("pageIndex", pageIndex.toString())
      .set("pageSize", pageSize.toString())
      .set("sortColumn", sortColumn)
      .set("sortOrder", sortOrder);

    if (filterQuery) {
      params = params
        .set("filterQuery", filterQuery)
        .set("filterColumn", filterColumn);
    }

    return this.http.get<ApiResult>(url, { params });
  }

  getActivities<ApiResult>(entry_id:string): Observable<ApiResult> {
    var url = this.baseUrl + 'api/diary/getactivities';
    var params = new HttpParams()
      .set("entry_id", entry_id)
      
    
    return this.http.get<ApiResult>(url, { params });
  }

  getTop10Months<ApiResult>(pMonth: string, pYear: string): Observable<ApiResult> {
    var url = this.baseUrl + 'api/diary/gettoptenmonths?pMonth=' + pMonth + "&pYear=" + pYear;
    
    return this.http.get<ApiResult>(url);
  }

  getEntryActivities<ApiResult>(entry_id:string): Observable<ApiResult> {
    var url = this.baseUrl + 'api/diary/getentryactivities';
    var params = new HttpParams()
      .set("entry_id", entry_id)
      

    return this.http.get<ApiResult>(url, { params });
  }

  isDupeCity(item): Observable<boolean> {
    var url = this.baseUrl + "api/Cities/IsDupeCity";
    return this.http.post<boolean>(url, item);
  }
}
