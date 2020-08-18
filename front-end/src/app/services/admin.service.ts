import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {EMPTY, Observable, throwError} from 'rxjs';
import {Account} from '../models/account';
import {Employees} from '../models/employees';
import {Role} from '../models/role';
import {TokenStorageService} from '../auth/token-storage.service';
import {Customer} from '../models/customer';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  API_URL = 'http://localhost:8080/account';
  API_URL_MEMBERACCOUNT = 'http://localhost:8080/createMemberAccount';
  API_ROLE_URL = 'http://localhost:8080/role';
  httpOptions: any;
  httpOptions2: any;
  API_URL2 = 'http://localhost:8080/accountsss';

  constructor(private httpClient: HttpClient, private tokenStorage: TokenStorageService) {
    this.httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
      , 'Access-Control-Allow-Origin': 'http://localhost:4200/create', 'Access-Control-Allow-Methods': 'GET,PUT,POST'
    };
    this.httpOptions2 = {
      headers: new HttpHeaders({'Content-Type': 'application/json', Authorization: `Bearer ` + this.tokenStorage.getToken()})
      , 'Access-Control-Allow-Origin': 'http://localhost:4200/admin', 'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    };
  }

  getAllCourse(currentPage, size, search, nameRole): Observable<any> {
    return this.httpClient.get(this.API_URL + '?page=' + currentPage + '&size=' + size + '&search=' + search + '&role=' + nameRole)
      .pipe(catchError(this.handleError));
  }

  getAllAccountNotInEmployee(): Observable<any> {
    return this.httpClient.get(this.API_URL2)
  }

  findAll(): Observable<Account[]> {
    return this.httpClient.get<Account[]>(this.API_URL).pipe(catchError(this.handleError));
  }

  findAllRole(): Observable<Role[]> {
    return this.httpClient.get<Role[]>(this.API_ROLE_URL).pipe(catchError(this.handleError));
  }

  findRoleById(roleId: number): Observable<any> {
    return this.httpClient.get<Role>(this.API_ROLE_URL + '/' + roleId, this.httpOptions2).pipe(catchError(this.handleError));
  }

  findByInfoId(accountId: number): Observable<Employees> {
    return this.httpClient.get<Employees>(this.API_URL + '/employee/' + accountId).pipe(catchError(this.handleError));
  }

  // tslint:disable-next-line:typedef
  handleError(error: HttpErrorResponse) {
    let errorMessage;
    if (error.error instanceof ErrorEvent) {
      errorMessage = '';
    } else {
      errorMessage = '';
    }
    return throwError(errorMessage);
  }

  findByInfoUserId(accountId: number): Observable<Customer> {

    return this.httpClient.get<Customer>(this.API_URL + '/user/' + accountId)
      .pipe(catchError(this.handleError));
  }

  findAccountById(accountId: number): Observable<Account> {
    return this.httpClient.get<Account>(this.API_URL + '/' + accountId)
      .pipe(catchError(this.handleError));
  }

  create(account: Account): Observable<any> {
    return this.httpClient.post<Account>(this.API_URL + '/create', account, this.httpOptions2)
      .pipe(catchError(this.handleError));
  }
  createMemberAccount(account: Account): Observable<any> {
    return this.httpClient.post<Account>(this.API_URL_MEMBERACCOUNT, account, this.httpOptions)
      .pipe(catchError(this.handleError));
  }
  delete(account: Account): Observable<Account> {
    // @ts-ignore
    return this.httpClient.request('delete', this.API_URL + '/delete/' + account.accountId, {body: account})
      .pipe(catchError(this.handleError));
  }

  edit(account: Account): Observable<Account> {
    return this.httpClient.put<Account>(this.API_URL + '/update/' + account.accountId, account)
      .pipe(catchError(this.handleError));
  }
}
