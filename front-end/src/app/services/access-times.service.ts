import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Role} from '../models/role';
import {HttpClient} from '@angular/common/http';
import {Accesstimes} from '../models/accesstimes';

@Injectable({
  providedIn: 'root'
})
export class AccessTimesService {
  API_URL = 'http://localhost:8080/access-times';
  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Accesstimes[]> {
    return this.httpClient.get<Accesstimes[]>(this.API_URL);
  }
  findAllMonth(): Observable<Accesstimes[]>{
    return this.httpClient.get<Accesstimes[]>(this.API_URL + '-month')
  }
  findAllYear(): Observable<Accesstimes[]>{
    return this.httpClient.get<Accesstimes[]>(this.API_URL + '-year')
  }
}
