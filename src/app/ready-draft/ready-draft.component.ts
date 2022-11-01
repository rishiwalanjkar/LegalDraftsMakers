import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { map, Observable } from 'rxjs';
import { ComparableConditions, DateComponents, DependentFieldConfig, Existance, PersonalInformationComponents, PersonalInformationValues, QuickEditFieldFormat, QuickEditTagInstanceType } from '../create-draft-template/create-draft-template.component';
import { MatAddressField } from '../custom-mat-form-fields/mat-address-field/mat-address-field.component';
import { MatAgeField } from '../custom-mat-form-fields/mat-age-field/mat-age-field.component';
import { MatDividedInput } from '../custom-mat-form-fields/mat-divided-input/mat-divided-input.component';
import { ImageType, MatImageUploadField } from '../custom-mat-form-fields/mat-image-upload-field/mat-image-upload-field.component';
import { DocumentType, DocumentTypeKeyWordId, Draft, DraftService } from '../draft/draft.service';
import { EditorConfig } from '../editor/editor.component';
import { Font, FontService } from '../font/font.service';
import { Language, LanguageService } from '../language/language.service';
import { JsonParsePipe } from '../main-pipe/json-parse.pipe';
import { StatusMessageService } from '../status-message/status-message.service';

enum Step{
  SEARCH_DRAFT    = "Search Draft",
  PICK_A_DRAFT    = "Pick a Draft",
  FILL_DETAILS    = "Fill details",
  VIEW_IN_EDITOR  = "View in Editor"
}

interface QuickEditTag{
  id:string;
  for:string|null;
  data:DOMStringMap;
}

@Component({
  selector: 'app-ready-draft',
  templateUrl: './ready-draft.component.html',
  styleUrls: ['./ready-draft.component.scss'],
  providers:[JsonParsePipe]
})
export class ReadyDraftComponent implements OnInit {
  private _selectedDraft:Draft|undefined;
  private _quickEditTags:QuickEditTag[]             = [];
  private _editableQuickEditTags:QuickEditTag[]     = [];
  public editorConfig:EditorConfig                  = new EditorConfig();
  public fonts!:Font[];
  public displayedColumns:string[]                  = ["pages", "name", "documentType"];
  public documentTypeFilterKeywordIds:number[]      = [];
  public searchResultDataSource                     = new MatTableDataSource<Draft>();
  public stepperOrientation!:Observable<StepperOrientation>;

  public searchDraftFormGroup:FormGroup             = this._formBuilder.group({
                                                      searchQueryControl      : ['', Validators.required],
                                                      selectedFontControl     : [''],
                                                      selectedLanguageControl : [undefined, Validators.required]
                                                    });

  public pickDraftFormGroup:FormGroup               = this._formBuilder.group({
                                                      selectedDraftControl : [undefined, Validators.required]
                                                    });

  public fillDetailsFormGroup:FormGroup             = this._formBuilder.group({});

  public step                                       = Step;
  public quickEditFieldFormat                       = QuickEditFieldFormat;
  public draftingStepIndex:number                   = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('draftingStepper') draftingStepper!: MatStepper;

