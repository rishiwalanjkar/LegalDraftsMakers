import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Draft } from '../draft/draft.service';
import { Font } from '../font/font.service';
import { Language } from '../language/language.service';
import { EditorService } from './editor.service';
import { Page } from './page/page/page';
import { PageComponent } from './page/page/page.component';
import {  BlockToolGroup, DialogTool, FileToolGroup, HomeToolGroup, LayoutToolGroup, TableToolGroup, Tool, ToolCommand, ToolGroup } from './tool-bar/tools/tool-bar';

export class EditorConfig{
  private _draftLanguage = Language.MARATHI;

  constructor(private toolGroup:{[k:string]:any[]}  = {}){
    for(const group of Object.values(ToolGroup)) {
      this.toolGroup[group] = [];
    }

    this.toolGroup[ToolGroup.HOME].push(HomeToolGroup.SET_FONT, HomeToolGroup.SET_FONT_SIZE, HomeToolGroup.BOLD, HomeToolGroup.ITALIC, HomeToolGroup.UNDERLINE);
  }

  get draftLanguage():Language{
    return this._draftLanguage;
  }

  isToolConfigured(toolGroup:ToolGroup, tool:FileToolGroup|HomeToolGroup|TableToolGroup|LayoutToolGroup|BlockToolGroup):boolean{
    return !!this.toolGroup[toolGroup].includes(tool);
  }

  isToolGroupConfigured(toolGroup:ToolGroup):boolean{
    return this.toolGroup[toolGroup]!.length > 0;
  }

  setTools(toolGroup:ToolGroup, tools?:any[]):void{
    if(!tools)
      switch(toolGroup){
        case ToolGroup.FILE:
          tools = [FileToolGroup.FIND, FileToolGroup.FIND_AND_REPLACE];
          break;

        case ToolGroup.HOME:
          tools = [HomeToolGroup.UNDO, HomeToolGroup.REDO,  HomeToolGroup.LINE_SPACING, HomeToolGroup.SUPERSCRIPT, HomeToolGroup.SUPERSCRIPT, HomeToolGroup.CHANGE_CASE,
                    HomeToolGroup.FORECOLOR, HomeToolGroup.HIGHLIGHT, HomeToolGroup.JUSTIFY, HomeToolGroup.INDENT, HomeToolGroup.OUTDENT,
                    HomeToolGroup.BULLETED_LIST, HomeToolGroup.NUMBERED_LIST, HomeToolGroup.SYMBOL, HomeToolGroup.IMAGE];
          break;

        case ToolGroup.TABLE:
          tools = [TableToolGroup.TABLE, TableToolGroup.MERGE_CELLS, TableToolGroup.SPLIT_CELL, TableToolGroup.INSERT_COLUMNS_AND_ROWS, TableToolGroup.DELETE_COLUMNS_AND_ROWS];
          break;
  
        case ToolGroup.LAYOUT:
          tools = [LayoutToolGroup.PAGE_SIZE, LayoutToolGroup.PAGE_ORIENTATION, LayoutToolGroup.PAGE_MARGINS, LayoutToolGroup.PAGE_NUMBER];
          break;

        case ToolGroup.BLOCK:
          tools = [BlockToolGroup.PERSONAL_INFO];
          break;
      }

    this.toolGroup[toolGroup] = this.toolGroup[toolGroup].concat(tools);
  }

  configureAllTools():void{
    for(const toolGroup of Object.values(ToolGroup))
      this.setTools(toolGroup);
  }

