import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterProduct'
})
export class FilterProductPipe implements PipeTransform {

  // transform(items: any[], value: string): any[] {
  //   if (!items) { return []; }
  //   if (!value) { return items; }
  //
  //   return items.filter(singleItem =>
  //     singleItem.productName.toLowerCase().includes(value.toLowerCase())
  //   );
  //
  // }

  transform(value: any[], searchString: string ): any[]{

    if (!searchString){
      return value;
    }

    return value.filter(it => {
      const productName = it.productName.toLowerCase().includes(searchString);
      const price = it.price.toString().includes(searchString.toLowerCase());
      return (productName + price);
    });
  }

}
