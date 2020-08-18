import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CakeService {
  private API_URL = '';

  constructor(public httpClient: HttpClient) { }

  findAllCake(): Observable<any> {
    return this.httpClient.get(this.API_URL);
  }

  findCakeById(id: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/' + id);
  }
}
