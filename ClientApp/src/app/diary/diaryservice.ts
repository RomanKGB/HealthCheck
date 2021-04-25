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

  addActivityToEntry(entry_id: number, activity_id: number): Observable<boolean>  {
    var url = this.baseUrl + "api/diary/addactivity?entry_id=" + entry_id + "&activity_id=" + activity_id;
    //var params = new HttpParams()
    //  .append("entry_id", entry_id.toString())
    //  .append("activity_id", activity_id.toString())
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

  isDupeCity(item): Observable<boolean> {
    var url = this.baseUrl + "api/Cities/IsDupeCity";
    return this.http.post<boolean>(url, item);
  }
}
