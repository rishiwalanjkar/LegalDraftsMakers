import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Page } from './page/page/page';
import { PageComponent } from './page/page/page.component';
import { Conversion, Font, FontLanguage, ImageDisplayType, PageOrientation, SelectOption, SelectTool, Tool, ToolCommand, WordCase } from './tool-bar/tools/tool-bar';

const KEY_BOARD_CHARACTERS  = ["`", "~", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_", "+", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "q", "w", "e", 
                                "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", 
                                ",", ".", "/", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "{", "}", "|", "A", "S", "D", "F", "G", "H", "J", "K", "L", ":", "\"", "Z", "X",
                                "C", "V", "B", "N", "M", "<", ">", "?"
                              ];

@Injectable({
  providedIn: 'root'
})
export class EditorService {
  private deletePageSubject         = new Subject<number>();
  private addPageSubject            = new Subject<Page>();
  private pageSizeSubject           = new Subject<number[]>();
  private pageMarginSubject         = new Subject<any>();
  private triggerToolSubject        = new Subject<ToolCommand>();
  private emitPageChangeSubject     = new Subject<HTMLDivElement>();
  private pageSelection!:Selection;
  private pageSelectionRange!:Range;

  constructor() { }

  get keyBoardCharacters():string[]{
    return KEY_BOARD_CHARACTERS;
  }

