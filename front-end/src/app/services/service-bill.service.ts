import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bill} from '../models/bill';
import {Distributor} from '../models/distributor';
import {Pay} from '../models/pay';
import {StorageLocation} from '../models/storage-location';
import {TypeBill} from '../models/type-bill';
import {WareHouse} from '../models/ware-house';
import {Transportation} from '../models/transportation';
import {Employees} from '../models/employees';
import {Pageable} from '../models/pagination/pageable';
import {Page} from '../models/pagination/page';
import {Product} from '../models/product';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ServiceBillService {
  API_URL_BILL = 'http://localhost:8080/bills';
  API_URL_WAREHOUSE = 'http://localhost:8080/wareHouses/';
  API_URL_TRANS = 'http://localhost:8080/transportations/';
  API_URL_TYPE_BILL = 'http://localhost:8080/typeBills/';
  API_URL_STORAGE = 'http://localhost:8080/storageLocations/';
  API_URL_PAY = 'http://localhost:8080/pays/';
  API_URL_EMPLOYEE = 'http://localhost:8080/employee/list';
  API_URL_DIST = 'http://localhost:8080/dist/list';
  API_URL_PAGE = 'http://localhost:8080/listBills';
  constructor(private httpClient: HttpClient) { }

  getPage(pageable: Pageable): Observable<Page<Bill>> {
    const url = this.API_URL_PAGE
      + '?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Bill>>(url, httpOptions);
  }

  create(bill: Partial<Bill>): Observable<Bill> {
    return this.httpClient.post<Bill>(this.API_URL_BILL + '/create-bill', bill);
  }

  findAllBill(): Observable<Bill[]> {
    return this.httpClient.get<Bill[]>(this.API_URL_BILL);
  }

  findAllDistributors(): Observable<Distributor[]> {
    return this.httpClient.get<Distributor[]>(this.API_URL_DIST);
  }

  findAllEmployee(): Observable<Employees[]> {
    return this.httpClient.get<Employees[]>(this.API_URL_EMPLOYEE);
  }

  findAllPay(): Observable<Pay[]> {
    return this.httpClient.get<Pay[]>(this.API_URL_PAY);
  }

  findAllStorageLocation(): Observable<StorageLocation[]> {
    return this.httpClient.get<StorageLocation[]>(this.API_URL_STORAGE);
  }

  findAllTypeBill(): Observable<TypeBill[]> {
    return this.httpClient.get<TypeBill[]>(this.API_URL_TYPE_BILL);
  }

  findAllWarehouse(): Observable<WareHouse[]> {
    return this.httpClient.get<WareHouse[]>(this.API_URL_WAREHOUSE);
  }

  findAllTransportation(): Observable<Transportation[]> {
    return this.httpClient.get<Transportation[]>(this.API_URL_TRANS);
  }

  updateBill(post: Bill): Observable<Bill> {
    return this.httpClient.patch<Bill>(this.API_URL_BILL + '/update/' + post.id, post);
  }

  findByIdBill(id: number): Observable<Bill> {
    return this.httpClient.get<Bill>(this.API_URL_BILL + '/' + id);
  }

  findByIdWareHouse(id: number): Observable<WareHouse> {
    return this.httpClient.get<WareHouse>(this.API_URL_WAREHOUSE + '/' + id);
  }

  deleteById(id: number): Observable<void> {
    // @ts-ignore
    return this.httpClient.patch<void>(this.API_URL_BILL + '/delete/' + id);
  }

}
