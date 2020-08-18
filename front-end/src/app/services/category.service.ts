import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  API_CATEGORY = 'http://localhost:8080/user/home-store/category';

  constructor(public httpClient: HttpClient) { }

  getAllCategory(): Observable<any> {
    return this.httpClient.get(this.API_CATEGORY);
  }
}
