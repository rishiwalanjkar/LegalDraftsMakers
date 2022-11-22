import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Font } from 'src/app/font/font.service';
import { Language, LanguageService } from 'src/app/language/language.service';
import { Opaque } from '../app.component';
import { PersonalInformationComponents } from '../create-draft-template/create-draft-template.component';
import { MatAddressField } from '../custom-mat-form-fields/mat-address-field/mat-address-field.component';
import { MatAdharNumberField } from '../custom-mat-form-fields/mat-adhar-number-field/mat-adhar-number-field.component';
import { MatAgeField } from '../custom-mat-form-fields/mat-age-field/mat-age-field.component';
import { MatFatherOrHusbandNameField } from '../custom-mat-form-fields/mat-father-or-husband-name-field/mat-father-or-husband-name-field.component';
import { ImageType, MatImageUploadField } from '../custom-mat-form-fields/mat-image-upload-field/mat-image-upload-field.component';
import { MatMobileNumberField } from '../custom-mat-form-fields/mat-mobile-number-field/mat-mobile-number-field.component';
import { MatNameField } from '../custom-mat-form-fields/mat-name-field/mat-name-field.component';
import { MatOccupationField } from '../custom-mat-form-fields/mat-occupation-field/mat-occupation-field.component';
import { MatPanNumberField } from '../custom-mat-form-fields/mat-pan-number-field/mat-pan-number-field.component';

export interface PersonalInformation{
  isInline:boolean;
  name:MatNameField;
  showFatherOrHusbandNameField:boolean;
  fatherOrHusbandName:MatFatherOrHusbandNameField;
  age:MatAgeField;
  occupation:MatOccupationField;
  address:string;
  currentAddress:MatAddressField;
  isCurrentAndPermanentAddressSame:boolean;
  permanentAddress:MatAddressField;
  showMobileNumberField:boolean;
  mobileNumber:MatMobileNumberField;
  showAdharNumberField:boolean;
  adharNumber:MatAdharNumberField;
  showPanNumberField:boolean;
  panNumber:MatPanNumberField;
  showPassportPhoto:boolean;
  passportPhoto:MatImageUploadField;
  html:(enabledPersonalInformationComponents:Object)=>{};
}

@Component({
  selector: 'app-personal-info-block',
  templateUrl: './personal-info-block.component.html',
  styleUrls: ['./personal-info-block.component.scss']
})
export class PersonalInfoBlockComponent implements OnInit {
  private _required:boolean                                 = false;
  private _inline:boolean                                   = false;
  
  currentAddressLabel!:string;
  @Input() opaque!:Opaque;
  @Input() appearance:MatFormFieldAppearance                = "standard";
  @Input() language!:Language;
  @Input() font!:Font;
  @Input() label!:string;
  @Input() disabled:boolean                                 = false;
  @Input() showInlineField:boolean                          = true;
  @Input() showFatherOrHusbandNameField:boolean             = false;
  @Input() showMobileNumberField:boolean                    = false;
  @Input() showAdharNumberField:boolean                     = false;
  @Input() showPanNumberField:boolean                       = false;
  @Input() showPassportPhoto:boolean                        = false;

  
  @Input() 
  set required(required:boolean){
    this._required = required;

    Object.keys(this.form.controls).forEach(key => {
      if(['isInline', 'permanentAddress'].includes(key)) return;

      if( !this.showFatherOrHusbandNameField && 'fatherOrHusbandName' == key ) return;

      if('isCurrentAndPermanentAddressSame' == key && !!this.form.controls[key].value)
        key = 'permanentAddress';

      if('isCurrentAndPermanentAddressSame' == key) return;

      if(this._required)
        this.form.controls[key].addValidators(Validators.required);
    });
  }                       

  get required():boolean{
    return this._required;
  }

  @Input() 
  set inline(inline:boolean){
    this._inline = coerceBooleanProperty(inline);

    if(!!this.form)
      this.form.controls['isInline'].setValue(this._inline);
  }                       

  get inline():boolean{
    return this._inline;
  }

  @Output() inlineChange                                    = new EventEmitter<boolean>();
  @Output() valueChange                                     = new EventEmitter<PersonalInformation>();

