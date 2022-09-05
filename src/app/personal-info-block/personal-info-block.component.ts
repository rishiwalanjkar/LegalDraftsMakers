import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldAppearance } from '@angular/material/form-field';
import { Font } from 'src/app/font/font.service';
import { Language, LanguageService } from 'src/app/language/language.service';
import { MatAddressField, MatAddressFieldComponent } from '../custom-mat-form-fields/mat-address-field/mat-address-field.component';
import { MatAdharNumberField } from '../custom-mat-form-fields/mat-adhar-number-field/mat-adhar-number-field.component';
import { MatAgeField } from '../custom-mat-form-fields/mat-age-field/mat-age-field.component';
import { MatFatherOrHusbandNameField } from '../custom-mat-form-fields/mat-father-or-husband-name-field/mat-father-or-husband-name-field.component';
import { ImageType, MatImageUploadField } from '../custom-mat-form-fields/mat-image-upload-field/mat-image-upload-field.component';
import { MatMobileNumberField } from '../custom-mat-form-fields/mat-mobile-number-field/mat-mobile-number-field.component';
import { MatNameField } from '../custom-mat-form-fields/mat-name-field/mat-name-field.component';
import { MatOccupationField } from '../custom-mat-form-fields/mat-occupation-field/mat-occupation-field.component';
import { MatPanNumberField } from '../custom-mat-form-fields/mat-pan-number-field/mat-pan-number-field.component';

@Component({
  selector: 'app-personal-info-block',
  templateUrl: './personal-info-block.component.html',
  styleUrls: ['./personal-info-block.component.scss']
})
export class PersonalInfoBlockComponent implements OnInit {
  currentAddressLabel!:string;
  @Input() appearance:MatFormFieldAppearance                = "standard";
  @Input() language!:Language;
  @Input() font!:Font;
  @Input() label!:string;
  @Input() required:boolean                                 = false;
  @Input() disabled:boolean                                 = false;
  @Input() showFatherOrHusbandNameField:boolean             = false;
  @Input() showMobileNumberField:boolean                    = false;
  @Input() showAdharNumberField:boolean                     = false;
  @Input() showPanNumberField:boolean                       = false;
  @Input() showPassportPhoto:boolean                        = false;

  private _inline:boolean                                   = false;

  @Input() 
  set inline(inline:boolean){
    this._inline = inline;

    if(!!this.form)
      this.form.controls['isInline'].setValue(inline);
  }                       

  get inline():boolean{
    return this._inline;
  }

  @Output() inlineChange                                    = new EventEmitter<boolean>();
  @Output() htmlChange                                      = new EventEmitter<DocumentFragment>();
  @Output() nameChange                                      = new EventEmitter<string>();
  @Output() addressChange                                   = new EventEmitter<string>();
  @Output() passportPhotoChange                             = new EventEmitter<string>();

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

    this.form.controls['isInline'].valueChanges.subscribe((newVal:boolean)=>{
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
      this.form.controls[key].valueChanges.subscribe(() => this.emitHtml());

      if('name' == key)
        this.form.controls[key].valueChanges.subscribe(() => this.emitName());

      if(['currentAddress', 'isCurrentAndPermanentAddressSame', 'permanentAddress'].includes(key))
        this.form.controls[key].valueChanges.subscribe(() => this.emitAddress());

      if('passportPhoto' == key)
        this.form.controls[key].valueChanges.subscribe(() => this.emitPassportPhoto());
    });
  }

  emitHtml():void{
    let documentFragment = document.createDocumentFragment();

    Object.keys(this.form.controls).forEach(key => {
      if(['isInline', 'isCurrentAndPermanentAddressSame', 'passportPhoto'].includes(key)) return;

      if( !this.showFatherOrHusbandNameField && 'fatherOrHusbandName' == key ) return;

      if( this.form.controls['isCurrentAndPermanentAddressSame'].value && 'permanentAddress' == key ) return;

      if(!(this.form.controls[key].value).toString().trim().length) return;

      documentFragment.appendChild(document.createTextNode((this.form.controls[key].value).toString()));

      if(!this.form.controls['isInline'].value && 'age' != key)
        documentFragment.appendChild(document.createElement('br'));
    });

    this.htmlChange.emit(documentFragment)
  }

  emitName():void{
    this.nameChange.emit((this.form.controls['name'].value).toString());
  }

  emitAddress():void{
    this.addressChange.emit(( this.form.controls['isCurrentAndPermanentAddressSame'].value ) 
                              ? (this.form.controls['currentAddress'].value).toString() 
                                : (this.form.controls['currentAddress'].value).toString() + (this.form.controls['permanentAddress'].value).toString()
                          );
  }

  emitPassportPhoto():void{
    this.passportPhotoChange.emit((this.form.controls['passportPhoto'].value).toString());
  }
}
