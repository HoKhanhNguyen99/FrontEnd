import {TypeBill} from './type-bill';
import {StorageLocation} from './storage-location';
import {WareHouse} from './ware-house';
import {Transportation} from './transportation';
import {Pay} from './pay';
import {Distributor} from './distributor';
import {Employee} from '../employee/employee';

export class Bill {
  id: number;
  billName: string;
  createDate: Date;
  editLatestDate: Date;
  billStatus: string;
  processingStatus: string;
  shippingStatus: string;
  paymentStatus: string;
  idTypeBill: string;
  idStorageLocation: string;
  idWareHouse: string;
  idTransportation: string;
  idPay: string;
  idDistributor: string;
  idEmployee: string;
  deleteFlag: boolean;

  constructor() {
  }
}
