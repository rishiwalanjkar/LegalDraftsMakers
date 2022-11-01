import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'jsonParse'
})
export class JsonParsePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): any {
    return (!!value) ? JSON.parse(value.replace(/'/g, `"`)) : !!value;
  }

}
