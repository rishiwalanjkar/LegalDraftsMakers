import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, HostBinding, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { MatFormFieldAppearance, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { Font, FontService } from 'src/app/font/font.service';
import { Language, LanguageService } from 'src/app/language/language.service';
import { InputType, MatDividedInput, MatDividedInputConstituent } from '../mat-divided-input/mat-divided-input.component';
import { AddressService, District, State, SubDistrict, Village} from './address.service';

export class MatAddressField{
  private _label!:string;
  protected _language!:Language;
  protected _languageService!:LanguageService;

  selectedState!:State;
  selectedDistrict!:District;
  selectedSubDistrict!:SubDistrict;
  selectedVillage!:Village;
  addressLine:string            = "";
  landmark:string               = "";

  pinCodeFirstHalfInput         = new MatDividedInputConstituent("", 25, InputType.NUMBER, 1, 999, 3);
  pinCodeSecondHalfInput        = new MatDividedInputConstituent("", 26, InputType.NUMBER, 1, 999, 3);
  pinCodeInput:MatDividedInput  = new MatDividedInput([this.pinCodeFirstHalfInput, this.pinCodeSecondHalfInput], " ");
  pinCode:string      = "";
   
  get value():string{
    return (!this._languageService || "undefined" == typeof this._language || !this._label || !this.selectedVillage || !this.selectedSubDistrict || !this.selectedDistrict || !this.selectedState)
            ? ""
              : this.addressLine + ", " 
                + ((0 < this.landmark.length) ? this.landmark + ", " : "")
                + this._languageService.fetchKeyWord(this.selectedVillage.keyWordId, this._language) + " "
                + this._languageService.fetchKeyWord(51, this._language)
                + this._languageService.fetchKeyWord(this.selectedSubDistrict.keyWordId, this._language) + " "
                + this._languageService.fetchKeyWord(52, this._language)
                + this._languageService.fetchKeyWord(this.selectedDistrict.keyWordId, this._language) + " "
                + this._languageService.fetchKeyWord(16, this._language) + " : "
                + this._languageService.fetchKeyWord(this.selectedState.keyWordId, this._language)
                + ", "
                + this.pinCodeInput.toString()
                + " ";
  }

  setLabel(label:string):void{
    this._label = label;
  }

  setLanguage(language:Language) {
    this._language = language;
  }

  setLanguageService(languageService:LanguageService) {
    this._languageService = languageService;
  }
  
  toString() : string{
    return (!this._languageService || "undefined" == typeof this._language || !this._label || !this.selectedVillage || !this.selectedSubDistrict || !this.selectedDistrict || !this.selectedState)
            ? ""
              : this._label + " : " 
                + this.addressLine + ", " 
                + ((0 < this.landmark.length) ? this.landmark + ", " : "")
                + this._languageService.fetchKeyWord(this.selectedVillage.keyWordId, this._language) + " "
                + this._languageService.fetchKeyWord(51, this._language)
                + this._languageService.fetchKeyWord(this.selectedSubDistrict.keyWordId, this._language) + " "
                + this._languageService.fetchKeyWord(52, this._language)
                + this._languageService.fetchKeyWord(this.selectedDistrict.keyWordId, this._language) + " "
                + this._languageService.fetchKeyWord(16, this._language) + " : "
                + this._languageService.fetchKeyWord(this.selectedState.keyWordId, this._language)
                + ", "
                + this.pinCodeInput.toString()
                + " ";
  }
}

@Component({
  selector: 'custom-mat-address-field',
  templateUrl: './mat-address-field.component.html',
  styleUrls: ['./mat-address-field.component.scss'],
  providers:[{provide:MatFormFieldControl, useExisting:MatAddressFieldComponent}],
  host:{
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]' : 'id'
  }
})
export class MatAddressFieldComponent implements MatFormFieldControl<MatAddressField>, ControlValueAccessor, OnInit {
  private static instanceCounter:number = 0;
  private _value: MatAddressField      = new MatAddressField();
  stateChanges                          = new Subject<void>();
  @HostBinding() id: string             = `custom-mat-address-field-${MatAddressFieldComponent.instanceCounter++}`;
  placeholder: string                   = "";
  _focused: boolean                     = false;
  touched:boolean                       = false
  _required: boolean                    = false;
  _disabled: boolean                    = false;
  onChange                              = (param:any) => {};
  onTouched                             = () => {};
  parts:FormGroup                       = this._formBuilder.group({});

