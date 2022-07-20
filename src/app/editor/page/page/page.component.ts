import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { AfterViewChecked, Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, Optional, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { EditorService } from '../../editor.service';
import { FontService } from '../../font.service';
import { Font, FontLanguage, SelectTool, Tool, ToolCommand} from '../../tool-bar/tools/tool-bar';
import { Page } from './page';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  providers:[{provide:MatFormFieldControl, useExisting:PageComponent}]
})
export class PageComponent implements MatFormFieldControl<Page>, ControlValueAccessor, OnDestroy {
  static instanceCounter:number = 0;
  @HostBinding() id: string = `app-page-${PageComponent.instanceCounter++}`;

  page!: Page;
  stateChanges = new Subject<void>();
  _focused:boolean = false;
  touched:boolean = false;
  _placeholder!:string;
  _required:boolean = false;
  _disabled:boolean = false;
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

  @Input()
  get placeholder(): string{
    return this._placeholder;
  };

  set placeholder(placeholder:string){
    this._placeholder = placeholder;
  }

  get empty(): boolean{
    return "" === this._elementRef.nativeElement.children[1].children[1].innerHTML.trim();
  };

  get shouldLabelFloat(): boolean{
    return this.focused || !this.empty;
  };

  @Input()
  get required(): boolean{
    return this._required;
  };

  set required(value:BooleanInput){
    this._required = coerceBooleanProperty(value);
  }

  @Input()
  get disabled():boolean{
    return this._disabled;
  }

  set disabled(value:BooleanInput){
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  
  get errorState(): boolean{
    return this.touched;
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
    //throw new Error('Method not implemented.');
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
        this._fontService.convertChar(event, this._editorService.pageSelectionRange);
        this._editorService.updatePagesView(parseInt(this.id.charAt(this.id.length-1)), this.value.bodyHeight);
    }
  }

  @HostListener("focusin")
  onFocusIn(){
    if(!this.touched) {
      this.touched = true;
      this.onTouched();
    }

    this.focused = true;
    this.stateChanges.next();
  }

  @HostListener("focusout", ["$event"])
  onFocusOut(event:FocusEvent){
      this.focused = false;
      this.stateChanges.next();
  }

  @HostListener("mouseup")
  onMouseUp(){
    this._editorService.updatePageSelection();
  }
}
