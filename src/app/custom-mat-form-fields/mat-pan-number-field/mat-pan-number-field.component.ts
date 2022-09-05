import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { Language } from 'src/app/language/language.service';
import { InputType, MatDividedInput, MatDividedInputConstituent } from '../mat-divided-input/mat-divided-input.component';

export class MatPanNumberField{
  private _label!:string;
  firstInput:MatDividedInputConstituent   = new MatDividedInputConstituent("", 46, InputType.CAPITAL_ALPHABATE, 5, 5, 5);
  middleInput:MatDividedInputConstituent  = new MatDividedInputConstituent("", 45, InputType.NUMBER, 0, 9999, 4);
  lastInput:MatDividedInputConstituent    = new MatDividedInputConstituent("", 47, InputType.CAPITAL_ALPHABATE, 1, 1, 1);
  panNumberInput:MatDividedInput          = new MatDividedInput([this.firstInput, this.middleInput, this.lastInput], "");

  setLabel(label:string):void{
    this._label = label;
  }

  toString():string{
    return !!this._label && !!this.panNumberInput.toString() ? (this._label + " : " + this.panNumberInput.toString() + " ") : "";
  }

  isEmpty():boolean{
    return this.panNumberInput.isEmpty();
  }

  get errorState():boolean{
    return this.panNumberInput.errorState;
  }
}

@Component({
  selector: 'custom-mat-pan-number-field',
  templateUrl: './mat-pan-number-field.component.html',
  styleUrls: ['./mat-pan-number-field.component.scss'],
  providers:[{provide:MatFormFieldControl, useExisting:MatPanNumberFieldComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  }
})
export class MatPanNumberFieldComponent implements MatFormFieldControl<MatPanNumberField>, ControlValueAccessor, OnInit {
  private static instanceCounter    = 0;
  _value!: MatPanNumberField;
  stateChanges                      = new Subject<void>();
  @HostBinding() id: string         = `custom-mat-pan-number-field-${MatPanNumberFieldComponent.instanceCounter++}`;
  placeholder: string               = "";
  focused: boolean                  = false;
  touched: boolean                  = false;
  _required: boolean                = false;
  _disabled: boolean                = false;
  onChange                          = (param:any)=>{};
  onTouched                         = ()=>{};
  parts                             = new FormGroup({
                                      panNumber   : new FormControl()
                                    });

  constructor(private _elementRef:ElementRef,
    @Optional() @Self() public ngControl:NgControl) { 

      if(this.ngControl != null)
        this.ngControl.valueAccessor = this;
  }

  @Input() language!:Language;
  @Input() label!:string;

  @Input()
  get value():MatPanNumberField{
    return this._value;
  }

  set value(value:MatPanNumberField){
    this._value = value;
    this.parts.controls['panNumber']?.setValue(this._value.panNumberInput);
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

  writeValue(newVal: MatPanNumberField): void {
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
      this.parts.controls['panNumber'].addValidators(Validators.required);

    this.parts.controls['panNumber'].valueChanges.subscribe((panNumberInput:MatDividedInput)=>{
      this._value.panNumberInput = panNumberInput;
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