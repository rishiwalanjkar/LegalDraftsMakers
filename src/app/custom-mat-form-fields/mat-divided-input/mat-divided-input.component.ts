import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit, Optional, QueryList, Self, ViewChildren } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NgControl, Validators, FormControl, AbstractControl  } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

export interface MatDividedInputType{
  value:string|number;
  type:string;
  maxLength:number;
}

export class MatDividedInput{
  constructor(public inputs:MatDividedInputType[], public separator:string){}
}

@Component({
  selector: 'app-mat-divided-input',
  templateUrl: './mat-divided-input.component.html',
  styleUrls: ['./mat-divided-input.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: MatDividedInputComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  }
})
export class MatDividedInputComponent implements MatFormFieldControl<MatDividedInput>, ControlValueAccessor, OnInit, OnDestroy {
  static instanceCounter:number   = 0;
  private _value!:MatDividedInput
  stateChanges                    = new Subject<void>();
  private _placeholder:string     = "";
  private _focused:boolean        = false
  touched:boolean                 = false;
  private _required:boolean       = false;
  private _disabled:boolean       = false;
  onChange                        = (param:any) => {};
  onTouched                       = () => {};
  private controls                = {}
  parts                           = this._formBuilder.group({});

  @ViewChildren('inputs')
  inputHTMLElements!: QueryList<any>;
  
  constructor(private _formBuilder: FormBuilder,
                private _focusMonitor: FocusMonitor,
                private _elementRef: ElementRef<HTMLElement>, 
                @Optional() @Self() public ngControl:NgControl) { 
                  
    if(this.ngControl != null)
      this.ngControl.valueAccessor = this;
  }

  @HostBinding() id:string = `mat-divided-input-${MatDividedInputComponent.instanceCounter++}`;

  @Input()
  set value(matDividedInput:MatDividedInput) {
    this._value = matDividedInput;
  };

  get value():MatDividedInput{
    return this._value;
  }

  get inputs():MatDividedInputType[]{
    return !!this._value ? this._value.inputs : [];
  }

  getControlKey(index:number):string{
    return "input-" + index;
  }
  
  get separator():string{
    return this._value.separator;
  }
  
  @Input()
  get focused(): boolean{
    return this._focused;
  };

  set focused(focused:boolean){
    this._focused = focused;
  }

  @Input()
  get placeholder():string{
    return this._placeholder;
  };

  set placeholder(value:string){
    this._placeholder = value;
    this.stateChanges.next();
  }
  
  get empty(): boolean{
    let empty = true;

    for(let i = 0; i < this._value.inputs.length; i++)
      empty &&= 0 == this.parts.controls[this.getControlKey(i)].value.toString().trim().length;

    return empty;
  };

  get isAnyInputEmpty(): boolean|number{
    for(let i = 0; i < this._value.inputs.length; i++)
      if(0 == this.parts.controls[this.getControlKey(i)].value.toString().trim().length)
        return i;

    return false;
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
    this.stateChanges.next();
  }

  @Input()
  get disabled():boolean{
    return this._disabled;
  }

  set disabled(value:BooleanInput){
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }
  
  get errorState(): boolean{
    return this.parts.invalid && this.touched;
  };

  setDescribedByIds(ids: string[]): void {
    // throw new Error('Method not implemented.');
  }
  
  onContainerClick(event: MouseEvent): void {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }

    for(let i = 0; i < this._value.inputs.length; i++)
      if(this.parts.controls[this.getControlKey(i)].invalid && !!this.inputHTMLElements.toArray()[i]?.nativeElement) {
        this._focusMonitor.focusVia(this.inputHTMLElements.toArray()[i]?.nativeElement, 'program');
        return;
      }

    if(false !== this.isAnyInputEmpty) {
      this._focusMonitor.focusVia(this.inputHTMLElements.toArray()[this.isAnyInputEmpty as number]?.nativeElement, 'program');
      return;
    }

    if(!this.empty)
      this._focusMonitor.focusVia(this.inputHTMLElements.toArray()[this._value.inputs.length - 1]?.nativeElement, 'program');
  }

  ngOnInit(): void {
    if(!!this._value && !! this.parts)
      for(let i = 0; i < this._value.inputs.length; i++) {
        let formControl = new FormControl(this._value.inputs[i].value, [Validators.minLength(this._value.inputs[i].maxLength), Validators.maxLength(this._value.inputs[i].maxLength)]);

        if("number" == this._value.inputs[i].type)
          formControl.addValidators(Validators.pattern("^[0-9]*$"));

        if(this._required)
          formControl.addValidators(Validators.required);

        this.parts.addControl(`input-${i}`, formControl);
      }

    this.disabled ? this.parts.disable() : this.parts.enable();
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  autoFocusNext(control: AbstractControl, nextElement?: HTMLElement): void {
    if (!control.errors && !!nextElement) {
      this._focusMonitor.focusVia(nextElement, 'program');
    }
  }

  autoFocusPrev(inputIndex:number): void {
    if (this.parts.controls[this.getControlKey(inputIndex)].value.length < 1 && !!this.inputHTMLElements.toArray()[inputIndex - 1]?.nativeElement) {
      this._focusMonitor.focusVia(this.inputHTMLElements.toArray()[inputIndex - 1]?.nativeElement, 'program');
    }
  }

  handleInput(inputIndex:number):void{
    this.autoFocusNext(this.parts.controls[this.getControlKey(inputIndex)], this.inputHTMLElements.toArray()[inputIndex + 1]?.nativeElement);
    this.onChange(this.value);
  }

  @HostListener("focusout", ["$event"])
  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }
}
