import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subject } from 'rxjs';

export class MatAgeField{
  private _label!:string;
  private _birthDate!:Moment;
  private _age:string       = "";
  
  set birthDate(date:string|Moment){
    this._birthDate = ( "string" == typeof date )? moment(date): date;
  }

  set age(age:string){
    this._age = parseInt(age).toString();
  }

  get age():string{
    if(!this._birthDate) return !this._age.length ? "" : this._age;

    this._age = moment().diff(this._birthDate, 'years', false).toString();

    return this._age;
  }
    
  get value():string{
    return this.age;
  }

  setLabel(label:string):void{
    this._label = label;
  }

  toString():string{
    return (!!this._label && !!this.age) ? this._label + " : " + this.age + " " : "";
  }
}

@Component({
  selector: 'custom-mat-age-field',
  templateUrl: './mat-age-field.component.html',
  styleUrls: ['./mat-age-field.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: MatAgeFieldComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id'
  }

})
export class MatAgeFieldComponent implements MatFormFieldControl<MatAgeField>, ControlValueAccessor, OnInit {
  static instanceCounter:number     = 0;
  private _value: MatAgeField       = new MatAgeField();
  stateChanges                      = new Subject<void>();
  @HostBinding() id: string         = `custom-mat-age-field-${MatAgeFieldComponent.instanceCounter++}`;
  placeholder: string               = "Select Birth Date";
  private _focused: boolean         = false;
  private touched:boolean           = false;
  private _required: boolean        = false;
  private _disabled: boolean        = false;
  private onChange                  = (param:any) => {};
  private onTouched                 = () => {};
  parts:FormGroup                   = this._formBuilder.group({});;                             

  constructor(private _formBuilder: FormBuilder,
    private _elementRef: ElementRef<HTMLElement>, 
    @Optional() @Self() public ngControl:NgControl) {  

    if(this.ngControl != null)
      this.ngControl.valueAccessor = this;
  }

  @Input() label!:string;

  @Input()
  get value():MatAgeField{
    return this._value;
  }

  set value(matAgeField:MatAgeField){
    this._value = matAgeField;
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
  get required(): boolean{
    return this._required;
  };

  set required(required:boolean){
    this._required = required;
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean{
    return this._disabled;
  };

  set disabled(value:BooleanInput){
    this._disabled = coerceBooleanProperty(value);
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }

  get empty():boolean{
    return 0 == this.value.age.length;
  }

  get shouldLabelFloat():boolean{
    return this.focused || !this.empty;
  }

  get errorState():boolean{
    this.ngControl.control!.setErrors(this.parts.controls['age'].errors);

    return this.touched && this.parts.controls['age'].invalid;
  }

  writeValue(newValue: MatAgeField): void {
    this.value = newValue;
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
    
  }

  ngOnInit(): void {
    this.value.setLabel(this.label);

    let age       = new FormControl(),
        birthDate = new FormControl();

    age.valueChanges.subscribe(( newAge:string ) => {
      this._value.age = newAge;
      this.onChange(this._value);
      this.ngControl.control!.setErrors(age.errors);
    });

    birthDate.valueChanges.subscribe(( newDate:Moment ) => {
      this._value.birthDate = newDate;
      age.setValue(this._value.age);
      this.onChange(this._value);
    });

    if(this.required)
      age.addValidators(Validators.required);

    this.parts.addControl('age', age);
    this.parts.addControl('birthDate', birthDate);
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
