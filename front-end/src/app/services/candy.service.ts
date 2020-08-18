import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandyService {
  private API_URL = '';

  constructor(private httpClient: HttpClient) { }

  findAllCandy(): Observable<any> {
    return this.httpClient.get(this.API_URL);
  }

  findCandyById(id: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/' + id);
  }
}
