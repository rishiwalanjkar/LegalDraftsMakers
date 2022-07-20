import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormBuilder, NgControl } from '@angular/forms';
import { MatFormFieldAppearance, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';

export class MatAgeField{
  public birthDate:Date = new Date(1990, 1, 1)

  constructor(birthDate?:Date){
    if(!!birthDate)
      this.birthDate = birthDate;
  }

  setDate(date:string|Date){
    this.birthDate = ( date instanceof Date )? date : new Date(date);
  }

  get age():number{
    let today:Date              = new Date(),
        age:number              = today.getFullYear() - this.birthDate.getFullYear(),
        monthDifference:number  = today.getMonth() - this.birthDate.getMonth();

    if(monthDifference < 0 || (0 == monthDifference && today.getDate() < this.birthDate.getDate()))
      age--;

    return age;
  }
}

@Component({
  selector: 'app-mat-age-field',
  templateUrl: './mat-age-field.component.html',
  styleUrls: ['./mat-age-field.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: MatAgeFieldComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  }

})
export class MatAgeFieldComponent implements MatFormFieldControl<MatAgeField>, ControlValueAccessor, OnInit {
  static instanceCounter:number     = 0;
  private _value!: MatAgeField;
  stateChanges                      = new Subject<void>();
  @HostBinding() id: string         = `app-mat-age-field-${MatAgeFieldComponent.instanceCounter++}`;
  placeholder: string               = "Select Birth Date";
  _focused: boolean                 = false;
  touched:boolean                   = false;
  empty: boolean                    = false;
  shouldLabelFloat: boolean         = this._focused;
  _required: boolean                = false;
  _disabled: boolean                = false;
  errorState: boolean               = false;
  onChange                          = (param:any) => {};
  onTouched                         = () => {};

  @Input() 
  appearance:MatFormFieldAppearance = "standard";

  @Input() 
  label:string                      = "Age";


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
    this.stateChanges.next();
  }

  constructor(private _elementRef: ElementRef<HTMLElement>, 
    @Optional() @Self() public ngControl:NgControl) { 
    if(this.ngControl != null)
      this.ngControl.valueAccessor = this;
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
    // throw new Error('Method not implemented.');
  }

  onContainerClick(event: MouseEvent): void {
    this.focused = true;
    this.stateChanges.next();
  }

  ngOnInit(): void {
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

}