  triggerCommand(_command:ToolCommand, data:any):void{
    let selectedElement:any = this.pageSelectionRange?.commonAncestorContainer;

    switch(_command){
      case ToolCommand.UNDO:
        document.execCommand("undo");
        break;

      case ToolCommand.REDO:
        document.execCommand("redo");
        break;

      case ToolCommand.FIND:
        if(!data.searchText.trim())
          break;

        if(data.searchText.trim()!=data.previousSearchText.trim()) {
          let existingMarkers = Array.prototype.slice.call(document.getElementsByTagName("mark-found-start")).concat(Array.prototype.slice.call(document.getElementsByTagName("mark-found-end")));
      
          for(const element of existingMarkers)
            element.remove();  
        }

          let pageElement!:HTMLElement,
            pageIndex = 0;

        for(pageIndex; pageIndex<PageComponent.instanceCounter;pageIndex++){
          pageElement =  document.getElementById(`app-page-${pageIndex}`) as HTMLElement;

          if(!pageElement) continue;

          let transformedHTML = pageElement.innerHTML.replace(new RegExp( "(?<!<[^>]*)(?!<mark-found-start><\/mark-found-start>)" + data.searchText.trim() + "(?!<mark-found-end><\/mark-found-end>)", ''), (txt)=> `<mark-found-start></mark-found-start>${txt}<mark-found-end></mark-found-end>`);

          if( pageElement.innerHTML != transformedHTML ) {
            pageElement.innerHTML = transformedHTML;
            break;
          }
        }

        setTimeout(() => {
          if(document.getElementsByTagName("mark-found-start").length > 0
              || document.getElementsByTagName("mark-found-end").length > 0) {
            let range = document.createRange();
            range.setStart(document.getElementsByTagName("mark-found-start")[document.getElementsByTagName("mark-found-start").length-1], 0);
            range.setEnd(document.getElementsByTagName("mark-found-end")[document.getElementsByTagName("mark-found-end").length-1], 0);
            this.pageSelection.removeAllRanges()
            this.pageSelection.addRange(range);

            let bodyRect          = document.body.getBoundingClientRect(),
                elementRect       = document.getElementsByTagName("mark-found-start")[document.getElementsByTagName("mark-found-start").length-1].getBoundingClientRect(),
                verticalOffset    = elementRect.top - bodyRect.top - document.getElementsByTagName("app-tool-bar")[0].clientHeight * 2 - document.getElementsByTagName("mat-toolbar")[0].clientHeight,
                horizontalOffset  = elementRect.left;

            setTimeout(()=>{window.scrollTo(horizontalOffset, verticalOffset);}, 100);
          }
        }, 1);
        

        break;

      case ToolCommand.FIND_AND_REPLACE:
        if(!data.searchText.trim() && !data.replaceText.trim())
          break;

          for(let pageIndex=0; pageIndex<PageComponent.instanceCounter;pageIndex++){
            let pageElement =  document.getElementById(`app-page-${pageIndex}`) as HTMLElement;
  
            if(!pageElement) continue;
  
            let transformedHTML = pageElement.innerHTML.replace(new RegExp( "(?<!<[^>]*)" + data.searchText, 'g'), data.replaceText);

            if( pageElement.innerHTML != transformedHTML ) 
              pageElement.innerHTML = transformedHTML;
          }
        break;

      case ToolCommand.PRINT:
        let newWindow                               = window.open(),
            printPageStyleElement:HTMLStyleElement  = document.createElement("style");

            printPageStyleElement.innerHTML         = `
                                                      body{
                                                        display:flex;
                                                        flex-direction:column;
                                                        justify-content:center;
                                                        margin:0px;
                                                        padding:0px;
                                                      }

                                                      @media print{
                                                        @page { 
                                                            size: auto;  
                                                            margin: 0mm; 
                                                        }
                                                      }
                                                    `;

        newWindow!.document.body.appendChild(printPageStyleElement);

        for(let pageIndex=0; pageIndex<PageComponent.instanceCounter;pageIndex++){
          let clone:HTMLElement = document.getElementById(`app-page-${pageIndex}`)?.cloneNode(true) as HTMLElement;

          (clone.children[1].children[0] as HTMLDivElement).contentEditable = "false";
          (clone.children[1].children[1] as HTMLDivElement).contentEditable = "false";
          (clone.children[1].children[2] as HTMLDivElement).contentEditable = "false";
          clone.style.display = "grid";

          newWindow?.document.body.appendChild(clone);
        } 

        newWindow?.print();
        newWindow?.close();

        break;

      case ToolCommand.SAVE:

        break;

      case ToolCommand.SET_FONT:
        let fontName:string             = data.fontName,
            fontFamily:string           = data.fontFamily,
            isConvert:boolean           = !!data.isConvert,
            keyMappings:any             = data.keyMappings,
            spanFontElement:HTMLElement = document.createElement("span");

            spanFontElement.appendChild(this.pageSelectionRange.cloneContents());
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

            this.pageSelectionRange.deleteContents();
            this.pageSelectionRange.insertNode(spanFontElement);

            let range = document.createRange();
            range.setStart(spanFontElement, 0);
            range.setEnd(spanFontElement, (initialFontHTML.length));

            (window.getSelection() as Selection).removeAllRanges();
            (window.getSelection() as Selection).addRange(range);

        break;

      case ToolCommand.SET_FONT_SIZE:
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(this.pageSelectionRange);
        document.execCommand("fontSize", true, data);

        if("FONT" != selectedElement.tagName) 
          selectedElement = window.getSelection()?.getRangeAt(0).commonAncestorContainer.parentElement;

        if("FONT" == selectedElement.tagName)
          selectedElement.style.fontSize = data + "pt";

        break;

      case ToolCommand.CHANGE_CASE:
        let startsWithPartialWord = false/*0 < this.pageSelectionRange.startOffset*/,
            callCounter           = 0,
            spanElement           = document.createElement("span");

        spanElement.appendChild(this.pageSelectionRange.cloneContents());
        let initialHTML           = spanElement.innerHTML.toString().replace(/[<][\/]*span[>]/g,'').replace(/&nbsp;/g, ' '),
            transformedHTML!:string;

        switch(parseInt(data)){
          case WordCase.SENTENCE_CASE:
            transformedHTML = initialHTML.replace(/.*[.!?]+/g, 
                                                    function(txt:string) {
                                                      let isStartWithTag      = txt.search(/^[<]\w+\s*\w*[>]/g),
                                                          firstLetterPosition = txt.search(/[>]/g) + 1;
                                            
                                                      return (0 == callCounter++ && startsWithPartialWord) 
                                                              ? txt 
                                                                : -1 != isStartWithTag 
                                                                  ? txt.substr(0, firstLetterPosition + 1) + txt.charAt(firstLetterPosition).toUpperCase() + txt.substr(firstLetterPosition+1).toLowerCase()
                                                                    : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                                    }
                                                  );
            break;
                                                        
          case WordCase.LOWERCASE:
            transformedHTML = initialHTML.replace(/(?<!<[^>]*)\w*/g, 
                                                    function(txt:string) {
                                                      return txt.toLowerCase();
                                                    }
                                                  );
            break;
                                                          
          case WordCase.UPPERCASE:
            transformedHTML = initialHTML.replace(/(?<!<[^>]*)\w*/g, 
                                                    function(txt:string) {
                                                      return txt.toUpperCase();
                                                    }
                                                  );
            break;
                                                        
          case WordCase.CAPITALIZE_EACH_WORD:
            transformedHTML = initialHTML.replace(/(?<!<[^>]*)\w*/g, 
                                                    function(txt:string) {
                                                
                                                      return (0 == callCounter++ && startsWithPartialWord) 
                                                              ? txt 
                                                                : txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                                                    }
                                                  );
            break;
                                                        
          case WordCase.TOGGLE_CASE:
            transformedHTML = initialHTML.replace(/(?<!<[^>]*)\w*/g, 
                                                    function(txt:string) {
                                                
                                                      return (0 == callCounter++ && startsWithPartialWord) 
                                                              ? txt 
                                                                : txt.charAt(0).toLowerCase() + txt.substr(1).toUpperCase();
                                                    }
                                                  );
            break;
        }

        if( transformedHTML !== initialHTML){
          spanElement.innerHTML = `${transformedHTML}`;
          this.pageSelectionRange.deleteContents();
          this.pageSelectionRange.insertNode(spanElement);
        } 
        break;

      case ToolCommand.FORECOLOR:
        document.execCommand("forecolor", false, data);
        break;

      case ToolCommand.BOLD:
        document.execCommand("bold");
        break;

      case ToolCommand.ITALIC:
        document.execCommand("italic");
        break;

      case ToolCommand.UNDERLINE:
        document.execCommand("underline");

        if(!!selectedElement.focus)
          selectedElement?.focus();

        if("U" != selectedElement.tagName)
          selectedElement = window.getSelection()?.getRangeAt(0).commonAncestorContainer.parentElement;

        if("U" == selectedElement.tagName)
          selectedElement.style.textDecorationStyle = data;
        break;

      case ToolCommand.SUPERSCRIPT:
        document.execCommand("superscript");
        break;

      case ToolCommand.SUBSCRIPT:
        document.execCommand("subscript");
        break;

      case ToolCommand.HIGHLIGHT:
        document.execCommand("backcolor", false, data);
        break;

      case ToolCommand.JUSTIFY_LEFT:
        document.execCommand("justifyLeft");
        break;

      case ToolCommand.JUSTIFY_CENTER:
        document.execCommand("justifyCenter");
        break;

      case ToolCommand.JUSTIFY_RIGHT:
        document.execCommand("justifyRight");
        break;

      case ToolCommand.JUSTIFY_ALL:
        document.execCommand("justifyFull");
        break;

      case ToolCommand.INDENT:
        document.execCommand("indent");
        break;

      case ToolCommand.OUTDENT:
        document.execCommand("outdent");
        break;

      case ToolCommand.BULLETED_LIST:
        document.execCommand("insertUnorderedList");

        if("UL" != selectedElement.tagName)
          selectedElement = window.getSelection()?.getRangeAt(0).commonAncestorContainer.parentElement;

        if("UL" == selectedElement.tagName)
          selectedElement.type = data;

        setTimeout(()=> this.updatePagesView(0, JSON.parse((Tool.tools[ToolCommand.PAGE_SIZE] as SelectTool).selected)[1]) , 1);
        break;

      case ToolCommand.NUMBERED_LIST:
        document.execCommand("insertOrderedList");

        if("OL" != selectedElement.tagName)
          selectedElement = window.getSelection()?.getRangeAt(0).commonAncestorContainer.parentElement;

        if("OL" == selectedElement.tagName)
          selectedElement.type = data;

        setTimeout(()=> this.updatePagesView(0, JSON.parse((Tool.tools[ToolCommand.PAGE_SIZE] as SelectTool).selected)[1]) , 1);
        break;

      case ToolCommand.INSERT_TABLE:
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(this.pageSelectionRange);

        let tableHTML       = `<table class="${data.hasAutoSerialize ? 'auto-serialize':''} border break-all" width="100%">`;

        for(let rowNumber = 0; rowNumber< data.rows; rowNumber++) {
          tableHTML += (data.hasHeader && 0 == rowNumber) 
                        ? '<thead>' 
                        : ``;

          tableHTML += ((!data.hasHeader && 0 == rowNumber) || (data.hasHeader && 1 == rowNumber)) 
                        ? '<tbody>' 
                        : ``;

          tableHTML += `<tr height="${data.rowHeight}px">`
          for(let columnNumber = 0; columnNumber< data.columns; columnNumber++){

            tableHTML += (0 == rowNumber && data.hasHeader) ? `<th >${!!data.headerLabels[columnNumber] 
                          ? data.headerLabels[columnNumber]: '&nbsp;'}</th>` 
                          : `<td contentEditable="${data.hasAutoSerialize && 0 == columnNumber ? false:true}">&nbsp;</td>`;
          }
          tableHTML += `</tr>`

          tableHTML += (data.hasHeader && 0 == rowNumber) 
                        ? '</thead>' 
                        : ``;

          tableHTML += (data.rows - 1 == rowNumber)  
                        ? '</tbody>' 
                        : ``;
        }

        tableHTML += `</table>`;

        document.execCommand("insertHTML", true, tableHTML);

        setTimeout(()=> this.updatePagesView(0, JSON.parse((Tool.tools[ToolCommand.PAGE_SIZE] as SelectTool).selected)[1]) , 1);
        break;

      case ToolCommand.MERGE_CELLS:
        let anchorTdElement:any         = this.pageSelection.anchorNode,
            focusTdElement:any          = this.pageSelection.focusNode,
            anchorParentTrElement:any,
            focusParentTrElement:any,
            anchorCellIndex:number,
            anchorRowIndex:number,
            focusCellIndex:number,
            focusRowIndex:number,
            existingColSpans:number     = 0;

        while(!["TD", "TH"].includes(anchorTdElement.nodeName) && !anchorTdElement?.classList?.contains("body")
              && !["TD", "TH"].includes(focusTdElement.nodeName) && !focusTdElement?.classList?.contains("body")) {
          anchorTdElement = anchorTdElement.parentElement;
          focusTdElement  = focusTdElement.parentElement;
        }

        if(!["TD", "TH"].includes(anchorTdElement.nodeName) && !["TD", "TH"].includes(focusTdElement.nodeName)) return;

        anchorParentTrElement = anchorTdElement.parentElement;
        focusParentTrElement  = focusTdElement.parentElement;

        anchorCellIndex       = anchorTdElement.cellIndex;
        anchorRowIndex        = anchorParentTrElement.rowIndex;
        focusCellIndex        = focusTdElement.cellIndex;
        focusRowIndex         = focusParentTrElement.rowIndex;

        if(anchorRowIndex != focusRowIndex) return;

        for(let i = Math.min(anchorCellIndex, focusCellIndex); i < Math.max(anchorCellIndex, focusCellIndex); i++) {
          focusParentTrElement.children[Math.min(anchorCellIndex, focusCellIndex)].innerHTML += focusParentTrElement.children[Math.min(anchorCellIndex, focusCellIndex) + 1].innerHTML;
          existingColSpans += !!focusParentTrElement.children[Math.min(anchorCellIndex, focusCellIndex) + 1].colSpan ? focusParentTrElement.children[Math.min(anchorCellIndex, focusCellIndex) + 1].colSpan : 0;
          focusParentTrElement.deleteCell(Math.min(anchorCellIndex, focusCellIndex) + 1);
        }

        focusParentTrElement.children[Math.min(anchorCellIndex, focusCellIndex)].colSpan = focusParentTrElement.children[Math.min(anchorCellIndex, focusCellIndex)].colSpan + existingColSpans;
        break;

      case ToolCommand.SPLIT_CELL:
        let cellTdElement     = selectedElement,
            columns           = Math.abs(data.columns),
            rows              = Math.abs(data.rows);

        while(!["TD", "TH"].includes(cellTdElement.nodeName) && !cellTdElement?.classList?.contains("body"))
          cellTdElement   = cellTdElement.parentElement;

        if(!["TD", "TH"].includes(cellTdElement.nodeName)) return;

        let cellParentTableElement  = cellTdElement.parentElement.parentElement.parentElement,
            totalExistingColumns    = cellParentTableElement.firstChild.firstChild.children.length,
            cellParentTrElement     = cellTdElement.parentElement,
            cellIndex               = cellTdElement.cellIndex,
            rowIndex                = cellParentTrElement.rowIndex;

        if(1 < columns)
          for(let j = 0; j < cellParentTableElement.children.length; j++)
              for(let k = 0; k < cellParentTableElement.children[j].children.length; k++)
                if( cellParentTableElement.children[j].children[k] == cellParentTrElement)
                  for(let i = 0; i < columns - 1 ; i++)
                    if("THEAD" == cellParentTableElement.children[j].nodeName) 
                      cellParentTableElement.children[j].children[k].insertCell(cellIndex).outerHTML = `<th></th>`;
                    else
                      cellParentTableElement.children[j].children[k].insertCell(cellIndex);
                else
                  cellParentTableElement.children[j].children[k].children[cellIndex].colSpan = columns;

        if(1 < rows) {
          for(let i = 0; i < cellParentTrElement.children.length; i++) {
            if( cellIndex <= i && i < (cellIndex + columns)) continue;

            cellParentTrElement.children[i].rowSpan = rows
          }

          for(let i = 0; i < rows - 1; i++) {
            let newRow = cellParentTrElement.parentElement.insertRow(rowIndex);
            newRow.classList.add("split");

            for(let j = 0; j < columns; j++) 
              newRow.insertCell(0).innerHTML = "&nbsp;";
          }
        }

        
        break;

      case ToolCommand.INSERT_COLUMNS_AND_ROWS:
        let insertColumnsToLeft:number  = Math.abs(data.insertColumnsToLeft),
            insertColumnsToRight:number = Math.abs(data.insertColumnsToRight),
            insertRowsAbove:number      = Math.abs(data.insertRowsAbove),
            insertRowsBelow:number      = Math.abs(data.insertRowsBelow),
            isAutoSerializable:boolean,
            tableElement,
            trElement,
            tdElement,
            totalColumns,
            insertColumns               = (columnsCount:number, tableElement:any, inertCellIndex:number)=>{
                                            if(0 < columnsCount)
                                              for(let i = 0; i < columnsCount; i++) 
                                                for(let j = 0; j < tableElement.children.length; j++)
                                                  if("THEAD" == tableElement.children[j].nodeName) 
                                                    tableElement.children[j].firstChild.insertCell(inertCellIndex).outerHTML = `<th></th>`;
                                                  else
                                                    for(let k = 0; k < tableElement.children[j].children.length; k++)
                                                      tableElement.children[j].children[k].insertCell(inertCellIndex);
                                        },
            insertRows                  = (rowsCount:number, totalColumns:number, tableElement:any, inertRowIndex:number)=>{
                                            if(0 < rowsCount)
                                              for(let i = 0; i < rowsCount; i++) {
                                                let newRow = tableElement.lastChild.insertRow(inertRowIndex);

                                                for(let j = 0; j < (totalColumns + insertColumnsToLeft + insertColumnsToRight); j++)
                                                  newRow.insertCell(j).innerHTML = "&nbsp;";
                                              }
                                        }

        switch(selectedElement.nodeName) {
          case "TABLE":
          case "TBODY":
          case "THEAD":
            tableElement        = ("TABLE" == selectedElement.nodeName) ? selectedElement : selectedElement.parentElement;
            totalColumns        = tableElement.firstChild.firstChild.children.length;
            isAutoSerializable  = tableElement.classList.contains("auto-serialize");

            insertColumns(insertColumnsToLeft, tableElement, isAutoSerializable ? 1 : 0);
            insertColumns(insertColumnsToRight, tableElement, tableElement.firstChild.firstChild.children.length);
            insertRows(insertRowsAbove, totalColumns, tableElement, 0);
            insertRows(insertRowsBelow, totalColumns, tableElement, tableElement.lastChild.children.length);
            break;

          case "TR":
              tableElement        = selectedElement.parentElement.parentElement;
              trElement           = selectedElement;
              totalColumns        = trElement.children.length;
              isAutoSerializable  = tableElement.classList.contains("auto-serialize");

              insertColumns(insertColumnsToLeft, tableElement, isAutoSerializable ? 1 : 0);
              insertColumns(insertColumnsToRight, tableElement, tableElement.firstChild.firstChild.children.length);

              if("TBODY" == tableElement.lastChild.nodeName)
                insertRows(insertRowsAbove, totalColumns, tableElement, ("THEAD" == tableElement.firstChild.nodeName) ? trElement.rowIndex - 1 : trElement.rowIndex);

              insertRows(insertRowsBelow, totalColumns, tableElement, ("THEAD" == tableElement.firstChild.nodeName) ? trElement.rowIndex : trElement.rowIndex + 1);
            break;

          default:
            tdElement     = selectedElement;

            while(!["TD", "TH"].includes(tdElement.nodeName) && !tdElement?.classList?.contains("body"))
              tdElement   = tdElement.parentElement;

            if(!["TD", "TH"].includes(tdElement.nodeName)) return;

            tableElement  = tdElement.parentElement.parentElement.parentElement;
            trElement     = tdElement.parentElement;
            totalColumns  = trElement.children.length;

            insertColumns(insertColumnsToLeft, tableElement, tdElement.cellIndex);
            insertColumns(insertColumnsToRight, tableElement, tdElement.cellIndex + 1);
            insertRows(insertRowsAbove, totalColumns, tableElement, ("THEAD" == tableElement.firstChild.nodeName) ? (trElement.rowIndex -1) : trElement.rowIndex);
            insertRows(insertRowsBelow, totalColumns, tableElement, ("THEAD" == tableElement.firstChild.nodeName) ? trElement.rowIndex : trElement.rowIndex + 1);
        }

        break;

      case ToolCommand.DELETE_COLUMNS_AND_ROWS:
        let selectionStartTdElement:any             = this.pageSelection.anchorNode,
            selectionEndTdElement:any               = this.pageSelection.focusNode,
            selectionStartParentTrElement:any,
            selectionEndParentTrElement:any,
            selectionParentTableElement:any,
            selectionParentTableColumnsCount:number,
            selectionStartCellIndex:number,
            selectionStartRowIndex:number,
            selectionEndCellIndex:number,
            selectionEndRowIndex:number,
            tableHeaderRowsCount:number,
            hasDeletionIncludesHeaderRows:boolean,
            hasDeletionIncludesBodyRows:boolean,
            isDeleteRows:boolean                    = !!data.deleteRows,
            isDeleteColumns:boolean                 = !!data.deleteColumns,
            isDeleteTable:boolean                   = !!data.deleteTable;

        while(!["TD", "TH"].includes(selectionStartTdElement.nodeName) && !selectionStartTdElement?.classList?.contains("body")
              && !["TD", "TH"].includes(selectionEndTdElement.nodeName) && !selectionEndTdElement?.classList?.contains("body")) {
          selectionStartTdElement = selectionStartTdElement.parentElement;
          selectionEndTdElement   = selectionEndTdElement.parentElement;
        }

        if(!["TD", "TH"].includes(selectionStartTdElement.nodeName) && !["TD", "TH"].includes(selectionEndTdElement.nodeName)) return;

        selectionStartParentTrElement     = selectionStartTdElement.parentElement;
        selectionEndParentTrElement       = selectionEndTdElement.parentElement;
        selectionParentTableElement       = selectionStartTdElement.parentElement.parentElement.parentElement;

        selectionParentTableColumnsCount  = selectionParentTableElement.firstChild.firstChild.children.lenght;
        selectionStartCellIndex           = selectionStartTdElement.cellIndex;
        selectionStartRowIndex            = selectionStartParentTrElement.rowIndex;
        selectionEndCellIndex             = selectionEndTdElement.cellIndex;
        selectionEndRowIndex              = selectionEndParentTrElement.rowIndex;

        if(( selectionStartRowIndex != selectionEndRowIndex || Math.abs(selectionEndCellIndex - selectionEndCellIndex) - 1 == selectionParentTableColumnsCount ) && isDeleteColumns) 
          isDeleteTable = true;

        if(isDeleteTable) {
          selectionParentTableElement.remove();
          return;
        }

        if(isDeleteRows){
          tableHeaderRowsCount          = selectionParentTableElement.firstChild.children.length;
          hasDeletionIncludesHeaderRows = Math.min(selectionStartRowIndex, selectionEndRowIndex) < tableHeaderRowsCount;
          hasDeletionIncludesBodyRows   = Math.max(selectionStartRowIndex, selectionEndRowIndex) >= tableHeaderRowsCount;

          if(hasDeletionIncludesHeaderRows)
            for(let i = Math.min(selectionStartRowIndex, selectionEndRowIndex); i < tableHeaderRowsCount; i++)
              selectionParentTableElement.firstChild.deleteRow(Math.min(selectionStartRowIndex, selectionEndRowIndex));

          if(hasDeletionIncludesBodyRows)
            for(let i = hasDeletionIncludesHeaderRows ? 0 : Math.min(selectionStartRowIndex, selectionEndRowIndex) - tableHeaderRowsCount; i <= Math.max(selectionStartRowIndex, selectionEndRowIndex) - tableHeaderRowsCount; i++)
              selectionParentTableElement.lastChild.deleteRow(hasDeletionIncludesHeaderRows ? 0 : Math.min(selectionStartRowIndex, selectionEndRowIndex) - tableHeaderRowsCount);
        }

        if(isDeleteColumns)
          for(let i = 0; i < selectionParentTableElement.children.length; i++)
            for(let j = 0; j < selectionParentTableElement.children[i].children.length; j++){
              let cellToStartWith = 0,
                  totalColSpan    = 0;

              for(cellToStartWith = 0; cellToStartWith < selectionParentTableElement.children[i].children[j].children.length; cellToStartWith++) {
                totalColSpan += parseInt(selectionParentTableElement.children[i].children[j].children[cellToStartWith].colSpan);
                
                if(Math.min(selectionStartCellIndex, selectionEndCellIndex) < totalColSpan) break;
              }

              for(let k = 0; k <= Math.abs(selectionStartCellIndex - selectionEndCellIndex); k++)
                1 < selectionParentTableElement.children[i].children[j].children[cellToStartWith].colSpan 
                  ? selectionParentTableElement.children[i].children[j].children[cellToStartWith].colSpan = parseInt(selectionParentTableElement.children[i].children[j].children[cellToStartWith].colSpan) - 1
                    : selectionParentTableElement.children[i].children[j].deleteCell(cellToStartWith);
            }
        
        break;

      case ToolCommand.INSERT_SYMBOL:
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(this.pageSelectionRange);

        document.execCommand("insertHTML", true, data.selected);

        setTimeout(()=> this.updatePagesView(0, JSON.parse((Tool.tools[ToolCommand.PAGE_SIZE] as SelectTool).selected)[1]) , 1);
        break;

      case ToolCommand.INSERT_IMAGE:
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(this.pageSelectionRange);

        switch(data.displayType as ImageDisplayType){
          case ImageDisplayType.BLOCK:
            data.imageHTML.contentEditable = false;
            data.imageHTML.style.display = "block";
            data.imageHTML.style.position = "relative";
            document.execCommand("insertHTML", true, data.imageHTML.outerHTML);

            setTimeout(()=> this.updatePagesView(0, JSON.parse((Tool.tools[ToolCommand.PAGE_SIZE] as SelectTool).selected)[1]) , 1);
            
            break;
          case ImageDisplayType.BACKGROUNG:
            let pageNumber:number = data.pageNumber,
                pageElement       = document.getElementById("app-page-" + (pageNumber -1));

            pageElement!.style.backgroundImage = data.imageHTML.style.backgroundImage;
        }

        break;

      case ToolCommand.PAGE_SIZE:
        switch(parseInt((Tool.tools[ToolCommand.PAGE_ORIENTATION] as SelectTool).selected)){
          case PageOrientation.PORTRAIT:
            this.changePageSize(JSON.parse(data));
            break;
          case PageOrientation.LANDSCAPE:
            this.changePageSize(JSON.parse(data).reverse());
        }
        break;
        
      case ToolCommand.PAGE_ORIENTATION:
        let existingSize:number[]  = JSON.parse((Tool.tools[ToolCommand.PAGE_SIZE] as SelectTool).selected),
            newPageSize!:number[];

        switch(parseInt(data)){
          case PageOrientation.PORTRAIT:
            newPageSize = [Math.min.apply(Math, existingSize), Math.max.apply(Math, existingSize)];
            break;
          case PageOrientation.LANDSCAPE:
            newPageSize = [Math.max.apply(Math, existingSize), Math.min.apply(Math, existingSize)];
            break;
        }

        this.changePageSize(newPageSize);
        break;

      case ToolCommand.PAGE_MARGINS:
        this.changePageMargin(data);
        break;

      case ToolCommand.PAGE_NUMBER:
        Page.setShowPageNumber(data.show, data.pageNumberType);
        Page.setPageNumberAlignment(data.pageNumberAlignment);
        break;
    }

    if(!!selectedElement?.focus)
      selectedElement?.focus();
  }

