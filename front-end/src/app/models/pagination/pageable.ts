import {Sort} from './sort';

export class Pageable {
  public constructor() {
    this.pageSize = Pageable.DEFAULT_PAGE_SIZE;
    this.pageNumber = Pageable.FIRST_PAGE_NUMBER;
  }

  static readonly DEFAULT_PAGE_SIZE = 5;
  static readonly FIRST_PAGE_NUMBER = 0;

  sort: Sort;
  pageSize: number;
  pageNumber: number;
  offset: number;
  unPaged: boolean;
  paged: boolean;
}
