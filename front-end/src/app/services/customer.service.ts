import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Customer} from '../models/customer';
import {TokenStorageService} from '../auth/token-storage.service';
import {Employee} from '../models/employee';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  public readonly API_URL = 'http://localhost:8080/customers';
  public readonly API_URL_ACCOUNT = 'http://localhost:8080/customer-account';
  private httpOptions: any;
  constructor(private httpClient: HttpClient, private tokenStorage: TokenStorageService) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
      , 'Access-Control-Allow-Origin': 'http://localhost:4200/', 'Access-Control-Allow-Methods': 'POST,GET,PUT',
    };
  }

  getAllCustomerWithSearchAndPageAndFilter(page, size, search, value1, value2): Observable<any> {
    return this.httpClient.get(this.API_URL +
      '?page=' + page + '&size=' + size + '&search='
      + search + '&value1=' + value1 + ' &value2=' + value2, this.httpOptions);
  }

  getCustomerById(id: number): Observable<any> {
    // return this.httpClient.get<Student>(`${this.API_URL}/${id}`);
    return this.httpClient.get<Customer>(this.API_URL + '/' + id, this.httpOptions);
  }

  getCustomerByName(name: string): Observable<Customer> {
    // return this.httpClient.get<Student>(`${this.API_URL}/${id}`);
    return this.httpClient.get<Customer>(this.API_URL + '/' + name);
  }

  addNewCustomer(customer: Partial<Customer>): Observable<any> {
    return this.httpClient.post<Customer>(this.API_URL + '/', customer, this.httpOptions);
  }

  deleteCustomerById(id: number): Observable<void> {
    return this.httpClient.delete<void>(this.API_URL + '/' + id);
  }

  // deleteAllCustomer(): Observable<void> {
  //   return this.httpClient.delete<void>(this.API_URL + '/' + id);
  // }

  editCustomer(customer: Customer): Observable<Customer> {
    return this.httpClient.patch<Customer>(this.API_URL + '/' + customer.id, customer);
  }

  getCustomerByAccountName(accountName: string): Observable<any> {
    return this.httpClient.get<Customer>(this.API_URL_ACCOUNT + '/' + accountName);
  }

  getAllCustomer(): Observable<Customer[]> {
    return this.httpClient.get<Customer[]>('http://localhost:8080/customer-list');
  }
}