  updateToolView():void{
    this.pageSelectionRange = window.getSelection()!.getRangeAt(0);
    let parentElement       = this.pageSelectionRange?.commonAncestorContainer.parentElement,
    transmuteTools          = new Array<any>(Object.keys(ToolCommand).length/2).fill(false);

    if(parentElement?.classList.contains("content"))
      return;
    
    while(!["body", "header-body", "footer-body"].some((r)=> parentElement?.classList.contains(r))){
        switch(true){
          case "B" == parentElement?.tagName:
            transmuteTools[ToolCommand.BOLD]    = true;
            break;
          case "I" == parentElement?.tagName:
            transmuteTools[ToolCommand.ITALIC]  = true;
            break;
          case "U" == parentElement?.tagName || !!parentElement?.style.textDecorationStyle:
          transmuteTools[ToolCommand.UNDERLINE] = parentElement?.style.textDecorationStyle;
          break;
        }

        parentElement = parentElement!.parentElement;
    }

    transmuteTools.map((value, key)=>{
      Tool.transmuteTools[key]?.updateView(value);
    });
  }

  addPageRequest(newPageBodyContents:Page):void{
    this.addPageSubject.next(newPageBodyContents);
  }

  onAddPage():Observable<Page>{
    return this.addPageSubject.asObservable();
  }

