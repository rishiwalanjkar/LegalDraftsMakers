import { Injectable } from '@angular/core';
import { EditorService } from './editor.service';
import { Font, FontLanguage, SelectOption, SelectTool, Tool, ToolCommand } from './tool-bar/tools/tool-bar';

const KEY_BOARD_CHARACTERS  = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "q", "w", "e", 
                                "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", 
                                ",", ".", "/", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "Z", "X",
                                "C", "V", "B", "N", "M", "<", ">", "?"
                              ];


@Injectable({
  providedIn: 'root'
})
export class FontService {
  get keyBoardCharacters():string[]{
    return KEY_BOARD_CHARACTERS;
  }

  constructor() { }

  convertSelection(data:any, selectionRange:Range):void{
    let fontFamily:string           = data.fontFamily,
        isConvert:boolean           = !!data.isConvert,
        keyMappings:any             = data.keyMappings,
        spanFontElement:HTMLElement = document.createElement("span");

        spanFontElement.appendChild(selectionRange.cloneContents());
        let initialFontHTML:string = spanFontElement.innerHTML.toString().replace(/[<][\/]*span[\sa-zA-Z"']*[>]/g,'').replace(/&nbsp;/g, ' ');

        spanFontElement.style.fontFamily = fontFamily;

        if(isConvert){
          let transformedHTML:string  = initialFontHTML.replace(/[^<\/>]\w+/g, txt => {
                                                                txt = txt.replace(/\w/g, char => {
                                                                                  return keyMappings[char] ? keyMappings[char] : char;
                                                                                });

                                                                return txt;
                                                              });

          spanFontElement.innerHTML   = `${transformedHTML}`;
        }

        selectionRange.deleteContents();
        selectionRange.insertNode(spanFontElement);

        let range = document.createRange();
        range.setStart(spanFontElement, 0);
        range.setEnd(spanFontElement, (initialFontHTML.length));

        (window.getSelection() as Selection).removeAllRanges();
        (window.getSelection() as Selection).addRange(range);
  }

  convertChar(event:KeyboardEvent, data:Range|HTMLInputElement|HTMLTextAreaElement):void {

    if(1 < event.key.length || !this.keyBoardCharacters.includes(event.key)) return;

    let selectedFont:Font  = (Tool.tools[ToolCommand.SET_FONT] as SelectTool).selected;

    if(FontLanguage.ENGLISH == selectedFont.language) return;

    if("keyup" ==  event.type) return;

 
    let keyMappings:any   = selectedFont.keyMappings,
        transformedChar   = keyMappings[event.key],
        textNode;

    if(!transformedChar || "string" != typeof transformedChar) return;

    event.preventDefault();

    if( data instanceof Range) {
      textNode              = document.createTextNode(transformedChar);
      data.insertNode(textNode);
  
      let range = document.createRange();
      range.setStart(textNode, (transformedChar.length));
      range.setEnd(textNode, (transformedChar.length));
  
      (window.getSelection() as Selection).removeAllRanges();
      (window.getSelection() as Selection).addRange(range);
  
      if("???" != transformedChar || !textNode!.previousSibling) return;
  
      switch(true){
        case "???" == textNode!.previousSibling!.textContent!.charAt(textNode!.previousSibling!.textContent!.length -1):
          textNode!.previousSibling!.textContent = textNode!.previousSibling!.textContent!.slice(0, (textNode!.previousSibling!.textContent!.length -1));
          textNode!.textContent = "";
          break;
  
        case "???" == textNode!.previousSibling!.textContent:
          textNode!.previousSibling!.textContent = "???";
          textNode!.textContent = "";
          break;
      }
  
    } else{
      data.value += transformedChar;

      if("???" != transformedChar || !data.value) return;

      switch(true){
        case "???" == data.value.charAt(data.value.length - 2):
          data.value  = data.value.substring(0, data.value.length - 2);
          break;
  
        case "???" == data.value.charAt(data.value.length - 2):
          data.value  = data.value.substring(0, data.value.length - 2) + "???";
          break;
      }
    }
  }
  
  fetchFonts():SelectOption[]{
    let selectFontOptions:SelectOption[] = [],
        rawData:Font[] = [
                            {
                              fontName      : "Arial",
                              fontFamily    : "Arial, Helvetica, sans-serif",
                              isConvert     : false,
                              language      : FontLanguage.ENGLISH
                            },
                            {
                              fontName      : "Shivaji01",
                              fontFamily    : "'Mukta', sans-serif",
                              isConvert     : true,
                              language      : FontLanguage.DEVNAGARI,
                              keyMappings   : {
                                                "`": "??????",
                                                "1":"???",
                                                "2":"???",
                                                "3":"???",
                                                "4":"???",
                                                "5":"???",
                                                "6":"???",
                                                "7":"???",
                                                "8":"???",
                                                "9":"???",
                                                "0":"??????",
                                                "-":"??????",
                                                "=":"???",
                                                "~":"?????????",
                                                "!":"???",
                                                "@":"??????",
                                                "#":"??????",
                                                "$":"??????",
                                                "%":"??????",
                                                "^":"???",
                                                "&":"?????????",
                                                "*":"??????",
                                                "(":"?????????",
                                                ")":"??????",
                                                "_":"?????????",
                                                "+":"?????????",
                                                "q":"??????",
                                                "w":"?????????",
                                                "e":"???",
                                                "r":"???",
                                                "t":"???",
                                                "y":"??????",
                                                "u":"???",
                                                "i":"???",
                                                "o":"???",
                                                "p":"???",
                                                "[":"???",
                                                "]":"???",
                                                "\\":"???",
                                                "a":"???",
                                                "s":"??????",
                                                "d":"???",
                                                "f":"???",
                                                "g":"??????",
                                                "h":"???",
                                                "j":"??????",
                                                "k":"???",
                                                "l":"??????",
                                                ";":"???",
                                                "'":"\'",
                                                "z":"???",
                                                "x":"????????????",
                                                "c":"??????",
                                                "v":"??????",
                                                "b":"??????",
                                                "n":"??????",
                                                "m":"??????",
                                                ",":",",
                                                ".":".",
                                                "/":"??????",
                                                "Q":"??????",
                                                "W":"?????????",
                                                "E":"?????????",
                                                "R":"???",
                                                "T":"???",
                                                "Y":"??????",
                                                "U":"???",
                                                "I":"???",
                                                "O":"???",
                                                "P":"??????",
                                                "{":"?????????",
                                                "}":"???",
                                                "|":"",
                                                "A":"???",
                                                "S":"??????",
                                                "D":"???",
                                                "F":"??????",
                                                "G":"??????",
                                                "H":"???",
                                                "J":"??????",
                                                "K":"???",
                                                "L":"???",
                                                ":":":",
                                                "\"":"\"",
                                                "Z":"???",
                                                "X":"??????",
                                                "C":"???",
                                                "V":"?????????",
                                                "B":"??????",
                                                "N":"??????",
                                                "M":"???",
                                                "<":"????????????",
                                                ">":"?????????",
                                                "?":"???"
                                              }              
                            },
                            {
                              fontName      : "Kruti 10",
                              fontFamily    : "'Mukta', sans-serif",
                              isConvert     : true,
                              language      : FontLanguage.DEVNAGARI,
                              keyMappings   : {
                                                "`":"",
                                                "~":"",
                                                "!":"",
                                                "@":"",
                                                "#":"",
                                                "$":"",
                                                "%":"",
                                                "^":"",
                                                "&":"",
                                                "*":"",
                                                "(":"",
                                                ")":"",
                                                "_":"",
                                                "+":"",
                                                "q":"",
                                                "w":"",
                                                "e":"",
                                                "r":"",
                                                "t":"",
                                                "y":"",
                                                "u":"",
                                                "i":"",
                                                "o":"",
                                                "p":"",
                                                "[":"",
                                                "]":"",
                                                "\\":"",
                                                "a":"",
                                                "s":"",
                                                "d":"",
                                                "f":"",
                                                "g":"",
                                                "h":"",
                                                "j":"",
                                                "k":"",
                                                "l":"",
                                                ";":"",
                                                "'":"",
                                                "z":"",
                                                "x":"",
                                                "c":"",
                                                "v":"",
                                                "b":"",
                                                "n":"",
                                                "m":"",
                                                ",":"",
                                                ".":"",
                                                "/":"",
                                                "Q":"",
                                                "W":"",
                                                "E":"",
                                                "R":"",
                                                "T":"",
                                                "Y":"",
                                                "U":"",
                                                "I":"",
                                                "O":"",
                                                "P":"",
                                                "{":"",
                                                "}":"",
                                                "|":"",
                                                "A":"",
                                                "S":"",
                                                "D":"",
                                                "F":"",
                                                "G":"",
                                                "H":"",
                                                "J":"",
                                                "K":"",
                                                "L":"",
                                                ":":"",
                                                "\"":"",
                                                "Z":"",
                                                "X":"",
                                                "C":"",
                                                "V":"",
                                                "B":"",
                                                "N":"",
                                                "M":"",
                                                "<":"",
                                                ">":"",
                                                "?":""
                                              }
                            }                      
                          ];
    
    for(let data of rawData){
      selectFontOptions.push(new SelectOption(data.fontName, data));
    }

    return selectFontOptions;
  }
}
