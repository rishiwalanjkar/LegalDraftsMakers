import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, ElementRef, HostBinding, HostListener, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, FormGroup, NgControl, Validators } from '@angular/forms';
import { MatFormFieldAppearance, MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { Language, LanguageService } from 'src/app/language/language.service';
import { Occupation, OccupationService } from './occupation.service';


export class MatOccupationField{
  private _language!:Language;
  private _languageService!:LanguageService;
  selectedOccupation!:Occupation;
     
  get value():string{
    return (!this._languageService || "undefined" == typeof this._language || !this.selectedOccupation)
            ? ""
              : this._languageService.fetchKeyWord(this.selectedOccupation.keyWordId, this._language);
  }

  setLanguage(language:Language) {
    this._language = language;
  }

  setLanguageService(languageService:LanguageService) {
    this._languageService = languageService;
  }
  
  toString() : string{
    return (!this._languageService || "undefined" == typeof this._language || !this.selectedOccupation)
            ? ""
              : this._languageService.fetchKeyWord(8, this._language)
                + " : "
                + this._languageService.fetchKeyWord(this.selectedOccupation.keyWordId, this._language)
                + " ";
  }
}

@Component({
  selector: 'custom-mat-occupation-field',
  templateUrl: './mat-occupation-field.component.html',
  styleUrls: ['./mat-occupation-field.component.scss'],
  providers: [{provide: MatFormFieldControl, useExisting: MatOccupationFieldComponent}],
  host:{
    '[class.example-floating]': 'shouldLabelFloat',
    '[id]' : 'id'
  }
})
export class MatOccupationFieldComponent implements MatFormFieldControl<MatOccupationField>, ControlValueAccessor, OnInit {
  static instanceCounter:number         = 0;

  private _value!: MatOccupationField;
  stateChanges                          = new Subject<void>();
  @HostBinding() id: string             = `custom-mat-occupation-field-${MatOccupationFieldComponent.instanceCounter++}`;
  placeholder: string                   = "Select Occupation";
  private _focused: boolean             = false;
  touched:boolean                       = false;
  private _required: boolean            = false;
  private _disabled: boolean            = false;
  private onChange                      = (param:any)=>{};
  private onTouched                     = ()=>{}
  parts:FormGroup                       = this._formBuilder.group({});

  @Input() 
  appearance:MatFormFieldAppearance = "standard";

  @Input() language!:Language;

  constructor(private _elementRef: ElementRef<HTMLElement>, 
    private _formBuilder: FormBuilder,
    @Optional() @Self() public ngControl:NgControl,
    public occupationService:OccupationService,
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
  get value():MatOccupationField{
    return this._value;
  }

  set value(value:MatOccupationField){
    this._value = value;
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
  }

  get empty():boolean{
    return !this.value.selectedOccupation;
  }

  get shouldLabelFloat():boolean{
    return this.focused || !this.empty;
  }

  get errorState():boolean{
    return this.touched && this.parts.invalid;
  }

  @Input()
  get disabled(): boolean{
    return this._disabled;
  };

  set disabled(disabled:boolean){
    this._disabled = coerceBooleanProperty(disabled);
    this._disabled ? this.parts.disable() : this.parts.enable();
  }

  setDescribedByIds(ids: string[]): void {

  }

  onContainerClick(event: MouseEvent): void {
    
  }

  ngOnInit(): void {
    this.value.setLanguage(this.language);
    this.value.setLanguageService(this.languageService);

    let occupationList = new FormControl();

    if(this.required)
      occupationList.addValidators(Validators.required);

    occupationList.valueChanges.subscribe((newValue:Occupation)=>{
      this._value.selectedOccupation = newValue;
      this.onChange(this._value);
    });

    this.parts.addControl('list', occupationList);

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
    if(!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }
}