  deletePageRequest(pageIndex:number):void{
    this.deletePageSubject.next(pageIndex);
  }

  onDeletePage():Observable<number>{
    return this.deletePageSubject.asObservable();
  }

  changePageSize(newPageSize:number[]):void{
    this.pageSizeSubject.next(newPageSize);
  }

  onPageSizeChange():Observable<number[]>{
    return this.pageSizeSubject.asObservable();
  }

  changePageMargin(newPageMargins:any):void{
    this.pageMarginSubject.next(newPageMargins);
  }

  onPageMarginChange():Observable<any>{
    return this.pageMarginSubject.asObservable();
  }

  triggerTool(toolCommand:ToolCommand){
    this.triggerToolSubject.next(toolCommand);
  }

  onTriggerTool():Observable<ToolCommand>{
    return this.triggerToolSubject.asObservable();
  }

  updatePageSelection(){
    this.pageSelection      = window.getSelection() as Selection;
    this.pageSelectionRange = this.pageSelection.getRangeAt(0);
  }

  convertChar(key:string, selectedFont:Font, eventType?:string):void {

    if(FontLanguage.ENGLISH == selectedFont.language) return;

    if(!!eventType && "keyup" ==  eventType) return;

    let keyMappings:any   = selectedFont.keyMappings,
        transformedChar   = keyMappings[key],
        textNode;

    if(!transformedChar || "string" != typeof transformedChar) return;

    textNode              = document.createTextNode(transformedChar);
    this.pageSelectionRange.insertNode(textNode);

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
  }

