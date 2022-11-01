import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enableAddRemove'
})
export class EnableAddRemovePipe implements PipeTransform {

  transform(dataSource: any, ...args: unknown[]): any {
    if(!dataSource.data)
      Object.getPrototypeOf(dataSource).data = new Array(1).fill("");

    Object.getPrototypeOf(dataSource).add               = () => {
                                                            let defaultValue  = ("object" == typeof dataSource.data[0]) 
                                                              ? Object.create(Object.getPrototypeOf(dataSource.data[0]), Object.getOwnPropertyDescriptors(dataSource.data[0])) 
                                                                : dataSource.data[0];

                                                            dataSource.data.push(defaultValue)
                                                          };
    Object.getPrototypeOf(dataSource).remove            = () => (1 < dataSource.data.length) ? dataSource.data.pop() : false;
    Object.getPrototypeOf(dataSource).showRemoveButton  = () => 1 < dataSource.data.length;

    return dataSource;
  }
}