  form:FormGroup                                            = new FormGroup({
                                                              isInline                          : new FormControl(this._inline),
                                                              name                              : new FormControl(new MatNameField()),
                                                              fatherOrHusbandName               : new FormControl(new MatFatherOrHusbandNameField()),
                                                              age                               : new FormControl(new MatAgeField()),
                                                              occupation                        : new FormControl(new MatOccupationField()),
                                                              currentAddress                    : new FormControl(new MatAddressField()),
                                                              isCurrentAndPermanentAddressSame  : new FormControl(true),
                                                              permanentAddress                  : new FormControl(new MatAddressField()),
                                                              mobileNumber                      : new FormControl(new MatMobileNumberField()),
                                                              adharNumber                       : new FormControl(new MatAdharNumberField()),
                                                              panNumber                         : new FormControl(new MatPanNumberField()),
                                                              passportPhoto                     : new FormControl(new MatImageUploadField(ImageType.PASSPORT_PHOTO))
                                                            });

  constructor(public languageService:LanguageService) {}

  ngOnInit(): void {
    this.currentAddressLabel = this.languageService.fetchKeyWord(53, this.language);

    this.form.controls['isInline'].valueChanges.subscribe((newVal:boolean) => {
      this._inline = newVal;
      this.inlineChange.emit(newVal);
    });

    this.form.controls['name'].valueChanges.subscribe((newVal:MatNameField)=>{
      this.form.controls['fatherOrHusbandName'].value.firstNameInput.value  = newVal.middleNameInput.value;
      this.form.controls['fatherOrHusbandName'].value.lastNameInput.value   = newVal.lastNameInput.value;
      this.form.controls['fatherOrHusbandName'].value.isFather              = ( this.languageService.fetchKeyWord(newVal.titleKeywordIds[0], this.language) == newVal.selectedTitle || this.languageService.fetchKeyWord(newVal.titleKeywordIds[2], this.language) == newVal.selectedTitle) ? true : false;

      this.form.controls['fatherOrHusbandName'].value.setPrefix(this.languageService.fetchKeyWord( ( this.languageService.fetchKeyWord(newVal.titleKeywordIds[0], this.language) == newVal.selectedTitle ) 
                                                                  ? 54 
                                                                    : (this.languageService.fetchKeyWord(48, this.language) == this.form.controls['fatherOrHusbandName'].value.selectedRelation)
                                                                      ? 55
                                                                        : 56, this.language));

      this.form.controls['fatherOrHusbandName'].value.setSuffix(this.languageService.fetchKeyWord( ( this.languageService.fetchKeyWord(newVal.titleKeywordIds[0], this.language) == newVal.selectedTitle ) 
                                                                  ? 57 
                                                                    : (this.languageService.fetchKeyWord(48, this.language) == this.form.controls['fatherOrHusbandName'].value.selectedRelation)
                                                                      ? 58
                                                                        : 59, this.language));

      this.form.controls['fatherOrHusbandName'].setValue(this.form.controls['fatherOrHusbandName'].value);
    });

    this.form.controls['isCurrentAndPermanentAddressSame'].valueChanges.subscribe((isCurrentAndPermanentAddressSame:boolean)=>{
      this.currentAddressLabel = this.languageService.fetchKeyWord(isCurrentAndPermanentAddressSame ? 53 : 27, this.language);
      this.form.controls['currentAddress'].value.setLabel(this.currentAddressLabel);
    });

    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].valueChanges.subscribe(() => this.emitValueChange());
    });
  }

  emitValueChange():void{
    let personalInformation:PersonalInformation = new Object() as PersonalInformation;

    Object.keys(this.form.controls).forEach(key => {
      personalInformation = {...personalInformation, ...{[key]:this.form.controls[key].value}};

      if('permanentAddress' == key && this.form.controls['isCurrentAndPermanentAddressSame'].value) 
        personalInformation['permanentAddress'] = personalInformation['currentAddress'];
    });

    personalInformation['address']                      = this.form.controls['isCurrentAndPermanentAddressSame'].value 
                                                          ? personalInformation['currentAddress'].toString()
                                                            : personalInformation['currentAddress'].toString() + personalInformation['permanentAddress'].toString();
    personalInformation['isInline']                     = this._inline;
    personalInformation['showFatherOrHusbandNameField'] = this.showFatherOrHusbandNameField;
    personalInformation['showMobileNumberField']        = this.showMobileNumberField;
    personalInformation['showAdharNumberField']         = this.showAdharNumberField;
    personalInformation['showPanNumberField']           = this.showPanNumberField;
    personalInformation['showPassportPhoto']            = this.showPassportPhoto;

    personalInformation['html']                         = (enabledPersonalInformationComponents:any):DocumentFragment => {
                                                            let documentFragment = document.createDocumentFragment();
                                                        
                                                            if(!!personalInformation.name.value && (enabledPersonalInformationComponents[PersonalInformationComponents.PERSONAL_INFORMATION] || enabledPersonalInformationComponents[PersonalInformationComponents.Name])) {
                                                              documentFragment.appendChild(document.createTextNode(personalInformation.name.toString() + (personalInformation.showFatherOrHusbandNameField ? " " + personalInformation.fatherOrHusbandName.toString() : "")));
                                                              if(!personalInformation.isInline) documentFragment.appendChild(document.createElement('br'));
                                                            }
                                                        
                                                            if(!!personalInformation.age.value || personalInformation.occupation.value){
                                                              if(enabledPersonalInformationComponents[PersonalInformationComponents.PERSONAL_INFORMATION] || enabledPersonalInformationComponents[PersonalInformationComponents.AGE]) 
                                                              documentFragment.appendChild(document.createTextNode(personalInformation.age.toString()));
                                                            
                                                              if(enabledPersonalInformationComponents[PersonalInformationComponents.PERSONAL_INFORMATION] || enabledPersonalInformationComponents[PersonalInformationComponents.OCCUPATION]) 
                                                                documentFragment.appendChild(document.createTextNode(personalInformation.occupation.toString()));

                                                              if(enabledPersonalInformationComponents[PersonalInformationComponents.PERSONAL_INFORMATION] || enabledPersonalInformationComponents[PersonalInformationComponents.AGE] || enabledPersonalInformationComponents[PersonalInformationComponents.OCCUPATION])
                                                                if(!personalInformation.isInline) documentFragment.appendChild(document.createElement('br'));
                                                            }

                                                            if(!!personalInformation.address && (enabledPersonalInformationComponents[PersonalInformationComponents.PERSONAL_INFORMATION] || enabledPersonalInformationComponents[PersonalInformationComponents.ADDRESS])) {
                                                              documentFragment.appendChild(document.createTextNode(personalInformation.address.toString()));
                                                              if(!personalInformation.isInline) documentFragment.appendChild(document.createElement('br'));
                                                            }

                                                            if(!!personalInformation.mobileNumber.value && (enabledPersonalInformationComponents[PersonalInformationComponents.PERSONAL_INFORMATION] || (enabledPersonalInformationComponents[PersonalInformationComponents.MOBILE_NUMBER] && personalInformation.showMobileNumberField))) {
                                                              documentFragment.appendChild(document.createTextNode(personalInformation.mobileNumber.toString()));
                                                              if(!personalInformation.isInline) documentFragment.appendChild(document.createElement('br'));
                                                            }

                                                            if(!!personalInformation.adharNumber.value && (enabledPersonalInformationComponents[PersonalInformationComponents.PERSONAL_INFORMATION] || (enabledPersonalInformationComponents[PersonalInformationComponents.ADHAR_NUMBER] && personalInformation.showAdharNumberField))) {
                                                              documentFragment.appendChild(document.createTextNode(personalInformation.adharNumber.toString()));
                                                              if(!personalInformation.isInline) documentFragment.appendChild(document.createElement('br'));
                                                            }

                                                            if(personalInformation.panNumber.value && (enabledPersonalInformationComponents[PersonalInformationComponents.PERSONAL_INFORMATION] || (enabledPersonalInformationComponents[PersonalInformationComponents.PAN_NUMBER] && personalInformation.showPanNumberField))) {
                                                              documentFragment.appendChild(document.createTextNode(personalInformation.panNumber.toString()));
                                                            }

                                                            return documentFragment;
                                                          };                             

    this.valueChange.emit(personalInformation);
  }
}
