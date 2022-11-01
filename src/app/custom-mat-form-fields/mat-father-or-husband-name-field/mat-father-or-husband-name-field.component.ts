import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { Font } from 'src/app/font/font.service';
import { Language, LanguageService } from 'src/app/language/language.service';
import { InputType, MatDividedInput, MatDividedInputConstituent } from '../mat-divided-input/mat-divided-input.component';

export class MatFatherOrHusbandNameField{
  private _prefix:string                      = "";
  private _suffix:string                      = "";
  titleKeywordIds:number[]                    = [29, 33];
  private _relationKeywordIds:number[]        = [48, 49];
  isFather                                    = false;
  selectedTitle:string                        = "";
  selectedRelation:string                     = "";

  firstNameInput:MatDividedInputConstituent   = new MatDividedInputConstituent("", 42, InputType.TEXT, 2, 20, 8);
  middleNameInput:MatDividedInputConstituent  = new MatDividedInputConstituent("", 43, InputType.TEXT, 2, 20, 8);
  lastNameInput:MatDividedInputConstituent    = new MatDividedInputConstituent("", 44, InputType.TEXT, 2, 20, 8);
  nameInput:MatDividedInput                   = new MatDividedInput([this.firstNameInput, this.middleNameInput, this.lastNameInput], " ");

  get relationKeywordIds():number[]{
    return this.isFather ? this._relationKeywordIds.slice(0, 1) : this._relationKeywordIds;
  }
  
  get value():string{
    return this.selectedTitle + " " + this.nameInput.toString();
  }

  setPrefix(prefix:string):void{
    this._prefix = prefix;
  }

  setSuffix(suffix:string):void{
    this._suffix = suffix;
  }

  toString():string{
    return this._prefix + this.selectedTitle + " " + this.nameInput.toString() + " " + this._suffix;
  }

  isEmpty():boolean{
    return 0 == this.selectedTitle.length && this.nameInput.isEmpty();
  }
}

@Component({
  selector: 'custom-mat-father-or-husband-name-field',
  templateUrl: './mat-father-or-husband-name-field.component.html',
  styleUrls: ['./mat-father-or-husband-name-field.component.scss'],
  providers:[{provide:MatFormFieldControl, useExisting:MatFatherOrHusbandNameFieldComponent}],
  host: {
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]': 'id',
  }
})
export class MatFatherOrHusbandNameFieldComponent implements MatFormFieldControl<MatFatherOrHusbandNameField>, ControlValueAccessor, OnInit {
  private static instanceCounter    = 0;
  _value!: MatFatherOrHusbandNameField;
  stateChanges                      = new Subject<void>();
  @HostBinding() id: string         = `custom-mat-father-or-husband-name-field-${MatFatherOrHusbandNameFieldComponent.instanceCounter++}`;
  placeholder: string               = "";
  focused: boolean                  = false;
  touched: boolean                  = false;
  _required: boolean                = false;
  _disabled: boolean                = false;
  onChange                          = (param:any)=>{};
  onTouched                         = ()=>{};
  parts                             = new FormGroup({
                                      relationList: new FormControl(),
                                      titleList: new FormControl(),
                                      name : new FormControl()
                                    });

  constructor(private _elementRef:ElementRef,
    @Optional() @Self() public ngControl:NgControl,
    public languageService:LanguageService) { 

      if(this.ngControl != null)
        this.ngControl.valueAccessor = this;
  }

  @Input() font!:Font;
  @Input() language!:Language;

  @Input()
  get value():MatFatherOrHusbandNameField{
    return this._value;
  }

  set value(value:MatFatherOrHusbandNameField){
    this._value = value;
    this.parts.controls['relationList']?.setValue(this.languageService.fetchKeyWord(this.value.relationKeywordIds[0], this.language));
    this.parts.controls['titleList']?.setValue(this.languageService.fetchKeyWord(this.value.titleKeywordIds[0], this.language));
    this.parts.controls['name']?.setValue(this._value.nameInput);
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
    return this.touched && this.parts.controls['name'].invalid;
  }

  setDescribedByIds(ids: string[]): void {

  }

  onContainerClick(event: MouseEvent): void {

  }

  writeValue(newVal: MatFatherOrHusbandNameField): void {
    this.value = newVal;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  ngOnInit(): void {
    if(this.required)
      this.parts.controls['name'].addValidators(Validators.required);

    this.parts.controls['relationList'].valueChanges.subscribe((relation:string)=>{
      this._value.selectedRelation = relation;
      this.onChange(this._value);
    });

    this.parts.controls['titleList'].valueChanges.subscribe((title:string)=>{
      this._value.selectedTitle = title;
      this.onChange(this._value);
    });

    this.parts.controls['name'].valueChanges.subscribe((nameInput:MatDividedInput)=>{
      this._value.nameInput = nameInput;
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