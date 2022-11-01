import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

export class MatMobileNumberField{
  private _label!:string;
  mobileNumber!:number;

  get value():string{
    return !!this.mobileNumber ? this.mobileNumber.toString() : "";
  }

  setLabel(label:string):void{
    this._label = label;
  }

  toString():string{
    return !!this._label && !!this.mobileNumber ? (this._label + " : " + this.mobileNumber.toString() + " ") : "";
  }

  isEmpty():boolean{
    return !this.mobileNumber;
  }
}

@Component({
  selector: 'custom-mat-mobile-number-field',
  templateUrl: './mat-mobile-number-field.component.html',
  styleUrls: ['./mat-mobile-number-field.component.scss'],
  providers:[{provide:MatFormFieldControl, useExisting:MatMobileNumberFieldComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  }
})
export class MatMobileNumberFieldComponent implements MatFormFieldControl<MatMobileNumberField>, ControlValueAccessor, OnInit {
  private static instanceCounter  = 0;
  _value!: MatMobileNumberField;
  stateChanges                    = new Subject<void>();
  @HostBinding() id: string       = `custom-mat-mobile-number-field-${MatMobileNumberFieldComponent.instanceCounter++}`;
  placeholder: string             = "";
  focused: boolean                = false;
  touched: boolean                = false;
  _required: boolean              = false;
  _disabled: boolean              = false;
  onChange                        = (param:any)=>{};
  onTouched                       = ()=>{};
  parts                           = new FormGroup({
                                    mobileNumber : new FormControl("", [Validators.min(1000000000), Validators.max(9999999999), Validators.pattern("^[0-9]*$")])
                                  });

  constructor(private _elementRef:ElementRef,
    @Optional() @Self() public ngControl:NgControl) {

    if(this.ngControl != null)
      this.ngControl.valueAccessor = this;
  }

  @Input() showContryCode:boolean = false;
  @Input() label!:string;

  @Input()
  set value(value:MatMobileNumberField){
    this._value = value;
    this.parts.controls['mobileNumber']?.setValue(this._value.mobileNumber);
    this.stateChanges.next();
  }

  get value():MatMobileNumberField{
    return this._value;
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
    return this.touched && this.required && this.empty;
  }

  get empty():boolean{
    return !this.showContryCode && this._value.isEmpty();
  }

  get shouldLabelFloat():boolean{
    return this.focused || !this.empty;
  }

  setDescribedByIds(ids: string[]): void {

  }

  onContainerClick(event: MouseEvent): void {

  }

  writeValue(newVal: MatMobileNumberField): void {
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
      this.parts.controls['mobileNumber'].addValidators(Validators.required);

    this.parts.controls['mobileNumber'].valueChanges.subscribe((mobileNumber:number)=>{
      this._value.mobileNumber = mobileNumber;
      this.onChange(this.value);
    });

    this._disabled ? this.parts.disable() : this.parts.enable();
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

  @HostListener("focusin")
  onFocusIn() {
    this.focused = true;
    this.stateChanges.next();
  }
}