  @Input() 
  appearance:MatFormFieldAppearance     = "standard";

  @Input() language!:Language;
  @Input() font!:Font;
  @Input() label!:string;
  
  constructor(private _formBuilder:FormBuilder,
    @Optional() @Self() public ngControl:NgControl,
    public addressService:AddressService,
    public fontService:FontService,
    public languageService:LanguageService) {

      if(this.ngControl != null)
        this.ngControl.valueAccessor = this;
  }

  writeValue(newValue: any): void {
    this.value = newValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @Input()
  get value(): MatAddressField {
    return this._value;
  }

  set value(value:MatAddressField){
    this._value = value;
    this.stateChanges.next();
  }

  @Input()
  get focused(): boolean {
    return this._focused;
  }

  set focused(focused:boolean){
    this._focused = coerceBooleanProperty(focused);
    this.stateChanges.next();
  }

  @Input()
  get required(): boolean {
    return this._required;
  }

  set required(required:boolean){
    this._required = coerceBooleanProperty(required);
    this.stateChanges.next();
  }

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(disabled:boolean){
    this._disabled = coerceBooleanProperty(disabled);
    this._disabled ? this.parts.disable() : this.parts.enable()
    this.stateChanges.next(); 
  }

  get empty(): boolean{
    return this.touched 
            && 0 == this.parts.controls['state'].value.length
            && 0 == this.parts.controls['district'].value.length
            && 0 == this.parts.controls['sub_district'].value.length
            && 0 == this.parts.controls['village'].value.length
            && 0 == this.parts.controls['address_line'].value.length;
  }

  get shouldLabelFloat(): boolean{
    return this.focused || !this.empty;
  };

  get errorState(): boolean {
    return this.touched && this.parts.invalid;
  };
  
  setDescribedByIds(ids: string[]): void {

  }

  onContainerClick(event: MouseEvent): void {

  }

  ngOnInit(): void {
    this.value.setLabel(this.label);
    this.value.setLanguage(this.language);
    this.value.setLanguageService(this.languageService);

    let state                         = new FormControl(this.value.selectedState),
        district                      = new FormControl(this.value.selectedDistrict),
        subDistrict                   = new FormControl(this.value.selectedSubDistrict),
        village                       = new FormControl(this.value.selectedVillage),
        addressLine                   = new FormControl(this.value.addressLine),
        landmark                      = new FormControl(this.value.landmark),
        pinCode                       = new FormControl(this.value.pinCodeInput);
    
    if(this.required) {
      state.addValidators(Validators.required);
      district.addValidators(Validators.required);
      subDistrict.addValidators(Validators.required);
      village.addValidators(Validators.required);
      addressLine.addValidators(Validators.required);
    }

    state.valueChanges.subscribe((state:State)=>{
      this._value.selectedState = state;
      this.onChange(this.value);
    });

    district.valueChanges.subscribe((districtue:District)=>{
      this._value.selectedDistrict = districtue;
      this.onChange(this.value);
    });

    subDistrict.valueChanges.subscribe((subDistrict:SubDistrict)=>{
      this._value.selectedSubDistrict = subDistrict;
      this.onChange(this.value);
    });

    village.valueChanges.subscribe((village:Village)=>{
      this._value.selectedVillage = village;
      this.onChange(this.value);
    });

    addressLine.valueChanges.subscribe((addressLine:string)=>{
      this._value.addressLine = addressLine;
      this.onChange(this.value);
    });

    landmark.valueChanges.subscribe((landmark:string)=>{
      this._value.landmark = landmark;
      this.onChange(this.value);
    });

    pinCode.valueChanges.subscribe((pinCode:MatDividedInput)=>{
      this._value.pinCode = pinCode.toString();
      this.onChange(this.value);
    });

    this.parts.addControl('state', state);
    this.parts.addControl('district', district);
    this.parts.addControl('subDistrict', subDistrict);
    this.parts.addControl('village', village);
    this.parts.addControl('addressLine', addressLine);
    this.parts.addControl('landmark', landmark);
    this.parts.addControl('pinCode', pinCode);
  }

}
