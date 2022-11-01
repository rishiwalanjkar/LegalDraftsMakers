import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indexOf'
})
export class IndexOfPipe implements PipeTransform {

  transform(value: Array<any>|string, searchElement: any|string): number {
    return value.indexOf(searchElement);
  }

}
