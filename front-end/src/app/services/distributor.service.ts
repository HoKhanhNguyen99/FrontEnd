import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
// @ts-ignore
import {DeleteListDistributor, Distributor, DistributorDeleteAllResuilt, TypeOfDistributor} from '../models/distributor';
import {Observable} from 'rxjs';
import {Province} from '../models/province';
import {District} from '../models/district';
import {Commune} from '../models/commune';
import {Bill} from '../models/bill';

@Injectable({
  providedIn: 'root'
})
export class DistributorService {
  MY_API_URL = 'http://localhost:8080';
  private httpOptions: any;

  constructor(private httpClient: HttpClient) {
  }

  findAll(): Observable<Distributor[]> {
    return this.httpClient.get<Distributor[]>(this.MY_API_URL + '/distributor/list');
  }

  findById(id: number): Observable<Distributor> {
    return this.httpClient.get<Distributor>(this.MY_API_URL + '/distributor/' + id);
  }

  create(distributor: Partial<Distributor>): Observable<Distributor> {
    return this.httpClient.post<Distributor>(this.MY_API_URL + '/distributor/create', distributor);
  }

  deleteById(id: number): Observable<void> {
    return this.httpClient.get<void>(this.MY_API_URL + '/distributor/delete/' + id);
  }

  editEmployee(distributor, distributorId): Observable<any> {
    return this.httpClient.put(this.MY_API_URL + '/' + distributorId, distributor);
  }

  // // Thach

  findByName(name: string): Observable<TypeOfDistributor> {
    return this.httpClient.get<TypeOfDistributor>(this.MY_API_URL + '/type_distributor/' + name);
  }

  save(item: Distributor): Observable<any> {
    return this.httpClient.post<any>(this.MY_API_URL + '/distributor', item);
  }

  getAllDistributor(currentPage, size, search): Observable<any> {
    return this.httpClient.get(this.MY_API_URL + '/distributor/list' + '?page=' + currentPage + '&size='
      + size + '&search=' + search, this.httpOptions);
  }

  findTypeOfDistributorByName(name: string): Observable<TypeOfDistributor> {
    return this.httpClient.get<TypeOfDistributor>(this.MY_API_URL + '/type_distributor/' + name);
  }

  deleteAllDistributor(list: DeleteListDistributor[]): Observable<DistributorDeleteAllResuilt> {
    const sendList: number[] = [];
    for (let i = 0; i < list.length; i++) {
      sendList[i] = list[i].id;
    }
    return this.httpClient.post<DistributorDeleteAllResuilt>(this.MY_API_URL + '/distributor/deleteAll', sendList);
  }

  isExistDistributorName(name: string, id: number): Observable<Distributor> {
    return this.httpClient.get<Distributor>(this.MY_API_URL + '/distributor/exist/' + name + '/' + id);
  }

  findAllProvince(): Observable<Province[]> {
    return this.httpClient.get<Province[]>(this.MY_API_URL + '/location/province/list');
  }

  findProvinceById(id: string): Observable<Province> {
    return this.httpClient.get<Province>(this.MY_API_URL + '/location/province/' + id);
  }

  findAllDistrictByProvinceId(id: string): Observable<District[]> {
    return this.httpClient.get<District[]>(this.MY_API_URL + '/location/province/getDistrict/' + id);
  }

  findAllCommuneByDistrictId(id: string): Observable<Commune[]> {
    return this.httpClient.get<Commune[]>(this.MY_API_URL + '/location/district/getCommune/' + id);
  }


  findAllBillIsExistDistributor(id: number): Observable<Bill[]> {
    return this.httpClient.get<Bill[]>(this.MY_API_URL + '/distributor/getListBills/' + id);
  }

  findCommuneById(id: string): Observable<Commune> {
    return this.httpClient.get<Commune>(this.MY_API_URL + '/location/communeById/' + id);
  }


  findCommuneByName(name: string): Observable<Commune> {
    return this.httpClient.get<Commune>(this.MY_API_URL + '/location/communeName/' + name);
  }

  findDistrictByName(name: string): Observable<District> {
    return this.httpClient.get<District>(this.MY_API_URL + '/location/district/' + name);
  }

  findProvinceByName(name: string): Observable<Province> {
    return this.httpClient.get<Province>(this.MY_API_URL + '/location/provinceName/' + name);
  }

  findByIdToDo(id: number, status: number): Observable<Distributor> {
    return this.httpClient.get<Distributor>(this.MY_API_URL + '/distributorToDo/' + id + '/' + status);
  }

  removeSession(id: number): Observable<void> {
    return this.httpClient.get<void>(this.MY_API_URL + '/distributor/removeSession/' + id);
  }

  checkIsNotModifying(id: number): Observable<boolean> {
    return this.httpClient.get<boolean>(this.MY_API_URL + '/distributor/isNotModifying/' + id);
  }

  setSession(id: number, status: number): Observable<any> {
    return this.httpClient.get<any>(this.MY_API_URL + '/distributor/setSession/' + id + '/' + status);
  }
}
