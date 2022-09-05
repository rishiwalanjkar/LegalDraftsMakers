import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatHtmlSpace'
})
export class FormatHtmlSpacePipe implements PipeTransform {

  transform(html:string): string {
    return html.replace(/\s/g, "&nbsp;");
  }

}
