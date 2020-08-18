import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMultiple'
})
export class FilterMultiplePipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