  updatePagesView(activePageIndex:number, allowedBodyHeightInMM:number):void{
    this.updatePageSelection();

    let allPageBodyElements:HTMLElement[] = [],
        allowedBodyHeightInPixel:number   = Math.round(allowedBodyHeightInMM * Conversion.MM_TO_PIXEL_FACTOR);

    for(let pageIndex=0; pageIndex<PageComponent.instanceCounter;pageIndex++){
        allPageBodyElements.push(document.getElementById(`app-page-${pageIndex}`)!.children[1].children[1] as HTMLElement);
    }

    this.redressPartialPages(allPageBodyElements, activePageIndex, allowedBodyHeightInPixel);
    this.mitigateOverflownPages(allPageBodyElements, activePageIndex, allowedBodyHeightInPixel);
    this.emitPageChange();
  }

  redressPartialPages(allPageBodyElements:HTMLElement[], activePageIndex:number, allowedHeightInPixel:number):void{
    for(let pageIndex=activePageIndex; pageIndex<allPageBodyElements.length; pageIndex++){
      let pageBodyElement                        = allPageBodyElements[pageIndex],
          nextPageIndex                          = pageIndex + 1,
          nextPageBodyElement:HTMLElement        = allPageBodyElements[nextPageIndex],
          nextPageFirstChildElement:HTMLElement  = nextPageBodyElement?.firstChild as HTMLElement,
          lastAppendedElement!:HTMLElement;

      if(0 < pageIndex && "" == pageBodyElement.innerHTML.trim()){
        if(pageBodyElement === document.activeElement)
          allPageBodyElements[pageIndex-1].focus();
        
        this.deletePageRequest(pageIndex);
        continue;
      }

      while(pageBodyElement.scrollHeight == allowedHeightInPixel && !!nextPageFirstChildElement){
        nextPageBodyElement.removeChild(nextPageFirstChildElement);
        pageBodyElement.append(nextPageFirstChildElement);

        if(pageBodyElement.scrollHeight > allowedHeightInPixel)
          lastAppendedElement = nextPageFirstChildElement;

        nextPageFirstChildElement  = nextPageBodyElement.firstChild as HTMLElement;
      };

      if(pageBodyElement.scrollHeight > allowedHeightInPixel && !!lastAppendedElement) {
        nextPageBodyElement.prepend(pageBodyElement.removeChild(lastAppendedElement));
      }
    }
  }

