import { Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { EditorService } from './editor.service';
import { Page } from './page/page/page';
import { PageComponent } from './page/page/page.component';
import {  DialogTool, FileToolGroup, HomeToolGroup, LayoutToolGroup, TableToolGroup, Tool, ToolCommand, ToolGroup } from './tool-bar/tools/tool-bar';

export class EditorConfig{

  constructor(private toolGroup:{[k:string]:any[]}  = {}){
    for(const group of Object.values(ToolGroup)) {
      this.toolGroup[group] = [];
    }
  }

  isToolConfigured(toolGroup:ToolGroup, tool:FileToolGroup|HomeToolGroup|TableToolGroup|LayoutToolGroup):boolean{
    return !!this.toolGroup[toolGroup].includes(tool);
  }

  isToolGroupConfigured(toolGroup:ToolGroup):boolean{
    return this.toolGroup[toolGroup]!.length > 0;
  }

  setTools(toolGroup:ToolGroup, tools:any[]):void{
    this.toolGroup[toolGroup] = tools;
  }
}

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnDestroy {

  @Input() config?:EditorConfig;
  @Output() draftChangeEvent = new EventEmitter<HTMLDivElement>();

  color:string = "primary";
  pageGroup!:FormGroup;
  _onDeletePageSubsription!:Subscription;
  _onAddPageSubsription!:Subscription;
  _onPageSizeChange!:Subscription;
  _onPageMarginChange!:Subscription;
  _onPageChange!:Subscription;

  constructor(private _editorService:EditorService) {
    this.addPage();

    this._onAddPageSubsription = this._editorService.onAddPage().subscribe((page:Page) => {
      this.addPage(page);
    });

    this._onDeletePageSubsription = this._editorService.onDeletePage().subscribe((pageIndex) => {
      if(0 != pageIndex) {
        this.pages.removeAt(pageIndex);
        PageComponent.instanceCounter--;
      }
    });

    this._onPageSizeChange = this._editorService.onPageSizeChange().subscribe((newPageSize:number[])=>{
      for(let formControl of this.pages.controls) {
        formControl.value.setSize(newPageSize);
      }
      setTimeout(()=> this._editorService.updatePagesView(0, this.pageHeight) , 1);
    });

    this._onPageMarginChange = this._editorService.onPageMarginChange().subscribe((newPageMargin:any)=>{
      for(let i = 1; i <= this.pages.controls.length; i++) {
        let isOddPageNumber:boolean = (1 == i%2);

        this.pages.controls[i-1].value.setHeaderHeight(newPageMargin.topPadding);
        this.pages.controls[i-1].value.setLeftPadding(newPageMargin.isPageMirror ? (isOddPageNumber ? newPageMargin.leftPadding : newPageMargin.rightPadding) : newPageMargin.leftPadding);
        this.pages.controls[i-1].value.setRightPadding(newPageMargin.isPageMirror ? (!isOddPageNumber ? newPageMargin.leftPadding : newPageMargin.rightPadding) : newPageMargin.rightPadding);
        this.pages.controls[i-1].value.setFooterHeight(newPageMargin.bottomPadding);
      }

      setTimeout(()=> this._editorService.updatePagesView(0, this.pageHeight) , 1);
    });

    this._onPageChange = this._editorService.onPageChange().subscribe((draftElement:HTMLDivElement)=>{
      this.draftChangeEvent.emit(draftElement);
    })
  }

  addPage(page:Page = new Page()):void{
    if(!this.pageGroup)
      this.pageGroup = new FormGroup({pages : new FormArray([])});
  
    this.pages.push(new FormControl(page));

    if(this.pageGroup) {
      page.setPageNumber(PageComponent.instanceCounter + 1);

      let isPageMirror:boolean    = !!(Tool.tools[ToolCommand.PAGE_MARGINS] as DialogTool)?.getData()?.isPageMirror,
          isOddPageNumber:boolean = (1 == page.pageNumber%2);

      page.setSize(this.pages.controls[0].value.size);
      page.setHeaderHeight(this.pages.controls[0].value.headerHeight);
      page.setLeftPadding(isPageMirror ? (isOddPageNumber ? this.pages.controls[0].value.leftPadding : this.pages.controls[0].value.rightPadding) : this.pages.controls[0].value.leftPadding);
      page.setRightPadding(isPageMirror ? (!isOddPageNumber ? this.pages.controls[0].value.leftPadding : this.pages.controls[0].value.rightPadding) : this.pages.controls[0].value.rightPadding);
      page.setFooterHeight(this.pages.controls[0].value.footerHeight);
    }
  }

  get pages():FormArray{
    return this.pageGroup.get('pages') as FormArray;
  }

  get pageHeight():number{
    return this.pages.controls[0].value.bodyHeight;
  }

  ngOnDestroy(): void {
    this._onAddPageSubsription.unsubscribe();
    this._onDeletePageSubsription.unsubscribe();
    this._onPageSizeChange.unsubscribe();
    this._onPageMarginChange.unsubscribe();
  }
}