  setDraftLanguage(draftLanguage:Language):void{
    this._draftLanguage = draftLanguage;
  }
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnDestroy, AfterViewInit {

  @Input() editorConfig:EditorConfig  = new EditorConfig();

  @Output() draftChange         = new EventEmitter<Draft>();
  @Output() fontChangeEvent     = new EventEmitter<Font>();

  color:string                  = "primary";
  pageGroup!:FormGroup;
  private _onDeletePage!:Subscription;
  private _onAddPage!:Subscription;
  private _onPageSizeChange!:Subscription;
  private _onPageMarginChange!:Subscription;
  private _onDraftChange!:Subscription;
  private _onPageViewChange!:Subscription;
  private _draft!:Draft;
  
  constructor(private _editorService:EditorService) {
    
    this._onAddPage = this._editorService.onAddPage().subscribe((page:Page) => {
      this.addPage(page);
    });

    this._onDeletePage = this._editorService.onDeletePage().subscribe((pageIndex) => {
      if(0 != pageIndex) this.removePage(pageIndex);
    });

    this._onPageSizeChange = this._editorService.onPageSizeChange().subscribe((newPageSize:number[])=>{
      for(let formControl of this.pageControls) {
        formControl.value.setSize(newPageSize);
      }
    });

    this._onPageMarginChange = this._editorService.onPageMarginChange().subscribe((newPageMargin:any)=>{
      for(let i = 1; i <= this.pageControls.length; i++) {
        let isOddPageNumber:boolean = (1 == i%2);

        this.pageControls[i-1].value.setHeaderHeight(newPageMargin.topPadding);
        this.pageControls[i-1].value.setLeftPadding(newPageMargin.isPageMirror ? (isOddPageNumber ? newPageMargin.leftPadding : newPageMargin.rightPadding) : newPageMargin.leftPadding);
        this.pageControls[i-1].value.setRightPadding(newPageMargin.isPageMirror ? (!isOddPageNumber ? newPageMargin.leftPadding : newPageMargin.rightPadding) : newPageMargin.rightPadding);
        this.pageControls[i-1].value.setFooterHeight(newPageMargin.bottomPadding);
      }
    });

    this._onDraftChange = this._editorService.onDraftChange().subscribe(()=>{

      if(!this._draft) this._draft = new Draft();

      for(let i = this._draft.pages.length; i < this.pageControls.length; i++) 
        this._draft.pages.push(Object.create(Object.getPrototypeOf(this.pageControls[i].value), Object.getOwnPropertyDescriptors(this.pageControls[i].value)));

      for(let i = this.pageControls.length; i < this._draft.pages.length; i++) 
        this._draft.pages.pop();

      for(let i = 0; i < this._draft.pages.length; i++) {
        let bodyElement = (document.getElementById(`app-page-${i}`)?.children[1]?.children[1] as HTMLDivElement);

        if(!bodyElement) continue;

        this._draft.pages[i].setBody(bodyElement.innerHTML);
      }

      this.draftChange.emit(this._draft);
    });

    this._onPageViewChange = this._editorService.onPageViewChange().subscribe(()=> setTimeout(()=> this._editorService.updatePagesView(0, this.pageHeight) , 1));
  }

  @Input()
  set draft(draft:Draft|undefined){
    if(!draft) {
      this.addPage();
      return;
    }

    this._draft                   = draft;
    PageComponent.instanceCounter = 0;
    this.pageControlArray.clear();

    for(const page of draft.pages)
      this.addPage(Object.create(Object.getPrototypeOf(page), Object.getOwnPropertyDescriptors(page)));

    this.editorConfig.setDraftLanguage(draft.language);
  }

  get draft():Draft{
    return this._draft;
  }

  addPage(page:Page = new Page()):void{
    if(!this.pageGroup)
      this.pageGroup = new FormGroup({pageControlArray : new FormArray([])});
  
    this.pageControlArray.push(new FormControl(page));

    let isPageMirror:boolean    = !!(Tool.tools[ToolCommand.PAGE_MARGINS] as DialogTool)?.getData()?.isPageMirror,
        isOddPageNumber:boolean = (1 == page.pageNumber%2);

    page.setPageNumber(PageComponent.instanceCounter + 1);
    page.setSize(this.pageControls[0].value.size);
    page.setHeaderHeight(this.pageControls[0].value.headerHeight);
    page.setLeftPadding(isPageMirror ? (isOddPageNumber ? this.pageControls[0].value.leftPadding : this.pageControls[0].value.rightPadding) : this.pageControls[0].value.leftPadding);
    page.setRightPadding(isPageMirror ? (!isOddPageNumber ? this.pageControls[0].value.leftPadding : this.pageControls[0].value.rightPadding) : this.pageControls[0].value.rightPadding);
    page.setFooterHeight(this.pageControls[0].value.footerHeight);
  }

  get pageControls():AbstractControl[]{
    return (this.pageGroup.get('pageControlArray') as FormArray).controls;
  }

  get pageControlArray():FormArray{
    return this.pageGroup.get('pageControlArray') as FormArray;
  }

  get pageHeight():number{
    return this.pageControls[0].value.bodyHeight;
  }

  removePage(pageIndex:number){
    this.pageControlArray.removeAt(pageIndex);
    PageComponent.instanceCounter--;
  }

  ngOnDestroy(): void {
    this._onAddPage.unsubscribe();
    this._onDeletePage.unsubscribe();
    this._onPageSizeChange.unsubscribe();
    this._onPageMarginChange.unsubscribe();
    this._onDraftChange.unsubscribe();
    this._onPageViewChange.unsubscribe();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this._editorService.emitPages(), 20);
  }
}
