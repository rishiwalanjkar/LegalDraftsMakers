import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParsorService {

  constructor() { }

  reformatHTMLString(htmlString:string):string{
    let htmlStartTagPool:string[] = [], 
        htmlEndTagPool:string[]   = [];

        htmlString.replace(/<[^<][\s\w"'-=;:]*>/g, (str:string) => {
                                                                      if(/<\/\w/g.test(str)){
                                                                        htmlEndTagPool.push(str);
                                                                        let tagNames = /\w/g.exec(str);
                                                                        
                                                                        for(let i = 0; i < htmlStartTagPool.length; i++) {
                                                                          let startTag = /\w/g.exec(htmlStartTagPool[i]);

                                                                          if(tagNames![0] == startTag![0]) {
                                                                            htmlStartTagPool.splice(i, 1);
                                                                            htmlEndTagPool.pop();
                                                                          }
                                                                        }
                                                                      }

                                                                      if(/^<\w/g.test(str)) 
                                                                        htmlStartTagPool.push(str)

                                                                      return  str;
                                                                  });

        for(const htmlEndTag of htmlEndTagPool)
          htmlString = htmlString.replace(htmlEndTag, "");

        for(const htmlStartTag of htmlStartTagPool)
          htmlString = htmlString.replace(htmlStartTag, "");

        return htmlEndTagPool.join() + htmlString + htmlStartTagPool.join();
  }
}
