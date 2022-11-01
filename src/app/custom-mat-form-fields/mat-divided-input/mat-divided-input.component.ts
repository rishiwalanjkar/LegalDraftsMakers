import { FocusMonitor } from '@angular/cdk/a11y';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { LowerCasePipe, UpperCasePipe } from '@angular/common';
import { Component, ElementRef, HostBinding, HostListener, Input, OnDestroy, OnInit, Optional, QueryList, Self, ViewChildren } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NgControl, Validators, FormControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { DividedInputComponents } from 'src/app/create-draft-template/create-draft-template.component';
import { Font, FontService } from 'src/app/font/font.service';
import { Language, LanguageService } from 'src/app/language/language.service';

export enum InputType{
  CAPITAL_ALPHA_NUMERIC = "capital_alpha_numeric",
  SMALL_ALPHA_NUMERIC   = "small_alpha_numeric",
  CAPITAL_ALPHABATE     = "capital_alphabate",
  SMALL_ALPHABATE       = "small_alphabate",
  ALPHABATE             = "alphabate",
  TEXT                  = "text",
  NUMBER                = "number"
}

export class MatDividedInputConstituent{
  constructor(public value:string|number, public placeholderKeyWordId:number, public type:InputType, public min:number, public max:number, public size:number){}
}

export class MatDividedInput{
  constructor(private inputs:MatDividedInputConstituent[], public separator:string){}

  toString(enabledDividedInputComponents?:any):string{
    return new Array(this.inputs.length).fill(null).map((value:any, index:number) => this.inputs[index].value).filter((value:any, index:number) => "undefined" == typeof enabledDividedInputComponents || !!enabledDividedInputComponents && (enabledDividedInputComponents[DividedInputComponents.AGGREGATE] || enabledDividedInputComponents[(index+1).toString()])).join(this.separator);
  }

  isEmpty():boolean{
    for(let i = 0; i < this.inputs.length; i++)
      if(0 < this.inputs[i].value.toString().trim().length)
        return false;

    return true;
  }

  isAnyInputConstituentEmpty(): boolean|number{
    for(let i = 0; i < this.inputs.length; i++)
      if(0 == this.inputs[i].value.toString().trim().length)
        return i;

    return false;
  };

  isInputConstituentEmpty(inputIndex:number):boolean{
    return 0 == this.getInputConstituentLength(inputIndex);
  }

  isMaxLengthReached(inputIndex:number):boolean{
    return InputType.TEXT == this.getInputConstituentType(inputIndex) 
            ? this.getInputConstituentMax(inputIndex) <= this.getInputConstituentLength(inputIndex)
              : this.getInputConstituentMax(inputIndex).toString().length <= this.getInputConstituentLength(inputIndex);
  }

  getInputConstituents():MatDividedInputConstituent[]{
    return this.inputs;
  }

  getSize():number{
    return this.inputs.length;
  }

  getInputConstituent(inputIndex:number):MatDividedInputConstituent{
    return this.inputs[inputIndex];
  }

  getInputConstituentLength(inputIndex:number):number{
    return this.inputs[inputIndex].value.toString().length;
  }

  getInputConstituentMax(inputIndex:number):number{
    return this.inputs[inputIndex].max;
  }

  getInputConstituentMin(inputIndex:number):number{
    return this.inputs[inputIndex].min;
  }

  getInputConstituentValue(inputIndex:number):string{
    return this.inputs[inputIndex].value.toString();
  }

  setInputConstituentValue(inputIndex:number, newVal:any):string{
    return this.inputs[inputIndex].value = newVal;
  }

  getInputConstituentType(inputIndex:number):InputType{
    return this.inputs[inputIndex].type;
  }

  hasPlaceholder():boolean{
    for(let i = 0; i < this.inputs.length; i++)
      if(0 < this.inputs[i].placeholderKeyWordId.toString().trim().length)
        return true;
    
    return false;
  }
}

