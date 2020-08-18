import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Brand} from '../models/brand';

@Injectable()
export class BrandService {
  private API_URL = 'http://localhost:8080/warehouse-management/brand';
  API_URL_1 = 'http://localhost:8080/user/home-store/all-brand';

  constructor(private http: HttpClient) {
  }

  getAllBrand(curentPage, size, search): Observable<any> {
    return this.http.get(this.API_URL + '?page=' + curentPage + '&size=' + size + '&search=' + search);
  }

  createBrand(brand: Partial<Brand>): Observable<Brand> {
    return this.http.post<Brand>(this.API_URL + '/create', brand);
  }

  findById(id: number): Observable<Brand> {
    return this.http.get<Brand>(this.API_URL + '/' + id);
  }

  editBrand(brand): Observable<Brand> {
    return this.http.put<Brand>(this.API_URL + '/update/' + brand.id, brand);
  }

  deleteBrand(brand): Observable<Brand> {
    return this.http.patch<Brand>(this.API_URL + '/delete/' + brand.id, brand);
  }
  deleteBrandById(id: number): Observable<void> {
    return this.http.delete<void>(this.API_URL + '/' + id);
  }

  getAllBrandToOption(): Observable<any> {
    return this.http.get(this.API_URL_1);
  }
}
