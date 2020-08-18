import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Province} from '../models/province';
import {Commune} from '../models/commune';
import {District} from '../models/district';


@Injectable({
  providedIn: 'root'
})
export class AddressService {
  MY_API_URL = 'http://localhost:8080';
  private httpOptions: any;
  constructor(private httpClient: HttpClient) {
  }
  findAllProvince(): Observable<Province[]> {
    return this.httpClient.get<Province[]>(this.MY_API_URL + '/location/province/list');
  }
  findProvinceById(id: string): Observable<Province> {
    return this.httpClient.get<Province>(this.MY_API_URL + '/location/province/' + id);
  }
  findDistrictById(id: string): Observable<District> {
    return this.httpClient.get<District>(this.MY_API_URL + '/location/district/' + id);
  }
  findCommuneById(id: string): Observable<Commune> {
    return this.httpClient.get<Commune>(this.MY_API_URL + '/location/ward/' + id);
  }
  findAllDistrictByProvinceId(id: string): Observable<District[]> {
    return this.httpClient.get<District[]>(this.MY_API_URL + '/location/province/getDistrict/' + id);
  }
  findAllCommuneByDistrictId(id: string): Observable<Commune[]> {
    return this.httpClient.get<Commune[]>(this.MY_API_URL + '/location/district/getCommune/' + id);
  }
}
