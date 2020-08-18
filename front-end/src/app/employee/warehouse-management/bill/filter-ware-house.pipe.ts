import {Pipe, PipeTransform} from '@angular/core';
import {WareHouse} from '../../../models/ware-house';

@Pipe({
  name: 'filterWareHouse'
})
export class FilterWareHousePipe implements PipeTransform {
  transform(wareHouses: WareHouse[], value: string): any[] {
    if (!wareHouses) {
      return [];
    }
    if (!value) {
      return wareHouses;
    }

    return wareHouses.filter(singleItem =>
      singleItem.nameWareHouse.toLowerCase().includes(value.toLowerCase())
    );

  }
}
