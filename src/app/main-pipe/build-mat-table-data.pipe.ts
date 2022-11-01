import { Pipe, PipeTransform } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Pipe({
  name: 'buildMatTableData'
})
export class BuildMatTableDataPipe implements PipeTransform {

  transform(data:any, ...args: unknown[]): object {
    // data = {...data, ...{
    //                     displayedColumns  : [],
    //                     dataSource        : new MatTableDataSource<any>([new Object()]),
    //                     add               : () => {
    //                                           data.dataSource.add();

    //                                           for(const col in data.dataSource.data[data.dataSource.data.length-1])
    //                                             data.dataSource.data[data.dataSource.data.length-1][col] = "";

    //                                           data.dataSource.filter = ""; //filter is set to trigger rerendering
    //                                         }, 
    //                     remove            : () => {
    //                                           data.dataSource.remove();
    //                                           data.dataSource.filter = ""; //filter is set to trigger rerendering
    //                                         },
    //                     showRemoveButton  : () => data.dataSource.showRemoveButton()
    //                   }
    //         }

    Object.getPrototypeOf(data).displayedColumns  = [];
    Object.getPrototypeOf(data).dataSource        = new MatTableDataSource<any>([new Object()]);
    Object.getPrototypeOf(data).add               = () => {
                                                      data.dataSource.add();

                                                      for(const col in data.dataSource.data[data.dataSource.data.length-1])
                                                        data.dataSource.data[data.dataSource.data.length-1][col] = "";

                                                      data.dataSource.filter = ""; //filter is set to trigger rerendering
                                                    };
    Object.getPrototypeOf(data).remove            = () => {
                                                      data.dataSource.remove();
                                                      data.dataSource.filter = ""; //filter is set to trigger rerendering
                                                    },
    Object.getPrototypeOf(data).showRemoveButton  = () => data.dataSource.showRemoveButton()
    

    if(!!data.hasHeader) {
      let parser  = new DOMParser(),
      tdElements  = parser.parseFromString(data.tableHead, "text/xml")?.getElementsByTagName("th");

      if(!!tdElements)
        for(let i = 0; i < tdElements.length; i++) {
          data.displayedColumns.push(tdElements[i].textContent as never);
          data.dataSource.data[0] = {...data.dataSource.data[0], ...{[tdElements[i].textContent as string]:""}}
        }
    } else
        for(let i = 0; i < parseInt(data.columns); i++) {
          data.displayedColumns.push("Column" + (i+1).toString() as never);
          data.dataSource.data[0] = {...data.dataSource.data[0], ...{["Column" + (i+1).toString() as string]:""}}
        }

    return data;
  }

}
