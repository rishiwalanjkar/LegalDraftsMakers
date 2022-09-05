import { Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FontService } from 'src/app/font/font.service';
import { EditorService } from '../../editor.service';
import { SelectTool, Tool, ToolCommand } from '../../tool-bar/tools/tool-bar';
import { Page } from './page';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  providers:[{provide:MatFormFieldControl, useExisting:PageComponent}],
  host:{
    '[style.lineHeight]' : 'value.lineSpacing'
  }
})
export class PageComponent implements MatFormFieldControl<Page>, ControlValueAccessor, OnDestroy {
  static instanceCounter:number = 0;
  @HostBinding() id: string     = `app-page-${PageComponent.instanceCounter++}`;

  page!: Page;
  stateChanges                  = new Subject<void>();
  _focused:boolean              = false;
  touched:boolean               = false;
  placeholder:string            = "";
  required:boolean              = false;
  disabled:boolean              = false;
  errorState:boolean            = false;
  onChange = (param:any) => {};
  onTouched = () => {};

  @Input()
  get value():Page{
    return this.page;
  }

  set value(page:Page){
    this.page = page;
    this.stateChanges.next();
  }

  @Input()
  get focused(): boolean{
    return this._focused;
  };

  set focused(focused:boolean){
    this._focused = focused;
  }

  get empty(): boolean{
    return "" === this._elementRef.nativeElement.children[1].children[1].innerHTML.trim();
  };

  get shouldLabelFloat(): boolean{
    return this.focused || !this.empty;
  };

  constructor(private _elementRef: ElementRef<HTMLElement>,
              @Optional() @Self() public ngControl:NgControl,
              private _editorService:EditorService,
              private _fontService:FontService) {
                
    if(this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }
  
  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  writeValue(obj: Page): void {
    this.value = obj;
  }
  
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  
  setDescribedByIds(ids: string[]): void {
  }

  onContainerClick(event: MouseEvent): void {
    this._editorService.updateToolView();
  }

  @HostListener("keyup", ["$event"])
  @HostListener("keydown", ["$event"])
  onKeyUpAndDown(event:any){
    switch(true){
      case ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"].includes(event.key):
        this._editorService.updateToolView();
        break;

      default:
        this._fontService.convertChar(event, this._editorService.pageSelectionRange, (Tool.tools[ToolCommand.SET_FONT] as SelectTool).selected);
        this._editorService.updatePagesView(parseInt(this.id.charAt(this.id.length-1)), this.value.bodyHeight);
    }
  }

  @HostListener("focusin")
  onFocusIn(){
    this.focused = true;
    this.stateChanges.next();
  }

  @HostListener("focusout", ["$event"])
  onFocusOut(event:FocusEvent){
      this.focused = false;
      this.touched = true;
      this.onTouched();
      this.stateChanges.next();
  }

  @HostListener("mouseup")
  onMouseUp(){
    this._editorService.updatePageSelection();
  }
}