  constructor(public fontService:FontService,
    public languageService:LanguageService,
    private _draftService:DraftService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _breakpointObserver:BreakpointObserver,
    private _formBuilder:FormBuilder,
    private _statusMessageService:StatusMessageService,
    private _jsonParsePipe:JsonParsePipe) {

      this.searchResultDataSource.filterPredicate = (draft:Draft, filter:string) => {
                                                    return filter == this.documentTypeFilterKeywordIds[0].toString() ? true : filter == DocumentTypeKeyWordId[Object.values(DocumentType)[draft.documentType] as any];
                                                  };

      this.stepperOrientation                     = this._breakpointObserver
                                                      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Web])
                                                      .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));

      this.editorConfig.configureAllTools();

      this.searchDraftFormGroup.controls['selectedLanguageControl'].valueChanges.subscribe((language:Language)=>{
        this.fonts = this.fontService.fetchFontsByLanguage(language);
        this.searchDraftFormGroup.controls['selectedFontControl'].setValue(this.fonts[0]);
      });

      this.searchDraftFormGroup.controls['selectedLanguageControl'].setValue(Language.ENGLISH);
  }

  get editableQuickEditTags():QuickEditTag[]{
    this._editableQuickEditTags = this._quickEditTags.filter((quickEditTag:QuickEditTag) => QuickEditTagInstanceType.ORIGINAL as any == quickEditTag.data['instanceType'] && ![QuickEditFieldFormat.DEPENDENT_FIELD, QuickEditFieldFormat.TODAY_FIELD].includes(parseInt(quickEditTag.data['format'] as string) as number) );

    for(const quickEditTag of this._editableQuickEditTags) {
      let formControl     = new FormControl(undefined, [Validators.required]),
          formControlKey  = 'formControl';

      switch(true) {
        case QuickEditFieldFormat.DIVIDED_INPUT_FIELD == quickEditTag.data['format'] as any:
          let parsedData  = JSON.parse(quickEditTag.data['dividedInput'] as string) as any;
          formControl.setValue(new MatDividedInput(parsedData.inputs, parsedData.separator));
          break;

        case QuickEditFieldFormat.LIST_FIELD == quickEditTag.data['format'] as any:
        case QuickEditFieldFormat.RADIO_FIELD == quickEditTag.data['format'] as any:
          formControl.removeValidators(Validators.required);
          formControl.setValue(this._jsonParsePipe.transform((quickEditTag.data['options']) as string)[0].output)
          break;

        case QuickEditFieldFormat.AGE_FIELD == quickEditTag.data['format'] as any:
          formControl.setValue(new MatAgeField());
          break;
  
        case QuickEditFieldFormat.PASSPORT_PHOTO_FIELD == quickEditTag.data['format'] as any:
          formControl.setValue(new MatImageUploadField(ImageType.PASSPORT_PHOTO));
          break;
  
        case QuickEditFieldFormat.ADHAR_CARD_PHOTO_FIELD == quickEditTag.data['format'] as any:
          formControl.setValue(new MatImageUploadField(ImageType.ADHAR_CARD));
          break;
  
        case QuickEditFieldFormat.FOUR_BY_SIX_PHOTO_FIELD == quickEditTag.data['format'] as any:
          formControl.setValue(new MatImageUploadField(ImageType.FOUR_BY_SIX));
          break;
  
        case QuickEditFieldFormat.FIVE_BY_SEVEN_PHOTO_FIELD == quickEditTag.data['format'] as any:
          formControl.setValue(new MatImageUploadField(ImageType.FIVE_BY_SEVEN));
          break;
        
        case QuickEditFieldFormat.ADDRESS_FIELD == quickEditTag.data['format'] as any:
          formControl.setValue(new MatAddressField());
          break;
        
        case QuickEditFieldFormat.PERSONAL_INFORMATION_FIELD == quickEditTag.data['format'] as any:
          formControlKey = "0";
          break;
        }

      this.fillDetailsFormGroup.addControl(quickEditTag.id, this._formBuilder.group({[formControlKey] : formControl}));
    }

    return this._editableQuickEditTags;
  }

  get todayQuickEditTags():QuickEditTag[]{
    return this._quickEditTags.filter((quickEditTag:QuickEditTag) => QuickEditFieldFormat.TODAY_FIELD == parseInt(quickEditTag.data['format'] as string) as number);
  }

  getDependentQuickEditTags(dependeeId:string):QuickEditTag[]{
    return this._quickEditTags.filter((quickEditTag:QuickEditTag) => (quickEditTag.for == dependeeId && (QuickEditTagInstanceType.REPEAT as any == quickEditTag.data['instanceType'] || QuickEditFieldFormat.DEPENDENT_FIELD == parseInt(quickEditTag.data['format'] as string) as number))
                                                                      || (quickEditTag.for && document.getElementById(quickEditTag.for)?.getAttribute("for") == dependeeId && (QuickEditTagInstanceType.REPEAT as any == quickEditTag.data['instanceType'] && QuickEditFieldFormat.DEPENDENT_FIELD == parseInt(quickEditTag.data['format'] as string) as number)));
  }

  get selectedLanguage():Language{
    return this.searchDraftFormGroup.controls['selectedLanguageControl'].value;
  }

  get selectedFont():Font{
    return this.searchDraftFormGroup.controls['selectedFontControl'].value;
  }

  get selectedDraft():Draft|undefined{
    return this._selectedDraft;
  }

  set selectedDraft(draft:Draft|undefined){
    this._selectedDraft         = draft;
    this.fillDetailsFormGroup   = this._formBuilder.group({});
    this._quickEditTags         = [];
    this._editableQuickEditTags = [];
    this.pickDraftFormGroup.controls['selectedDraftControl'].setValue(this._selectedDraft);
  }

  getFillDetailsControl(key:string):AbstractControl{
    return this.fillDetailsFormGroup.get(key) as AbstractControl;
  }

  setSelectedLanguage(language:Language){ 
    this.searchDraftFormGroup.controls['selectedLanguageControl'].setValue(language);
  }

  isSelectedLanguageEnglish():boolean{
    return Language.ENGLISH == this.selectedLanguage;
  }

  ngOnInit(): void {
    this.documentTypeFilterKeywordIds.push(74);
  }

  documentTypeCaption(documentType:DocumentType):string{
    let keyWordId = parseInt( DocumentTypeKeyWordId[Object.values(DocumentType)[documentType] as any] as string);

    if(!this.documentTypeFilterKeywordIds.includes(keyWordId))
      this.documentTypeFilterKeywordIds.push(keyWordId);

    return this.languageService.fetchKeyWord(keyWordId, this.selectedLanguage);
  }

  filterSearchResult(filter:string):void{
    this.searchResultDataSource.filter = filter;
    this._changeDetectorRef.detectChanges();
  }

  next(step:Step|string):void{
    switch(step){
      case Step.SEARCH_DRAFT:
        if(!this.searchDraftFormGroup.controls['searchQueryControl'].value)  {
          this._statusMessageService.error("Please enter a draft name you need to search !!");
          return;
        }

        this.searchDraft();
        this.selectedDraft = undefined;
        break;

      case Step.PICK_A_DRAFT:
        if(!this.searchResultDataSource.filteredData.includes(this._selectedDraft as Draft)) {
          this._statusMessageService.error("Please select a draft from listing to fill in !!");
          return;
        }

        this.pickADraft();

        if(!this.editableQuickEditTags.length) {
          this._statusMessageService.warn("Selected draft has nothing to fill in, skiiping the third step !!");
          this.draftingStepIndex = 3;
          return;
        }
        break;

      case Step.FILL_DETAILS:
        this.fillDetails();
        break;

      case Step.VIEW_IN_EDITOR:
        break;
    }
  }

  back(step:Step|string):void{
    switch(step){
      case Step.SEARCH_DRAFT:
        this.draftingStepper.steps.get(1)?.reset();
        this.selectedDraft = undefined;
        this.draftingStepper.steps.get(2)?.reset();
        this.draftingStepper.steps.get(3)?.reset();
        break;

      case Step.PICK_A_DRAFT:
        this.draftingStepper.steps.get(3)?.reset();
        break;

      case Step.FILL_DETAILS:
        this.draftingStepper.steps.get(3)?.reset();
        break;

      case Step.VIEW_IN_EDITOR:
        break;
    }
  }

  setFormControlValue(formControlName:string, value:any, subFormControlIndex?:number):void{
    let subControlName = (undefined == subFormControlIndex) ? 'formControl' : subFormControlIndex.toString();

    if(!(this.fillDetailsFormGroup.controls[formControlName] as FormGroup).contains(subControlName))
      (this.fillDetailsFormGroup.controls[formControlName] as FormGroup).addControl(subControlName, new FormControl(undefined, [Validators.required]));

    (this.fillDetailsFormGroup.controls[formControlName] as FormGroup).controls[subControlName].setValue(value);
  }

  removeSubFormControl(formControlName:string, subFormControlIndex:number):void{
    (this.fillDetailsFormGroup.controls[formControlName] as FormGroup).removeControl(subFormControlIndex.toString());
  }

  searchDraft():void{
    this.searchResultDataSource.data      = this._draftService.searchDraft(this.searchDraftFormGroup.controls['searchQueryControl'].value, this.selectedLanguage);
    this.searchResultDataSource.paginator = this.paginator;
    this.selectedDraft                    = undefined;
  }

  pickADraft():void{
    Array.from(document.getElementsByTagName("quick-edit")).forEach((element)=> {
                                                                      if(!this._quickEditTags.some((quickEditTag:QuickEditTag) => quickEditTag.id == element.id)) 
                                                                        this._quickEditTags.push({id:element.id, for:element.getAttribute("for"), data:(element as HTMLElement).dataset});
                                                                    });
  }

  fillDetails():void{
    for(const quickEditTag of this._editableQuickEditTags) {
      let value:string                      = "",
          formGroup:FormGroup               = this.fillDetailsFormGroup.controls[quickEditTag.id] as FormGroup,
          quickEditElement:HTMLElement      = document.getElementById(quickEditTag.id) as HTMLElement;

      if(!formGroup || !quickEditElement) continue;

      switch(true) {
        case QuickEditFieldFormat.DIVIDED_INPUT_FIELD         == quickEditTag.data['format'] as any:
        case QuickEditFieldFormat.AGE_FIELD                   == quickEditTag.data['format'] as any:
        case QuickEditFieldFormat.PASSPORT_PHOTO_FIELD        == quickEditTag.data['format'] as any:
        case QuickEditFieldFormat.ADHAR_CARD_PHOTO_FIELD      == quickEditTag.data['format'] as any:
        case QuickEditFieldFormat.FOUR_BY_SIX_PHOTO_FIELD     == quickEditTag.data['format'] as any:
        case QuickEditFieldFormat.FIVE_BY_SEVEN_PHOTO_FIELD   == quickEditTag.data['format'] as any:
        case QuickEditFieldFormat.ADDRESS_FIELD               == quickEditTag.data['format'] as any:
          value = (formGroup.controls["formControl"].value as any).toString();
          break;

        case QuickEditFieldFormat.PLAIN_DATE_FIELD            == quickEditTag.data['format'] as any:
          value = (formGroup.controls["formControl"].value as any).format("DD/MM/YYYY");
          break;

        case QuickEditFieldFormat.PERSONAL_INFORMATION_FIELD  == quickEditTag.data['format'] as any:
          let personalInfoBlock:HTMLElement     = this.createPersonalInfoBlock(quickEditTag.data, Object.keys(formGroup.controls).length, formGroup, {[PersonalInformationComponents.PERSONAL_INFORMATION]:true}),
              toltalPersonalInfoElementsCount   = document.getElementsByTagName(personalInfoBlock.tagName).length;
              personalInfoBlock.id              = personalInfoBlock.tagName.toLowerCase() + "-" + (!!toltalPersonalInfoElementsCount ? toltalPersonalInfoElementsCount : 0);

          value = personalInfoBlock.outerHTML;
          quickEditElement.parentNode?.replaceChild(personalInfoBlock, quickEditElement);

          if(!quickEditTag.data['hasSignatureTable'] || !(quickEditTag.data['signatureTableHasNameColumn'] || quickEditTag.data['signatureTableHasAddressColumn'] || quickEditTag.data['signatureTableHasPhotoColumn'])) continue;

          let signatureTableElement:HTMLTableElement  = document.querySelector("table[for='" + quickEditTag.id + "']") as HTMLTableElement;

          if(!signatureTableElement) continue;

          let numberOfColumns:number            = signatureTableElement.rows[0].cells.length;

          for(let i = 0; i < Object.keys(formGroup.controls).length; i++) {
            let trElement:HTMLTableRowElement = signatureTableElement.rows[i+1] as HTMLTableRowElement;

            if(!trElement)
              trElement = signatureTableElement.insertRow();

            for(let j = 0; j < numberOfColumns; j++){
              let cell = trElement.cells[j];

              if(!cell)
                cell = trElement.insertCell(-1);

              cell.innerHTML = quickEditTag.data['signatureTableHasNameColumn'] && (parseInt(quickEditTag.data['nameColumnNumber'] as string) - 1) == j 
                                ? formGroup.controls[i].value.name
                                  : (quickEditTag.data['signatureTableHasAddressColumn'] && (parseInt(quickEditTag.data['addressColumnNumber'] as string) - 1) == j
                                    ? formGroup.controls[i].value.address
                                      : (quickEditTag.data['signatureTableHasPhotoColumn'] && (parseInt(quickEditTag.data['photoColumnNumber'] as string) - 1) == j
                                        ? formGroup.controls[i].value.passportPhoto
                                          : ""));
            }
          }

          signatureTableElement.style.backgroundColor = "transparent";
          break;

        case QuickEditFieldFormat.TABLE_FIELD                 == quickEditTag.data['format'] as any:
          let tableElement  = document.createElement("table"),
              tHeadElement  = document.createElement("thead"),
              tBodyElement  = document.createElement("tbody");

          tableElement.classList.add("border", "break-all");
          tableElement.style.width = "100%";

          if(coerceBooleanProperty(quickEditTag.data['autoSerializable']))
            tableElement.classList.add("auto-serialize");

          tHeadElement.innerHTML = quickEditTag.data['tableHead'] as string;
          tableElement.append(tHeadElement);
          tableElement.append(tBodyElement);

          for(const row of (quickEditTag.data['dataSource'] as any).data){
            let trElement:HTMLTableRowElement = tBodyElement.insertRow();

            for(let i = 0; i < parseInt(quickEditTag.data['columns'] as string); i++) {
              let cell = trElement.insertCell(-1);
              cell.innerHTML = row[(quickEditTag.data as any).displayedColumns[i] as string];
            }
          }

          quickEditElement.parentNode?.replaceChild(tableElement, quickEditElement);
          continue;

        case QuickEditFieldFormat.DEPENDENT_FIELD             == quickEditTag.data['format'] as any:
          break;

        default :
          value = formGroup.controls["formControl"].value;
      }

      for(const dependentTag of this.getDependentQuickEditTags(quickEditTag.id)) {
        let dependentTagElement:HTMLElement|null = document.getElementById(dependentTag.id);

        if(!dependentTagElement) continue;

        switch(true) {
          case QuickEditFieldFormat.DIVIDED_INPUT_FIELD         == dependentTag.data['format'] as any:
            dependentTagElement.outerHTML = (formGroup.controls["formControl"].value as any).toString(JSON.parse(dependentTag.data['components'] as string));
            break;

          case QuickEditFieldFormat.PLAIN_DATE_FIELD            == dependentTag.data['format'] as any:
            let enabledDateComponents         = JSON.parse(dependentTag.data['components'] as string);
            dependentTagElement.outerHTML     = enabledDateComponents[DateComponents.DATE] 
                                                ? value 
                                                  : enabledDateComponents[DateComponents.DAY] && enabledDateComponents[DateComponents.MONTH] && enabledDateComponents[DateComponents.YEAR]
                                                    ? value
                                                      : enabledDateComponents[DateComponents.DAY] && enabledDateComponents[DateComponents.MONTH]
                                                        ? moment((formGroup.controls["formControl"].value as any).toString()).format("D") + " " + this.languageService.fetchMonthName(moment((formGroup.controls["formControl"].value as any).toString()).format("M"), this.selectedLanguage)
                                                          : enabledDateComponents[DateComponents.MONTH] && enabledDateComponents[DateComponents.YEAR]
                                                            ? this.languageService.fetchMonthName(moment((formGroup.controls["formControl"].value as any).toString()).format("M"), this.selectedLanguage) + " " + moment((formGroup.controls["formControl"].value as any).toString()).format("Y")
                                                              : enabledDateComponents[DateComponents.DAY]
                                                                ? moment((formGroup.controls["formControl"].value as any).toString()).format("D")
                                                                  : enabledDateComponents[DateComponents.MONTH]
                                                                    ? this.languageService.fetchMonthName(moment((formGroup.controls["formControl"].value as any).toString()).format("M"), this.selectedLanguage)
                                                                      : moment((formGroup.controls["formControl"].value as any).toString()).format("Y");
                                                                  
            break;

          case QuickEditFieldFormat.PERSONAL_INFORMATION_FIELD  == dependentTag.data['format'] as any:
            let enabledPersonalInformationComponents  = JSON.parse(dependentTag.data['components'] as string);
                dependentTag.data['inline']           = "true";

            dependentTagElement.parentNode?.replaceChild(this.createPersonalInfoBlock(dependentTag.data, Object.keys(formGroup.controls).length, formGroup, enabledPersonalInformationComponents), dependentTagElement);
            continue;

          case QuickEditFieldFormat.DEPENDENT_FIELD             == dependentTag.data['format'] as any:
            let dependentOptions:DependentFieldConfig[]  = JSON.parse(dependentTag.data['options'] as string);
            
            for(const dependentOption of dependentOptions)
              switch(true){
                case QuickEditFieldFormat.PLAIN_INPUT_FIELD == quickEditTag.data['format'] as any:
                case QuickEditFieldFormat.ADDRESS_FIELD == quickEditTag.data['format'] as any:
                  if(this.compareDependee(dependentOption.selectedCondition as ComparableConditions, dependentOption.comparableValue, value))
                    dependentTagElement.outerHTML = dependentOption.option;
                  break;

                case QuickEditFieldFormat.RADIO_FIELD == quickEditTag.data['format'] as any:
                case QuickEditFieldFormat.LIST_FIELD == quickEditTag.data['format'] as any:
                  if(this.compareDependee(dependentOption.selectedCondition as ComparableConditions, dependentOption.comparableValue, (JSON.parse(quickEditTag.data['options'] as string) as DependentFieldConfig[]).filter((element:DependentFieldConfig)=>element.output == value)[0].option))
                    dependentTagElement.outerHTML = dependentOption.option;
                  break;

                case QuickEditFieldFormat.DIVIDED_INPUT_FIELD == quickEditTag.data['format'] as any:
                  if(this.compareDependee(dependentOption.selectedCondition as ComparableConditions, dependentOption.comparableValue, (formGroup.controls["formControl"].value as any).toString({[dependentOption.selectedComponent as string]:true})))
                    dependentTagElement.outerHTML = dependentOption.option;
                  break;

                case QuickEditFieldFormat.PLAIN_DATE_FIELD == quickEditTag.data['format'] as any:

                  break;

                case QuickEditFieldFormat.AGE_FIELD == quickEditTag.data['format'] as any:

                  break;

                case QuickEditFieldFormat.PERSONAL_INFORMATION_FIELD == quickEditTag.data['format'] as any:
                  let conditionMeet     = true,
                      selectedComponent = (dependentOption.selectedComponent as string).replace(/\s+/g,'');

                  selectedComponent     = PersonalInformationComponents.PERSONAL_INFORMATION == selectedComponent ? "html" : selectedComponent[0].toLowerCase() + selectedComponent.slice(1);

                  for(const key of Object.keys(formGroup.controls)) 
                    if(Existance.DONT_EXISTS == dependentOption.comparableValue)
                      conditionMeet ||= this.compareDependee(dependentOption.selectedCondition as ComparableConditions, dependentOption.comparableValue, selectedComponent in formGroup.controls[key].value ? ("object" == typeof formGroup.controls[key].value[selectedComponent] ? formGroup.controls[key].value[selectedComponent].value : formGroup.controls[key].value[selectedComponent]) : formGroup.controls[key].value, formGroup);
                    else
                      conditionMeet &&= this.compareDependee(dependentOption.selectedCondition as ComparableConditions, dependentOption.comparableValue, selectedComponent in formGroup.controls[key].value ? ("object" == typeof formGroup.controls[key].value[selectedComponent] ? formGroup.controls[key].value[selectedComponent].value : formGroup.controls[key].value[selectedComponent]) : formGroup.controls[key].value, formGroup);
                  if(conditionMeet)
                    dependentTagElement.outerHTML = dependentOption.option;

                  break;
              }
            break;

          default:
            dependentTagElement.outerHTML = value;
        }
      }

      if(!!quickEditElement && !!quickEditElement.parentNode)
        quickEditElement.outerHTML = value;
    }

    for(const todayQuickEditTag of this.todayQuickEditTags){
      let quickEditElement:HTMLElement      = document.getElementById(todayQuickEditTag.id) as HTMLElement;

      if(!quickEditElement) continue;

      quickEditElement.outerHTML = moment().format("DD/MM/YYYY");
    }
  }

  createPersonalInfoBlock(data:any, numberOfPersons:number, formGroup:FormGroup, enabledPersonalInformationComponents:any):HTMLElement{
    let personalInfoBlock:HTMLElement     = document.createElement("personal-information"),
        inline:boolean                    = coerceBooleanProperty(data['inline']),
        olElement:HTMLOListElement,
        liElement:HTMLLIElement;

    if(1 < numberOfPersons) {
      olElement = document.createElement("ol");
      personalInfoBlock.appendChild(olElement);
    }

    for(const controlName of Object.keys(formGroup.controls)) {
      if(1 < numberOfPersons) {
        liElement = document.createElement("li");

        if(inline) {
          liElement.style.display = "inline";
          liElement.append((parseInt(controlName) + 1).toString() + ". ");
        }

        liElement.appendChild(formGroup.controls[controlName].value.html(enabledPersonalInformationComponents));
        olElement!.appendChild(liElement);
      } else {
        personalInfoBlock.appendChild(formGroup.controls[controlName].value.html(enabledPersonalInformationComponents));
      }
    }

    if(!inline){
      let container         = document.createElement("personal-information-container"),
          captionContainer  = document.createElement("div"),
          curlyElement      = document.createElement("span"),
          captionElement    = document.createElement("div");

      curlyElement.classList.add("curly");

      captionElement.style.height = "100%";
      captionElement.classList.add("grid", "c-1", "v-ac", "h-ac");
      captionElement.append(data['blockCaption'] as string);

      captionContainer.style.height = "100%";
      captionContainer.classList.add("brace-right");
      captionContainer.append(curlyElement);
      captionContainer.append(captionElement);

      container.classList.add("grid", "c-3", "cg-4", "v-ac");
      personalInfoBlock.classList.add("cs-2")
      container.append(personalInfoBlock);
      container.append(captionContainer);

      personalInfoBlock = container;
    }

    return personalInfoBlock;
  }

  compareDependee(condition:ComparableConditions, comparableValue:any, dependentValue:any, formGroup?:FormGroup):boolean{
    let result:boolean  = true;

    switch(condition){
      case ComparableConditions.EQUAL_TO:
        result &&= comparableValue == dependentValue;
        break;

      case ComparableConditions.IS:
        switch(comparableValue){
          case PersonalInformationValues.SINGULAR:
            if(!!formGroup)
              result &&= (1 == Object.keys(formGroup.controls).length);
          break;

          case PersonalInformationValues.PLURAL:
            if(!!formGroup)
              result &&= 1 < Object.keys(formGroup.controls).length;
          break;

          case Existance.EXISTS:
            result &&= !!dependentValue;
          break;

          case Existance.DONT_EXISTS:
            result &&= !dependentValue;
          break;
        }
        break;

      case ComparableConditions.GREATER_THAN:
        result = parseInt(dependentValue) > parseInt(comparableValue);
        break;

      case ComparableConditions.GREATER_THAN_OR_EQUAL_TO:
        result = parseInt(dependentValue) >= parseInt(comparableValue);
        break;

      case ComparableConditions.LESS_THAN:
        result = parseInt(dependentValue) < parseInt(comparableValue);
        break;

      case ComparableConditions.LESS_THAN_OR_EQUAL_TO:
        result = parseInt(dependentValue) <= parseInt(comparableValue);
        break;
    }

    return result;
  }
}