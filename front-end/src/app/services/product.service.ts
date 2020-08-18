import {Injectable} from '@angular/core';
import {Product} from '../models/product';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Pageable} from '../models/pagination/pageable';
import {Page} from '../models/pagination/page';
import {Unit} from '../models/unit';
import {Brand} from '../models/brand';
import {Category} from '../models/category';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};
const BASE_API_URL = 'http://localhost:8080/warehouse-management';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productUrl = BASE_API_URL + '/listProducts';
  private productByIdUrl = BASE_API_URL + '/product/';
  private createUrl = BASE_API_URL + '/create_product';
  private deleteUrl = BASE_API_URL + '/delete_product/';
  private updateUrl = BASE_API_URL + '/update_product/';
  private unitUrl = BASE_API_URL + '/listUnit';
  private categoryUrl = BASE_API_URL + '/listCategory';
  private brandUrl = BASE_API_URL + '/brand';

  private brandByCategoryIdUrl = BASE_API_URL + '/listBrandByCategory/';
  private productByCategoryAndBrandUrl = BASE_API_URL + '/listProductByCategoryAndBrand/';
  private productByCategoryUrl = BASE_API_URL + '/listProductByCategory/';
  private searchProductUrl = BASE_API_URL + '/searchProduct/';
  private searchProductByName = BASE_API_URL + '/searchProductByName/';
  private searchProductByPrice = BASE_API_URL + '/searchProductByPrice/';
  private searchProductByCategoryBrandNamePrice = BASE_API_URL + '/searchProductByCategoryBrandNamePrice/';
  private searchProductByCategoryBrandPrice = BASE_API_URL + '/searchProductByCategoryBrandPrice/';
  private searchProductByCategoryBrandName = BASE_API_URL + '/searchProductByCategoryBrandName/';
  private searchProductByCategoryNamePrice = BASE_API_URL + '/searchProductByCategoryNamePrice/';
  private searchProductByCategoryName = BASE_API_URL + '/searchProductByCategoryName/';
  private searchProductByCategoryPrice = BASE_API_URL + '/searchProductByCategoryPrice/';
  private API_URL = 'http://localhost:8080/user/home-store';

  constructor(private httpClient: HttpClient) {
  }

  findAllUnit(): Observable<Unit[]> {
    return this.httpClient.get<Unit[]>(this.unitUrl);
  }

  findAllBrand(): Observable<Brand[]> {
    return this.httpClient.get<Brand[]>(this.brandUrl);
  }

  findAllCategory(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.categoryUrl);
  }

  getPage(pageable: Pageable): Observable<Page<Product>> {
    const url = this.productUrl
      + '?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  findProductById(id: number): Observable<Product> {
    return this.httpClient.get<Product>(this.productByIdUrl + id);
  }

  createNew(product: Partial<Product>): Observable<Product> {
    return this.httpClient.post<Product>(this.createUrl, product);
  }

  deleteProduct(product: Product): Observable<Product> {
    return this.httpClient.patch<Product>(this.deleteUrl + product.productId, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.httpClient.patch<Product>(this.updateUrl + product.productId, product);
  }

  findBrandByCategoryId(id: string): Observable<Product> {
    return this.httpClient.get<Product>(this.brandByCategoryIdUrl + id);
  }

  findAllProductByCategoryAndBrand(categoryId: string, brandId: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.productByCategoryAndBrandUrl + categoryId + '/' + brandId + '/'
      + '?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  findAllProductByCategory(categoryId: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.productByCategoryUrl + categoryId + '/'
      + '?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url , httpOptions);
  }


  findAllByCategoryAndName(categoryId: string, productName: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.searchProductByCategoryName
      + '?categoryId=' + categoryId
      + '&productName=' + productName
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  findAllByCategoryAndPrice(categoryId: string, price: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.searchProductByCategoryPrice
      + '?categoryId=' + categoryId
      + '&price=' + price
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  findAllByName(productName: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.searchProductByName
      + '?productName=' + productName
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  findAllByPrice(price: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.searchProductByPrice
      + '?price=' + price
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  findAllByNameAndPrice(productName: string, price: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.searchProductUrl + productName + '/' + price + '/'
      + '?page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  // tslint:disable-next-line:max-line-length
  findAllByCategoryBrandProductName(categoryId: string, brandId: string, productName: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.searchProductByCategoryBrandName
      + '?categoryId=' + categoryId
      + '&brandId=' + brandId
      + '&productName=' + productName
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  // tslint:disable-next-line:max-line-length
  findAllByCategoryBrandPrice(categoryId: string, brandId: string, price: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.searchProductByCategoryBrandPrice
      + '?categoryId=' + categoryId
      + '&brandId=' + brandId
      + '&price=' + price
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  // tslint:disable-next-line:max-line-length
  findAllByCategoryNamePrice(categoryId: string, productName: string, price: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.searchProductByCategoryNamePrice
      + '?categoryId=' + categoryId
      + '&productName=' + productName
      + '&price=' + price
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  // tslint:disable-next-line:max-line-length
  findAllByCategoryBrandProductNamePrice(categoryId: string, brandId: string, productName: string, price: string, pageable: Pageable): Observable<Page<Product>> {
    const url = this.searchProductByCategoryBrandNamePrice
      + '?categoryId=' + categoryId
      + '&brandId=' + brandId
      + '&productName=' + productName
      + '&price=' + price
      + '&page=' + pageable.pageNumber
      + '&size=' + pageable.pageSize;
    return this.httpClient.get<Page<Product>>(url, httpOptions);
  }

  getAllProduct(): Observable<any> {

    return this.httpClient.get(this.API_URL + '/products');
  }

  getProductById(productId: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/products/' + productId);
  }

  getAllProductByCategory(categoryId: number): Observable<any> {
    return this.httpClient.get(this.API_URL + '/' + categoryId);
  }
}
