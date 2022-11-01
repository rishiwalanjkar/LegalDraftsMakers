import { Injectable } from '@angular/core';
import { SelectOption } from '../editor/tool-bar/tools/tool-bar';
import { Language } from '../language/language.service';

const KEY_BOARD_CHARACTERS  = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "q", "w", "e", 
                                "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", 
                                ",", ".", "/", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "Z", "X",
                                "C", "V", "B", "N", "M", "<", ">", "?"
                              ];

export enum FontLanguage{
  ENGLISH,
  DEVNAGARI
}

export interface Font{
  fontName:string;
  fontFamily:string;
  isConvert:boolean;
  language:FontLanguage
  keyMappings?:object;
}

@Injectable({
  providedIn: 'root'
})
export class FontService {
  get keyBoardCharacters():string[]{
    return KEY_BOARD_CHARACTERS;
  }

  constructor() { }

  convertSelection(data:any, selectionRange:Range):void{
    if(!data || !selectionRange) return;

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

  convertChar(event:KeyboardEvent, data:Range|HTMLInputElement|HTMLTextAreaElement, selectedFont:Font):void {

    if(1 < event.key.length || !this.keyBoardCharacters.includes(event.key)) return;

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
  
      if("ा" != transformedChar || !textNode!.previousSibling) return;
  
      switch(true){
        case "्" == textNode!.previousSibling!.textContent!.charAt(textNode!.previousSibling!.textContent!.length -1):
          textNode!.previousSibling!.textContent = textNode!.previousSibling!.textContent!.slice(0, (textNode!.previousSibling!.textContent!.length -1));
          textNode!.textContent = "";
          break;
  
        case "अ" == textNode!.previousSibling!.textContent:
          textNode!.previousSibling!.textContent = "आ";
          textNode!.textContent = "";
          break;
      }
  
    } else{
      data.value += transformedChar;
      data.dispatchEvent(new InputEvent("change"));
      data.dispatchEvent(new InputEvent("input"));
      
      if("ा" != transformedChar || !data.value) return;

      switch(true){
        case "्" == data.value.charAt(data.value.length - 2):
          data.value  = data.value.substring(0, data.value.length - 2);
          break;
  
        case "अ" == data.value.charAt(data.value.length - 2):
          data.value  = data.value.substring(0, data.value.length - 2) + "आ";
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
                                                "`": "्र",
                                                // "1":"१",
                                                // "2":"२",
                                                // "3":"३",
                                                // "4":"४",
                                                // "5":"५",
                                                // "6":"६",
                                                // "7":"७",
                                                // "8":"८",
                                                // "9":"९",
                                                // "0":"०",
                                                "-":"र्",
                                                "=":"ड़",
                                                "~":"त्र",
                                                "!":"ॐ",
                                                "@":"क्",
                                                "#":"ख्",
                                                "$":"रू",
                                                "%":"त्",
                                                "^":"ॅ",
                                                "&":"ज्ञ",
                                                "*":"ह्",
                                                "(":"ह्य",
                                                ")":"हृ",
                                                "_":"द्द",
                                                "+":"ट्ट",
                                                "q":"थ्",
                                                "w":"द्ध",
                                                "e":"ए",
                                                "r":"र",
                                                "t":"त",
                                                "y":"य्",
                                                "u":"ु",
                                                "i":"ि",
                                                "o":"े",
                                                "p":"प",
                                                "[":"इ",
                                                "]":"उ",
                                                "\\":"्",
                                                "a":"ा",
                                                "s":"स्",
                                                "d":"द",
                                                "f":"फ",
                                                "g":"ग्",
                                                "h":"ह",
                                                "j":"ज्",
                                                "k":"क",
                                                "l":"ल्",
                                                ";":"ॡ",
                                                "'":"\'",
                                                "z":"ठ",
                                                "x":"क्ष्",
                                                "c":"च्",
                                                "v":"व्",
                                                "b":"ब्",
                                                "n":"न्",
                                                "m":"म्",
                                                ",":",",
                                                ".":".",
                                                "/":"्र",
                                                "Q":"ध्",
                                                "W":"द्व",
                                                "E":"श्र",
                                                "R":"ृ",
                                                "T":"ट",
                                                "Y":"ष्",
                                                "U":"ू",
                                                "I":"ी",
                                                "O":"ै",
                                                "P":"प्",
                                                "{":"ठ्ठ",
                                                "}":"ऊ",
                                                "|":"",
                                                "A":"अ",
                                                "S":"श्",
                                                "D":"ड",
                                                "F":"फ्",
                                                "G":"घ्",
                                                "H":"ञ",
                                                "J":"झ्",
                                                "K":"ख",
                                                "L":"ळ",
                                                ":":":",
                                                "\"":"\"",
                                                "Z":"ढ",
                                                "X":"श्",
                                                "C":"छ",
                                                "V":"द्य",
                                                "B":"भ्",
                                                "N":"ण्",
                                                "M":"ं",
                                                "<":"त्त्",
                                                ">":"क्त",
                                                "?":"ॠ"
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

  fetchFontsByLanguage(language:Language):Font[]{
    let rawData:Font[] = [
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
                                              "`": "्र",
                                              // "1":"१",
                                              // "2":"२",
                                              // "3":"३",
                                              // "4":"४",
                                              // "5":"५",
                                              // "6":"६",
                                              // "7":"७",
                                              // "8":"८",
                                              // "9":"९",
                                              // "0":"०",
                                              "-":"र्",
                                              "=":"ड़",
                                              "~":"त्र",
                                              "!":"ॐ",
                                              "@":"क्",
                                              "#":"ख्",
                                              "$":"रू",
                                              "%":"त्",
                                              "^":"ॅ",
                                              "&":"ज्ञ",
                                              "*":"ह्",
                                              "(":"ह्य",
                                              ")":"हृ",
                                              "_":"द्द",
                                              "+":"ट्ट",
                                              "q":"थ्",
                                              "w":"द्ध",
                                              "e":"ए",
                                              "r":"र",
                                              "t":"त",
                                              "y":"य्",
                                              "u":"ु",
                                              "i":"ि",
                                              "o":"े",
                                              "p":"प",
                                              "[":"इ",
                                              "]":"उ",
                                              "\\":"्",
                                              "a":"ा",
                                              "s":"स्",
                                              "d":"द",
                                              "f":"फ",
                                              "g":"ग्",
                                              "h":"ह",
                                              "j":"ज्",
                                              "k":"क",
                                              "l":"ल्",
                                              ";":"ॡ",
                                              "'":"\'",
                                              "z":"ठ",
                                              "x":"क्ष्",
                                              "c":"च्",
                                              "v":"व्",
                                              "b":"ब्",
                                              "n":"न्",
                                              "m":"म्",
                                              ",":",",
                                              ".":".",
                                              "/":"्र",
                                              "Q":"ध्",
                                              "W":"द्व",
                                              "E":"श्र",
                                              "R":"ृ",
                                              "T":"ट",
                                              "Y":"ष्",
                                              "U":"ू",
                                              "I":"ी",
                                              "O":"ै",
                                              "P":"प्",
                                              "{":"ठ्ठ",
                                              "}":"ऊ",
                                              "|":"",
                                              "A":"अ",
                                              "S":"श्",
                                              "D":"ड",
                                              "F":"फ्",
                                              "G":"घ्",
                                              "H":"ञ",
                                              "J":"झ्",
                                              "K":"ख",
                                              "L":"ळ",
                                              ":":":",
                                              "\"":"\"",
                                              "Z":"ढ",
                                              "X":"श्",
                                              "C":"छ",
                                              "V":"द्य",
                                              "B":"भ्",
                                              "N":"ण्",
                                              "M":"ं",
                                              "<":"त्त्",
                                              ">":"क्त",
                                              "?":"ॠ"
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

    return rawData.filter((font:Font)=> Language.ENGLISH == language ? FontLanguage.ENGLISH == font.language : [Language.HINDI, Language.MARATHI].includes(language) ? FontLanguage.DEVNAGARI == font.language : false);
  }
}
