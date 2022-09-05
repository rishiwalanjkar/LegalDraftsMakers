import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { Font } from 'src/app/font/font.service';
import { Language } from 'src/app/language/language.service';
import { InputType, MatDividedInput, MatDividedInputConstituent } from '../mat-divided-input/mat-divided-input.component';

export class MatAdharNumberField{
  private _label!:string;
  firstQuadrantInput:MatDividedInputConstituent   = new MatDividedInputConstituent("", 45, InputType.NUMBER, 0, 9999, 20);
  middleQuadrantInput:MatDividedInputConstituent  = new MatDividedInputConstituent("", 45, InputType.NUMBER, 0, 9999, 20);
  lastQuadrantInput:MatDividedInputConstituent    = new MatDividedInputConstituent("", 45, InputType.NUMBER, 0, 9999, 20);
  adharNumberInput:MatDividedInput                = new MatDividedInput([this.firstQuadrantInput, this.middleQuadrantInput, this.lastQuadrantInput], " ");

  setLabel(label:string):void{
    this._label = label;
  }

  toString():string{
    return !this._label || !this.adharNumberInput.toString().trim().length ? "" : (this._label + " : " + this.adharNumberInput.toString() + " ");
  }

  isEmpty():boolean{
    return this.adharNumberInput.isEmpty();
  }

  get errorState():boolean{
    return this.adharNumberInput.errorState;
  }
}

@Component({
  selector: 'custom-mat-adhar-number-field',
  templateUrl: './mat-adhar-number-field.component.html',
  styleUrls: ['./mat-adhar-number-field.component.scss'],
  providers:[{provide:MatFormFieldControl, useExisting:MatAdharNumberFieldComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  }
})
export class MatAdharNumberFieldComponent implements MatFormFieldControl<MatAdharNumberField>, ControlValueAccessor, OnInit {
  private static instanceCounter    = 0;
  _value!: MatAdharNumberField;
  stateChanges                      = new Subject<void>();
  @HostBinding() id: string         = `custom-mat-adhar-number-field-${MatAdharNumberFieldComponent.instanceCounter++}`;
  placeholder: string               = "";
  focused: boolean                  = false;
  touched: boolean                  = false;
  _required: boolean                = false;
  _disabled: boolean                = false;
  onChange                          = (param:any)=>{};
  onTouched                         = ()=>{};
  parts                             = new FormGroup({
                                      adharNumber   : new FormControl()
                                    });

  constructor(private _elementRef:ElementRef,
    @Optional() @Self() public ngControl:NgControl) { 

      if(this.ngControl != null)
        this.ngControl.valueAccessor = this;
  }

  @Input() font!:Font;
  @Input() language!:Language;
  @Input() label!:string;

  @Input()
  get value():MatAdharNumberField{
    return this._value;
  }

  set value(value:MatAdharNumberField){
    this._value = value;
    this.parts.controls['adharNumber']?.setValue(this._value.adharNumberInput);
    this.stateChanges.next();
  }

  get empty():boolean{
    return this.value.isEmpty();
  }

  get shouldLabelFloat():boolean{
    return this.focused || !this.empty;
  }

  @Input()
  get required():boolean{
    return this._required;
  }

  set required(required:boolean){
    this._required = required;
    this.stateChanges.next();
  }
  
  @Input()
  get disabled():boolean{
    return this._disabled;
  }

  set disabled(disabled:boolean){
    this._disabled = coerceBooleanProperty(disabled);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  get errorState():boolean{
    return this.touched && this.value.errorState;
  }

  setDescribedByIds(ids: string[]): void {

  }

  onContainerClick(event: MouseEvent): void {

  }

  writeValue(newVal: MatAdharNumberField): void {
    this.value = newVal;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    this.value.setLabel(this.label);

    if(this.required)
      this.parts.controls['adharNumber'].addValidators(Validators.required);

    this.parts.controls['adharNumber'].valueChanges.subscribe((adharNumberInput:MatDividedInput)=>{
      this._value.adharNumberInput = adharNumberInput;
      this.onChange(this._value);
    });

    this._disabled ? this.parts.disable() : this.parts.enable();
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
    this.touched = true;
    this.onTouched();
    this.focused = true;
    this.stateChanges.next();
  }
}