@Component({
  selector: 'custom-mat-divided-input',
  templateUrl: './mat-divided-input.component.html',
  styleUrls: ['./mat-divided-input.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: MatDividedInputComponent}, UpperCasePipe, LowerCasePipe],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  }
})
export class MatDividedInputComponent implements MatFormFieldControl<MatDividedInput>, ControlValueAccessor, OnInit, OnDestroy {
  static instanceCounter:number               = 0;
  private _value!:MatDividedInput
  stateChanges                                = new Subject<void>();
  private _placeholder:string                 = "";
  focused:boolean                             = false
  touched:boolean                             = false;
  private _required:boolean                   = false;
  private _disabled:boolean                   = false;
  onChange                                    = (param:any) => {};
  onTouched                                   = () => {};
  parts                                       = this._formBuilder.group({});
  @HostBinding() id:string                    = `custom-mat-divided-input-${MatDividedInputComponent.instanceCounter++}`;

  @Input() font!:Font;
  @Input() language!:Language;

  @ViewChildren('inputs')
  inputHTMLElements!: QueryList<any>;
  
  constructor(private _formBuilder: FormBuilder,
                private _focusMonitor: FocusMonitor,
                private _elementRef: ElementRef<HTMLElement>, 
                @Optional() @Self() public ngControl:NgControl,
                public languageService:LanguageService,
                public fontService:FontService) { 
                  
    if(this.ngControl != null)
      this.ngControl.valueAccessor = this;
  }

  @Input()
  set value(matDividedInput:MatDividedInput) {
    this._value = matDividedInput;

    for(const key of Object.keys(this.parts.controls))
      this.parts.controls[key].setValue(matDividedInput.getInputConstituentValue(parseInt(key)));

    this.stateChanges.next();
  };

  get value():MatDividedInput{
    return this._value;
  }

  get inputs():MatDividedInputConstituent[]{
    return !!this._value ? this._value.getInputConstituents() : [];
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
    return this.value?.isEmpty();
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
  }
  
  get errorState(): boolean{
    let isAnyControlInvalid = false;

    for(const key of Object.keys(this.parts.controls)){
      isAnyControlInvalid ||= this.parts.controls[key].invalid;
      this.ngControl.control!.setErrors({...this.ngControl.control?.errors, ...this.parts.controls[key].errors});
    }

    if(this.ngControl.control!.errors && 0 == Object.keys(this.ngControl.control!.errors).length)
      this.ngControl.control!.setErrors(null);

    return this.touched && isAnyControlInvalid;
  };

  setDescribedByIds(ids: string[]): void {

  }
  
  onContainerClick(event: MouseEvent): void {
    
  }

  ngOnInit(): void {
    if(!!this._value && !!this.parts)
      for(let i = 0; i < this._value.getSize(); i++) {
        let formControl = new FormControl(this._value.getInputConstituentValue(i));

        formControl.addValidators(Validators.minLength(this._value.getInputConstituentMin(i)));
        formControl.addValidators(Validators.maxLength(this._value.getInputConstituentMax(i)));

        switch(this._value.getInputConstituentType(i)) {
          case InputType.NUMBER:
            formControl.clearValidators();
            formControl.addValidators(Validators.pattern("^[0-9]*$"));
            formControl.addValidators(Validators.min(this._value.getInputConstituentMin(i)));
            formControl.addValidators(Validators.max(this._value.getInputConstituentMax(i)));
            break;
          
          case InputType.ALPHABATE:
            formControl.addValidators(Validators.pattern("^[a-zA-Z]*$"));
            break;

          case InputType.CAPITAL_ALPHABATE:
            formControl.addValidators(Validators.pattern("^[A-Z]*$"));
            break;
            
          case InputType.SMALL_ALPHABATE:
            formControl.addValidators(Validators.pattern("^[a-z]*$"));
            break;

          case InputType.CAPITAL_ALPHA_NUMERIC:
            formControl.addValidators(Validators.pattern("^[0-9A-Z]*$"));
            break;

          case InputType.SMALL_ALPHA_NUMERIC:
            formControl.addValidators(Validators.pattern("^[0-9a-z]*$"));
            break;
        }

        if(this.required)
          formControl.addValidators(Validators.required);
          
        formControl.valueChanges.subscribe((newVal:string|number)=>{
          this._value.setInputConstituentValue(i, newVal);
          this.onChange(this._value);

          if(formControl.invalid)
            this.ngControl.control!.setErrors(formControl.errors);
        });

        this.parts.addControl(i.toString(), formControl);
      }

    this.disabled ? this.parts.disable() : this.parts.enable();
  }

  writeValue(obj: MatDividedInput): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  autoFocusPrev(inputIndex:number): void {
    if(this.value.isInputConstituentEmpty(inputIndex) && !!this.inputHTMLElements.toArray()[inputIndex - 1]?.nativeElement) {
      this._focusMonitor.focusVia(this.inputHTMLElements.toArray()[inputIndex - 1]?.nativeElement, 'program');
    }
  }

  handleInput(inputIndex:number):void{ 
    if( this.value.isMaxLengthReached(inputIndex) && !!this.inputHTMLElements.toArray()[inputIndex + 1]?.nativeElement)
      this._focusMonitor.focusVia(this.inputHTMLElements.toArray()[inputIndex + 1]?.nativeElement, 'program');
  }

  @HostListener("focusout", ["$event"])
  onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.focused = false;
      this.stateChanges.next();
    }
  }

  @HostListener("focusin")
  onFocusIn() {
    if (!this.focused) {
      this.touched = true;
      this.onTouched();
      this.focused = true;
      this.stateChanges.next();
    }
    
    for(let i = 0; i < this._value.getSize(); i++) {
      if(this.parts.controls[i.toString()].invalid && !!this.inputHTMLElements.toArray()[i]?.nativeElement) {
        this._focusMonitor.focusVia(this.inputHTMLElements.toArray()[i]?.nativeElement, 'program');
        return;
      }
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
  }

  convertChar(event:KeyboardEvent, inputs:HTMLInputElement){
    if(!!this.font)
      this.fontService.convertChar(event, inputs, this.font);
  }
}