  mitigateOverflownPages(allPageBodyElements:HTMLElement[], activePageIndex:number, allowedBodyHeightInPixel:number):void{
    let removableLastChildBuffer:any[]  = [],
        isOverflown:boolean             = false;

    for(let pageIndex=activePageIndex; pageIndex<allPageBodyElements.length; pageIndex++){
      let pageBodyElement:HTMLElement  = allPageBodyElements[pageIndex];

      while(!!removableLastChildBuffer.length)
        pageBodyElement.prepend(removableLastChildBuffer.shift());

      while(pageBodyElement.scrollHeight > allowedBodyHeightInPixel && !!pageBodyElement.lastChild){
          isOverflown = true;
          removableLastChildBuffer.push(pageBodyElement.lastChild);
          pageBodyElement.lastChild.remove();
      }
    }

    if(0 < removableLastChildBuffer.length){
      let newPageBodyContents = ``;

      while(!!removableLastChildBuffer.length) 
        newPageBodyContents += (removableLastChildBuffer.pop()).outerHTML;

      let newPage = new Page();

      newPage.setBody(newPageBodyContents);
      this.addPageRequest(newPage);
    }

    this.focusNextPage(isOverflown);
  }

  focusNextPage(isOverflown:boolean){
    if((this.pageSelection.focusNode == (this.pageSelection.focusNode?.parentElement as HTMLElement).closest(".body")?.lastChild 
        || this.pageSelection.focusNode?.parentElement == (this.pageSelection.focusNode?.parentElement as HTMLElement).closest(".body")?.lastChild
        ) && isOverflown ) {
      let focusedpageId     = (this.pageSelection.focusNode?.parentElement as HTMLElement).closest("app-page")?.id as String,
          idLength:number   = focusedpageId?.length as number,
          focusPageIndex    = parseInt(focusedpageId?.charAt(idLength -1)),
          range, focusElement;

      if(document.getElementById("app-page-" + (focusPageIndex + 1)))
        range               = document.createRange();
        focusElement        = (document.getElementById("app-page-" + (focusPageIndex + 1))?.children[1]?.children[1].firstChild as HTMLElement);

        if(!!range && !! focusElement) {
          range?.setStart(focusElement, 0);
          range?.setEnd(focusElement, 0);
          this.pageSelection.removeAllRanges();
          this.pageSelection.addRange(range);
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
                                                "1":"१",
                                                "2":"२",
                                                "3":"३",
                                                "4":"४",
                                                "5":"५",
                                                "6":"६",
                                                "7":"७",
                                                "8":"८",
                                                "9":"९",
                                                "0":"१०",
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

  emitPageChange():void{
    let pagesWrapper:HTMLDivElement = document.createElement("div");

    for(let pageIndex=0; pageIndex<PageComponent.instanceCounter;pageIndex++){
      let clone:HTMLElement           = document.getElementById(`app-page-${pageIndex}`)?.cloneNode(true) as HTMLElement;

      (clone.children[1].children[0] as HTMLDivElement).contentEditable = "false";
      (clone.children[1].children[1] as HTMLDivElement).contentEditable = "false";
      (clone.children[1].children[2] as HTMLDivElement).contentEditable = "false";
      clone.style.display             = "grid";
      clone.id                        = "view-" + clone.id;

      pagesWrapper.append(clone);
    } 

    pagesWrapper.style.display        = "flex";
    pagesWrapper.style.flexDirection  = "column";
    pagesWrapper.style.justifyContent = "center";
    pagesWrapper.style.margin         = "0px";
    pagesWrapper.style.padding        = "0px";

    this.emitPageChangeSubject.next(pagesWrapper);
  }

  onPageChange():Observable<HTMLDivElement>{
    return this.emitPageChangeSubject.asObservable();
  }
}
