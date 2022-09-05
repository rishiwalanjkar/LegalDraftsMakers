import { Plural } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ImageType } from '../custom-mat-form-fields/mat-image-upload-field/mat-image-upload-field.component';
import { EditorConfig } from '../editor/editor.component';
import { BlockToolGroup, FileToolGroup, HomeToolGroup, LayoutToolGroup, SelectTool, TableToolGroup, Tool, ToolCommand, ToolGroup } from '../editor/tool-bar/tools/tool-bar';
import { Font, FontService } from '../font/font.service';
import { Language, LanguageService } from '../language/language.service';

enum Tab{
  LABEL,
  CHOICE,
  DATE,
  PHOTO,
  BLOCK
}

export enum QuickEditTagInstanceType{
  ORIGINAL,
  REPEAT
}

export enum QuickEditFieldFormat{
  PLAIN_INPUT_FIELD,
  DIVIDED_INPUT_FIELD,
  RADIO_FIELD,
  LIST_FIELD,
  DEPENDENT_FIELD,
  TODAY_FIELD,
  PLAIN_DATE_FIELD,
  AGE_FIELD,
  PASSPORT_PHOTO_FIELD,
  ADHAR_CARD_PHOTO_FIELD,
  FOUR_BY_SIX_PHOTO_FIELD,
  FIVE_BY_SEVEN_PHOTO_FIELD,
  PERSONAL_INFORMATION_FIELD,
  TABLE_FIELD,
  ADDRESS_FIELD
}

export enum PersonalInformationComponents{
  PERSONAL_INFORMATION  = "Personal Information", 
  Name                  = "Name", 
  AGE                   = "Age", 
  OCCUPANCY             = "Occupancy", 
  ADDRESS               = "Address", 
  MOBILE_NUMBER         = "Mobile Number", 
  ADHAR_NUMBER          = "Adhar Number", 
  PAN_NUMBER            = "Pan Number", 
  PASSPORT_PHOTO        = "Passport Photo"
}

export enum DateComponents{
  DAY   = "Day", 
  MONTH = "Month", 
  YEAR  = "Year", 
  DATE  = "Date"
}

export enum DividedInputComponents{
  AGGREGATE   = "Aggregate" 
}

export enum ComparableConditions{
  EQUAL_TO                  = "Equal To", 
  GREATER_THAN              = "Greater Than", 
  GREATER_THAN_OR_EQUAL_TO  = "Greater Than Or Equal To", 
  LESS_THAN                 = "Less Than", 
  LESS_THAN_OR_EQUAL_TO     = "Less Than Or Equal To",
  IS                        = "Is"
}

export enum Existance{
  EXISTS      = "Exists",
  DONT_EXISTS = "Don't Exists"
}

export enum PersonalInformationValues{
  SINGULAR    = "Singular",
  Plural      = "Plural"
}

enum InputFieldFormat{
  PLAIN   = "Plain",
  DIVIDED = "Divided"
}

enum InputFieldType{
  TEXT    = "Text",
  NUMBER  = "Number"
}

enum ChoiceFieldFormat{
  RADIO     = "Radio",
  LIST      = "List",
  DEPENDENT = "Dependent"
}

enum DateFieldFormat{
  TODAY         = "Today",
  PLAIN_DATE    = "Plain Date",
  AGE           = "Age"
}

enum BlockFieldFormat{
  PERSONAL_INFORMATION  = "Personal Information",
  TABLE                 = "Table",
  ADDRESS               = "Address"
}

interface InputFieldConfig{
  type :InputFieldType,
  maxLength :number,
  label :string,
  getAllTypes() :string[];
}

interface ChoiceFieldConfig{
  option : string,
  output ?: string
}

interface DependentFieldConfig extends ChoiceFieldConfig{
  dependeeField : QuickEditField|undefined;
  selectedComponent?:string|undefined;
  selectedCondition?:string|undefined;
  comparableValue:string;
}

interface FieldFormat{
  caption:string;
  value:QuickEditField;
}

abstract class QuickEditField{
  private static quickEditTagCounter                = 0;
  private static _languagueService:LanguageService;
  private static _languague:Language;
  private _label!:string;
  private _quickEditTag!:HTMLElement|undefined;
  public markedTag!:HTMLElement|undefined;
  protected _components!:Object;
  protected _markTagColor                           = "DodgerBlue";
  protected _quickEditTagColor                      = "#FF9900";
  protected _quickEditRepeatTagColor                = "#C62168";

  protected constructor(){}

  get quickEditTag():HTMLElement{
    return this._quickEditTag as HTMLElement;
  }

  get label():string{
    return this._label;
  }

  set label(label:string){
    this._label = label;
  }

  get languageService():LanguageService{
    return QuickEditField._languagueService;
  }

  get language():Language{
    return QuickEditField._languague;
  }

  isField(fieldFormat:QuickEditFieldFormat):boolean{
    switch(fieldFormat){
      case QuickEditFieldFormat.PLAIN_INPUT_FIELD:
        return this instanceof PlainInputField;

      case QuickEditFieldFormat.DIVIDED_INPUT_FIELD:
        return this instanceof DividedInputField;

      case QuickEditFieldFormat.RADIO_FIELD:
        return this instanceof RadioChoiceField;

      case QuickEditFieldFormat.LIST_FIELD:
        return this instanceof ListChoiceField;

      case QuickEditFieldFormat.DEPENDENT_FIELD:
        return this instanceof DependentChoiceField;

      case QuickEditFieldFormat.TODAY_FIELD:
        return this instanceof TodayDateField;

      case QuickEditFieldFormat.PLAIN_DATE_FIELD:
        return this instanceof PlainDateField;

      case QuickEditFieldFormat.AGE_FIELD:
        return this instanceof AgeDateField;

      case QuickEditFieldFormat.PASSPORT_PHOTO_FIELD:
        return this instanceof PassportPhotoField;

      case QuickEditFieldFormat.ADHAR_CARD_PHOTO_FIELD:
        return this instanceof AdharCardPhotoField;

      case QuickEditFieldFormat.FOUR_BY_SIX_PHOTO_FIELD:
        return this instanceof FourBySixPhotoField;

      case QuickEditFieldFormat.FIVE_BY_SEVEN_PHOTO_FIELD:
        return this instanceof FiveBySevenPhotoField;

      case QuickEditFieldFormat.PERSONAL_INFORMATION_FIELD:
        return this instanceof PersonalInformationBlockField;

      case QuickEditFieldFormat.TABLE_FIELD:
        return this instanceof TableBlockField;

      case QuickEditFieldFormat.ADDRESS_FIELD:
        return this instanceof AddressBlockField;
    }

    return false;
  }

  resetMarkedTag():void{
    this.markedTag = undefined;
  } 

  resetQuickEditTag():void{
    this._quickEditTag = undefined;
  }

  clone():QuickEditField {
    return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
  }

  repeat(){
    if(this.insert()) {
      this._quickEditTag  = document.getElementById("quick-edit-" + QuickEditField.quickEditTagCounter) as HTMLElement;
      this._quickEditTag.setAttribute("for", this._quickEditTag.id.toString());
      this._quickEditTag.setAttribute("data-instance-type", QuickEditTagInstanceType.REPEAT.toString());
      this._quickEditTag.style.color  = this._quickEditRepeatTagColor;
      this._quickEditTag.setAttribute("data-components", JSON.stringify(this.components));
    }
  }

  markNew(selection:Selection):void{
    let contents:DocumentFragment = selection.getRangeAt(0).extractContents(),
        allMarkedTags:any         = document.getElementsByTagName("marked");

    this.markedTag               = document.createElement("marked");
    this.markedTag.style.color   = this._markTagColor;
    this.markedTag.appendChild(contents);
    selection.getRangeAt(0).insertNode(this.markedTag);

    if(!!allMarkedTags && !!allMarkedTags.length)
      for(let markedTag of allMarkedTags)
        if(this.markedTag != markedTag)
          markedTag.outerHTML = markedTag.innerHTML;
  }

  markRepeat(selection:Selection):void{
    this.markNew(selection);
  }

  insert():boolean{
    if(!this.validate()) return false;

    this._quickEditTag = document.createElement("quick-edit");

    this.prepareGeneralTagAttributes();
    this.prepareSpecificTagAttributes();
    this._quickEditTag.append(this.label);
    
    (this.markedTag as HTMLElement).outerHTML = this._quickEditTag.outerHTML;
    this.resetMarkedTag();

    return true;
  };

  validate():boolean{
    if(!this.markedTag) {
      alert("Please select and mark the text first");
      return false;
    }

    return true;
  }

  prepareGeneralTagAttributes():void{
    this.quickEditTag.setAttribute("id", "quick-edit-" + ++QuickEditField.quickEditTagCounter);
    this.quickEditTag.setAttribute("data-instance-type", QuickEditTagInstanceType.ORIGINAL.toString());
    this.quickEditTag.setAttribute("data-label", this.label);
    this.quickEditTag.style.color  = this._quickEditTagColor;
  };

  getComponentsAsArray():string[]{
    return (!this.components) ? [] : Object.keys(this.components);
  }

  abstract prepareSpecificTagAttributes():void;
  abstract getSupportedFieldFormats():FieldFormat[];
  abstract get components():Object;
  abstract getDependableConditions(selectedComponent?:string):string[];
  abstract getDependableComparableValues(selectedComponent?:string):string[];

  static getSupportedFieldFormats():FieldFormat[]{
    return [];
  }

  static setLanguageService(languageService:LanguageService):void{
    QuickEditField._languagueService = languageService;
  }

  static setLanguage(language:Language):void{
    QuickEditField._languague = language;
  }
}

abstract class InputField extends QuickEditField{
  private static _childInstance:InputField;
  private _defaultInputFieldConfig:InputFieldConfig = {type : InputFieldType.TEXT, maxLength : 30, label:"", getAllTypes: ()=> Object.values(InputFieldType)};
  static supportedFieldFormats:FieldFormat[]        = [];

  protected constructor(private _inputFieldFormat:InputFieldFormat){
    super();
  }

  protected createInputFieldConfig():InputFieldConfig{
    return {...this._defaultInputFieldConfig};
  }
  
  static get instance():InputField{
    if(!this._childInstance)
      this._childInstance = InputField.getSupportedFieldFormats()[0].value as InputField

    return this._childInstance;
  }

  static set instance(instance:InputField){
    this._childInstance = instance;
  }

  get inputFieldFormat():InputFieldFormat{
    return this._inputFieldFormat;
  }

  get components():Object{
    if(!this._components)
      this._components = {};

    return this._components;
  }

  getAllInputTypes():any[]{
    return Object.values(InputFieldType);
  }

  getSupportedFieldFormats():FieldFormat[]{
    return InputField.getSupportedFieldFormats();
  }

  getDependableConditions():string[]{
    return [ComparableConditions.EQUAL_TO];
  }

  getDependableComparableValues():string[]{
    return [];
  }

  static override getSupportedFieldFormats():FieldFormat[]{
    if(!InputField.supportedFieldFormats.length)
      InputField.supportedFieldFormats = [
                                          {caption : InputFieldFormat.PLAIN, value:PlainInputField.instance}, 
                                          {caption : InputFieldFormat.DIVIDED, value:DividedInputField.instance}
                                        ];

    return InputField.supportedFieldFormats;
  }

  abstract getInputFieldConfigs():InputFieldConfig[];
  abstract isDividedInput():boolean;
}

class PlainInputField extends InputField{
  private static _instance:PlainInputField;
  private _inputFieldConfig:InputFieldConfig    = this.createInputFieldConfig();

  private constructor(){
    super(InputFieldFormat.PLAIN);
  }

  static override get instance() : PlainInputField {
    if(!PlainInputField._instance)
      PlainInputField._instance = new PlainInputField()

    return PlainInputField._instance;
  }

  getInputFieldConfigs(): InputFieldConfig[] {
    return [this._inputFieldConfig];
  }

  isDividedInput():boolean{
    return false;
  }

  prepareSpecificTagAttributes(): void {
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.PLAIN_INPUT_FIELD.toString());
    this.quickEditTag.setAttribute("data-type", this._inputFieldConfig.type);
    this.quickEditTag.setAttribute("data-max-length", this._inputFieldConfig.maxLength.toString());
  }
}

class DividedInputField extends InputField{
  private static _instance:DividedInputField;
  private _parts:number                         = 2;
  private _separator:string                     = "-";
  private _inputFieldConfigs:InputFieldConfig[]  = [];

  private constructor(){
    super(InputFieldFormat.DIVIDED);
  }

  static override get instance() : DividedInputField {
    if(!DividedInputField._instance)
    DividedInputField._instance = new DividedInputField()

    return DividedInputField._instance;
  }

  get parts():number{
    return this._parts;
  }

  set parts(parts:number){
    this._parts = parts;
  }

  get separator():string{
    return this._separator;
  }

  set separator(separator:string){
    this._separator = separator;
  }
  
  override get components():Object{
    if(!this._components) {
      this._components = Array.from(new Array(this.parts), (_, index) => "Part " + (index + 1)).concat([DividedInputComponents.AGGREGATE]).reduce((accumulator, value) => {
                                                                                                                        return {...accumulator, [value]: true};
                                                                                                                      }, {});
      this._components = new Proxy(this._components, {
        set: (target:any, prop, value, receiver) => {
          target[prop] = value;

          if(DividedInputComponents.AGGREGATE == prop && true == value){
            for(const key of Object.keys(target))
              if(DividedInputComponents.AGGREGATE != key) target[key] = true;
          } else if(false == value){
            target[DividedInputComponents.AGGREGATE] = false;
          }

          return true;
        }
      });
    }
    return this._components;
  }

  getInputFieldConfigs(): InputFieldConfig[] {
    if(this.parts < 2)
      this.parts = 2;

    if(this.parts < this._inputFieldConfigs.length)
      this._inputFieldConfigs.splice(this.parts);

    if(this.parts > this._inputFieldConfigs.length)
      for(let i = this._inputFieldConfigs.length; i < this.parts; i++)
        this._inputFieldConfigs.push(this.createInputFieldConfig());

    return this._inputFieldConfigs;
  }

  override getDependableConditions(selectedComponent?:string):string[]{
    let partNumber = parseInt(selectedComponent as string);

    return isNaN(partNumber) || InputFieldType.NUMBER != this._inputFieldConfigs[partNumber-1].type 
            ? super.getDependableConditions() 
              : super.getDependableConditions().concat(Object.values(ComparableConditions).slice(1, 4));
  }

  isDividedInput():boolean{
    return true;
  }

  override createInputFieldConfig():InputFieldConfig{
    let defaultInputFieldConfig   = super.createInputFieldConfig();
    defaultInputFieldConfig.label = (this._inputFieldConfigs.length + 1).toString();

    return defaultInputFieldConfig;
  }

  prepareSpecificTagAttributes(): void {
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.DIVIDED_INPUT_FIELD.toString());
    this.quickEditTag.setAttribute("data-parts", this.parts.toString());
    this.quickEditTag.setAttribute("data-separator", this.separator);

    for(let i = 0; i < this._inputFieldConfigs.length; i++) {
      this.quickEditTag.setAttribute("data-type-" + i, this._inputFieldConfigs[i].type);
      this.quickEditTag.setAttribute("data-max-length-" + i, this._inputFieldConfigs[i].maxLength.toString());
    }
  }
}

abstract class ChoiceField extends QuickEditField{
  private static _childInstance: ChoiceField;
  protected _defaultChoiceFieldConfig:ChoiceFieldConfig = {option:"", output:""};
  protected _choiceFieldConfigs:ChoiceFieldConfig[]     = [];
  private _choiceFieldConfigCounter:number            = 2;
  static supportedFieldFormats:FieldFormat[]          = [];

  protected constructor(private _choiceFieldFormat:ChoiceFieldFormat){
    super();
  }

  static get instance():ChoiceField{
    if(!this._childInstance)
      this._childInstance = ChoiceField.getSupportedFieldFormats()[0].value as ChoiceField

    return this._childInstance;
  }

  static set instance(instance:ChoiceField){
    this._childInstance = instance;
  }

  get choiceFieldFormat():ChoiceFieldFormat{
    return this._choiceFieldFormat;
  }

  get components():Object{
    if(!this._components)
      this._components = {};

    return this._components;
  }

  getChoiceFieldConfigs():ChoiceFieldConfig[]{

    if(this._choiceFieldConfigCounter < 2)
      this._choiceFieldConfigCounter = 2;

    if(this._choiceFieldConfigCounter > this._choiceFieldConfigs.length)
      for(let i = this._choiceFieldConfigs.length; i < this._choiceFieldConfigCounter; i++)
        this._choiceFieldConfigs.push({...this._defaultChoiceFieldConfig});

    if(this._choiceFieldConfigCounter < this._choiceFieldConfigs.length)
      this._choiceFieldConfigs.splice(this._choiceFieldConfigCounter);

    return this._choiceFieldConfigs;
  }

  addOption():void{
    this._choiceFieldConfigCounter++;
  }

  removeOption():void{
    this._choiceFieldConfigCounter--;
  }

  isShowRemoveButton():boolean{
    return this._choiceFieldConfigCounter > 2;
  }

  prepareSpecificTagAttributes(): void {
    for(let i = 0; i < this._choiceFieldConfigs.length; i++) {
      this.quickEditTag.setAttribute("data-option-" + i, this._choiceFieldConfigs[i].option);
      this.quickEditTag.setAttribute("data-output-" + i, this._choiceFieldConfigs[i].output as string);
    }
  }

  getSupportedFieldFormats():FieldFormat[]{
    return ChoiceField.getSupportedFieldFormats();
  }

  getDependableConditions():string[]{
    return [ComparableConditions.EQUAL_TO];
  }

  getDependableComparableValues():string[]{
    return Array.from(this._choiceFieldConfigs, config=> config.option);
  }

  static override getSupportedFieldFormats():FieldFormat[]{
    if(!ChoiceField.supportedFieldFormats.length)
      ChoiceField.supportedFieldFormats = [
                                            {caption : ChoiceFieldFormat.RADIO, value:RadioChoiceField.instance}, 
                                            {caption : ChoiceFieldFormat.LIST, value:ListChoiceField.instance},
                                            {caption : ChoiceFieldFormat.DEPENDENT, value:DependentChoiceField.instance}
                                          ];

    return ChoiceField.supportedFieldFormats;
  }
}

class RadioChoiceField extends ChoiceField{
  private static _instance:RadioChoiceField;
  
  private constructor(){
    super(ChoiceFieldFormat.RADIO);
  }

  static override get instance() : RadioChoiceField {
    if(!RadioChoiceField._instance)
    RadioChoiceField._instance = new RadioChoiceField()

    return RadioChoiceField._instance;
  }

  override prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.RADIO_FIELD.toString());
    super.prepareSpecificTagAttributes()
  }
}

class ListChoiceField extends ChoiceField{
  private static _instance:ListChoiceField;

  private constructor(){
    super(ChoiceFieldFormat.LIST);
  }

  static override get instance() : ListChoiceField {
    if(!ListChoiceField._instance)
    ListChoiceField._instance = new ListChoiceField()

    return ListChoiceField._instance;
  }

  override prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.LIST_FIELD.toString());
    super.prepareSpecificTagAttributes()
  }
}

class DependentChoiceField extends ChoiceField{
  private static _instance:DependentChoiceField;
  protected override _defaultChoiceFieldConfig:DependentFieldConfig = {option:"", dependeeField:undefined, selectedComponent:undefined, selectedCondition:undefined, comparableValue:""};

  private constructor(){
    super(ChoiceFieldFormat.DEPENDENT);
  }

  static override get instance() : DependentChoiceField {
    if(!DependentChoiceField._instance)
    DependentChoiceField._instance = new DependentChoiceField()

    return DependentChoiceField._instance;
  }

  override prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.DEPENDENT_FIELD.toString());
    this.quickEditTag.setAttribute("for", (this._defaultChoiceFieldConfig.dependeeField as QuickEditField).quickEditTag.id);
    super.prepareSpecificTagAttributes()
  }

  override validate():boolean{
    if((this._choiceFieldConfigs as DependentFieldConfig[]).some((choiceFieldConfig:DependentFieldConfig) => !choiceFieldConfig.dependeeField)) {
      alert("Please select dependee field");
      return false;
    }

    return super.validate();
  }
}

abstract class DateField extends QuickEditField{
  static supportedFieldFormats:FieldFormat[]  = [];
  private static _childInstance: DateField;

  protected constructor(private _dateFieldFormat:DateFieldFormat){
    super();
  }

  static get instance():DateField{
    if(!this._childInstance)
      this._childInstance = DateField.getSupportedFieldFormats()[0].value as DateField

    return this._childInstance;
  }

  static set instance(instance:DateField){
    this._childInstance = instance;
  }

  get dateFieldFormat():DateFieldFormat{
    return this._dateFieldFormat;
  }

  get components():Object{
    if(!this._components)
      this._components = {};

    return this._components;
  }

  getSupportedFieldFormats():FieldFormat[]{
    return DateField.getSupportedFieldFormats();
  }

  getDependableConditions():string[]{
    return Object.values(ComparableConditions).slice(0, 5);
  }

  getDependableComparableValues():string[]{
    return [];
  }

  static override getSupportedFieldFormats():FieldFormat[]{
    if(!DateField.supportedFieldFormats.length)
      DateField.supportedFieldFormats = [
                                          {caption : DateFieldFormat.TODAY, value:TodayDateField.instance}, 
                                          {caption : DateFieldFormat.PLAIN_DATE, value:PlainDateField.instance},
                                          {caption : DateFieldFormat.AGE, value:AgeDateField.instance}
                                        ];

    return DateField.supportedFieldFormats;
  }
}

class TodayDateField extends DateField{
  private static _instance:TodayDateField;

  private constructor(){
    super(DateFieldFormat.TODAY);
  }

  static override get instance() : TodayDateField {
    if(!TodayDateField._instance)
    TodayDateField._instance = new TodayDateField()

    return TodayDateField._instance;
  }

  prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.TODAY_FIELD.toString());
  }
}

class PlainDateField extends DateField{
  private static _instance:PlainDateField;

  private constructor(){
    super(DateFieldFormat.PLAIN_DATE);
  }

  static override get instance() : PlainDateField {
    if(!PlainDateField._instance)
    PlainDateField._instance = new PlainDateField()

    return PlainDateField._instance;
  }

  override get components():Object{
    if(!this._components) {
      this._components = Object.values(DateComponents).reduce((accumulator, value) => {
                                                                                        return {...accumulator, [value]: true};
                                                                                      }, {});

      this._components = new Proxy(this._components, {
        set: (target:any, prop, value, receiver) => {
          target[prop] = value;

          if(DateComponents.DATE == prop && true == value){
            target[DateComponents.DAY]    = true;
            target[DateComponents.MONTH]  = true;
            target[DateComponents.YEAR]   = true;
          } else if(false == value){
            target[DateComponents.DATE]   = false;
          }

          if(![DateComponents.DAY, DateComponents.MONTH, DateComponents.YEAR].some(key=> false == target[key]))
            target[DateComponents.DATE]   = true;

          return true;
        }
      });
    }
    return this._components;
  }

  prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.PLAIN_DATE_FIELD.toString());
  }
}

class AgeDateField extends DateField{
  private static _instance:AgeDateField;

  private constructor(){
    super(DateFieldFormat.AGE);
  }

  static override get instance() : AgeDateField {
    if(!AgeDateField._instance)
    AgeDateField._instance = new AgeDateField()

    return AgeDateField._instance;
  }

  prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.AGE_FIELD.toString());
  }
}

abstract class PhotoField extends QuickEditField{
  static supportedFieldFormats:FieldFormat[]  = [];
  private static _childInstance: PhotoField;

  protected constructor(private _photoFieldFormat:ImageType){
    super();
  }

  static get instance():PhotoField{
    if(!this._childInstance)
      this._childInstance = PhotoField.getSupportedFieldFormats()[0].value as PhotoField

    return this._childInstance;
  }

  static set instance(instance:PhotoField){
    this._childInstance = instance;
  }

  get photoFieldFormat():ImageType{
    return this._photoFieldFormat;
  }

  get components():Object{
    if(!this._components)
      this._components = {};

    return this._components;
  }

  getSupportedFieldFormats():FieldFormat[]{
    return PhotoField.getSupportedFieldFormats();
  }

  getDependableConditions():string[]{
    return [];
  }

  getDependableComparableValues():string[]{
    return [];
  }

  override markNew(selection:Selection):void{
    let imageElement:any                  = selection.getRangeAt(0).commonAncestorContainer;

    while( "DIV" != imageElement.tagName && !imageElement.classList?.contains('image')) {
      if(imageElement.classList?.contains('body')) return;

      imageElement = imageElement.parentElement;
    }


    let imageElementParent  = imageElement.parentElement,
        imageElementIndex   = Array.from(imageElementParent.children).indexOf(imageElement),
        range               = document.createRange();

    range.setStart(imageElementParent, imageElementIndex);
    range.setEnd(imageElementParent, imageElementIndex + 1 );
    selection.removeAllRanges();
    selection.addRange(range);

    super.markNew(selection);
  }

  static override getSupportedFieldFormats():FieldFormat[]{
    if(!PhotoField.supportedFieldFormats.length)
      PhotoField.supportedFieldFormats = [
                                          {caption : ImageType.PASSPORT_PHOTO, value:PassportPhotoField.instance}, 
                                          {caption : ImageType.ADHAR_CARD, value:AdharCardPhotoField.instance},
                                          {caption : ImageType.FOUR_BY_SIX, value:FourBySixPhotoField.instance},
                                          {caption : ImageType.FIVE_BY_SEVEN, value:FiveBySevenPhotoField.instance}
                                        ];

    return PhotoField.supportedFieldFormats;
  }
}

class PassportPhotoField extends PhotoField{
  private static _instance:PassportPhotoField;

  private constructor(){
    super(ImageType.PASSPORT_PHOTO);
  }

  static override get instance() : PassportPhotoField {
    if(!PassportPhotoField._instance)
    PassportPhotoField._instance = new PassportPhotoField()

    return PassportPhotoField._instance;
  }

  prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.PASSPORT_PHOTO_FIELD.toString());
  }
}

class AdharCardPhotoField extends PhotoField{
  private static _instance:AdharCardPhotoField;

  private constructor(){
    super(ImageType.ADHAR_CARD);
  }

  static override get instance() : AdharCardPhotoField {
    if(!AdharCardPhotoField._instance)
    AdharCardPhotoField._instance = new AdharCardPhotoField()

    return AdharCardPhotoField._instance;
  }

  prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.ADHAR_CARD_PHOTO_FIELD.toString());
  }
}

class FourBySixPhotoField extends PhotoField{
  private static _instance:FourBySixPhotoField;

  private constructor(){
    super(ImageType.FOUR_BY_SIX);
  }

  static override get instance() : FourBySixPhotoField {
    if(!FourBySixPhotoField._instance)
    FourBySixPhotoField._instance = new FourBySixPhotoField()

    return FourBySixPhotoField._instance;
  }

  prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.FOUR_BY_SIX_PHOTO_FIELD.toString());
  }
}

class FiveBySevenPhotoField extends PhotoField{
  private static _instance:FiveBySevenPhotoField;

  private constructor(){
    super(ImageType.FIVE_BY_SEVEN);
  }

  static override get instance() : FiveBySevenPhotoField {
    if(!FiveBySevenPhotoField._instance)
    FiveBySevenPhotoField._instance = new FiveBySevenPhotoField()

    return FiveBySevenPhotoField._instance;
  }

  prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.FIVE_BY_SEVEN_PHOTO_FIELD.toString());
  }
}

abstract class BlockField extends QuickEditField{
  static supportedFieldFormats:FieldFormat[]  = [];
  private static _childInstance: BlockField;

  protected constructor(private _blockFieldFormat:BlockFieldFormat){
    super();
  }

  static get instance():BlockField{
    if(!this._childInstance)
      this._childInstance = BlockField.getSupportedFieldFormats()[0].value as BlockField

    return this._childInstance;
  }

  static set instance(instance:BlockField){
    this._childInstance = instance;
  }

  get blockFieldFormat():BlockFieldFormat{
    return this._blockFieldFormat;
  }

  get components():Object{
    if(!this._components)
      this._components = {};

    return this._components;
  }

  getSupportedFieldFormats():FieldFormat[]{
    return BlockField.getSupportedFieldFormats();
  }

  getDependableConditions():string[]{
    return [];
  }

  getDependableComparableValues():string[]{
    return [];
  }

  static override getSupportedFieldFormats():FieldFormat[]{
    if(!BlockField.supportedFieldFormats.length)
      BlockField.supportedFieldFormats = [
                                          {caption : BlockFieldFormat.PERSONAL_INFORMATION, value:PersonalInformationBlockField.instance}, 
                                          {caption : BlockFieldFormat.TABLE, value:TableBlockField.instance}, 
                                          {caption : BlockFieldFormat.ADDRESS, value:AddressBlockField.instance}, 
                                        ];

    return BlockField.supportedFieldFormats;
  }
}
  
class PersonalInformationBlockField extends BlockField{
  private static _instance:PersonalInformationBlockField;
  multiple:boolean                        = true;
  inline:boolean                          = false;
  showMobileNumberField:boolean           = false;
  showAdharNumberField:boolean            = false;
  showPanNumberField:boolean              = false;
  hasSignatureTable:boolean               = false;
  signatureTableElement?:HTMLTableElement;
  signatureTableHasNameColumn             = false;
  signatureTableHasAddressColumn          = false;
  signatureTableHasPhotoColumn            = false;
  nameColumnNumbar:number                 = 2;
  addressColumnNumbar:number              = 3;
  photoColumnNumbar:number                = 4;

  private constructor(){
    super(BlockFieldFormat.PERSONAL_INFORMATION);
  }

  static override get instance() : PersonalInformationBlockField {
    if(!PersonalInformationBlockField._instance)
    PersonalInformationBlockField._instance = new PersonalInformationBlockField()

    return PersonalInformationBlockField._instance;
  }

  override get components():Object{
    if(!this._components) {
      this._components = Object.values(PersonalInformationComponents).reduce((accumulator, value) => {
                                                                                          return {...accumulator, [value]: true};
                                                                                        }, {});

      this._components = new Proxy(this._components, {
        set: (target:any, prop, value, receiver) => {
          target[prop] = value;

          if(PersonalInformationComponents.PERSONAL_INFORMATION == prop && true == value){
            target[PersonalInformationComponents.Name]            = true;
            target[PersonalInformationComponents.AGE]             = true;
            target[PersonalInformationComponents.OCCUPANCY]       = true;
            target[PersonalInformationComponents.ADDRESS]         = true;
            target[PersonalInformationComponents.MOBILE_NUMBER]   = true;
            target[PersonalInformationComponents.ADHAR_NUMBER]    = true;
            target[PersonalInformationComponents.PAN_NUMBER]      = true;
            target[PersonalInformationComponents.PASSPORT_PHOTO]  = true;
          } else if(false == value){
            target[PersonalInformationComponents.PERSONAL_INFORMATION]   = false;
          }

          if(![PersonalInformationComponents.AGE, PersonalInformationComponents.OCCUPANCY, PersonalInformationComponents.ADDRESS, PersonalInformationComponents.MOBILE_NUMBER, PersonalInformationComponents.ADHAR_NUMBER, PersonalInformationComponents.PAN_NUMBER, PersonalInformationComponents.PASSPORT_PHOTO].some(key=> false == target[key]))
            target[PersonalInformationComponents.PERSONAL_INFORMATION]   = true;

          return true;
        }
      });
    }

    return this._components;
  }

  override getDependableConditions(selectedComponent?:string):string[]{
    return [PersonalInformationComponents.PERSONAL_INFORMATION, PersonalInformationComponents.Name].includes(selectedComponent as PersonalInformationComponents) 
            ? [ComparableConditions.IS] 
              : ( PersonalInformationComponents.AGE == selectedComponent 
                  ? Object.values(ComparableConditions).slice(0, 5)
                    : PersonalInformationComponents.OCCUPANCY == selectedComponent 
                      ? [ComparableConditions.EQUAL_TO]
                        : Object.values(Existance)
                );
  }

  override getDependableComparableValues(selectedComponent?:string):string[]{
    return [PersonalInformationComponents.PERSONAL_INFORMATION, PersonalInformationComponents.Name].includes(selectedComponent as PersonalInformationComponents)
            ? Object.values(PersonalInformationValues) 
              : ( PersonalInformationComponents.AGE == selectedComponent 
                  ? [] 
                    : PersonalInformationComponents.OCCUPANCY == selectedComponent 
                      ? []
                        : Object.values(Existance)
                );
  }

  prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.PERSONAL_INFORMATION_FIELD.toString());
    this.quickEditTag.setAttribute("data-inline", this.inline.toString());
    this.quickEditTag.setAttribute("data-show-mobile-number-field", this.showMobileNumberField.toString());
    this.quickEditTag.setAttribute("data-show-adhar-number-field", this.showAdharNumberField.toString());
    this.quickEditTag.setAttribute("data-show-pan-number-field", this.showPanNumberField.toString());
    this.quickEditTag.setAttribute("data-has-signature-table", this.hasSignatureTable.toString());
    this.quickEditTag.setAttribute("data-signature-table-has-name-column", this.signatureTableHasNameColumn.toString());
    this.quickEditTag.setAttribute("data-signature-table-has-address-column", this.signatureTableHasAddressColumn.toString());
    this.quickEditTag.setAttribute("data-signature-table-has-photo-column", this.signatureTableHasPhotoColumn.toString());

    if(this.signatureTableHasNameColumn)
      this.quickEditTag.setAttribute("data-name-column-numbar", this.nameColumnNumbar.toString());

    if(this.signatureTableHasAddressColumn)
      this.quickEditTag.setAttribute("data-address-column-numbar", this.addressColumnNumbar.toString());

    if(this.signatureTableHasPhotoColumn)
      this.quickEditTag.setAttribute("data-photo-column-numbar", this.photoColumnNumbar.toString());
  }

  override markNew(selection:Selection):void{
    let personalInformationElement:any                  = selection.getRangeAt(0).commonAncestorContainer,
        personalInformationContainerElement:any;

    while( !["PERSONAL-INFORMATION", "PERSONAL-INFORMATION-CONTAINER"].includes(personalInformationElement.tagName) ) {
      if(personalInformationElement.classList?.contains('body')) return;

      personalInformationElement = personalInformationElement.parentElement;
    }

    if("PERSONAL-INFORMATION" == personalInformationElement.tagName) {
      personalInformationContainerElement = personalInformationElement.parentElement;

      while( "PERSONAL-INFORMATION-CONTAINER" != personalInformationContainerElement.tagName ) {
        if(personalInformationContainerElement.classList?.contains('body')) break;

        personalInformationContainerElement = personalInformationContainerElement.parentElement;
      }
    
      if( "PERSONAL-INFORMATION-CONTAINER" == personalInformationContainerElement.tagName )
        personalInformationElement = personalInformationContainerElement;
    }

    let personalInformationElementParent  = personalInformationElement.parentElement,
        personalInformationElementIndex   = Array.from(personalInformationElementParent.childNodes).indexOf(personalInformationElement),
        range                             = document.createRange();

    range.setStart(personalInformationElementParent, personalInformationElementIndex);
    range.setEnd(personalInformationElementParent, personalInformationElementIndex + 1 );
    selection.removeAllRanges();
    selection.addRange(range);

    super.markNew(selection);

    let personalInformationElementHTML:string         =  personalInformationElement.innerHTML;
    this.showMobileNumberField                        = (personalInformationElementHTML.includes(this.languageService.fetchKeyWord(37, this.language))) ? true : false;
    this.showAdharNumberField                         = (personalInformationElementHTML.includes(this.languageService.fetchKeyWord(38, this.language))) ? true : false;
    this.showPanNumberField                           = (personalInformationElementHTML.includes(this.languageService.fetchKeyWord(39, this.language))) ? true : false;
    this.multiple                                     = (personalInformationElementHTML.includes("<ol>")) ? true : false;
    this.inline                                       = ("PERSONAL-INFORMATION-CONTAINER" != personalInformationElement.tagName) ? true : false;
    this.hasSignatureTable                            = !!document.querySelectorAll("[for='" + personalInformationElement.id + "']").length ? true : false;
  }

  override markRepeat(selection:Selection):void{
    (this.components as any)[PersonalInformationComponents.PERSONAL_INFORMATION] ? this.markNew(selection) : super.markNew(selection);
  }

  override insert():boolean{
    let personalInformationElementId = this.markedTag?.children[0]?.id;

    let isInserted = super.insert();

    if(!!personalInformationElementId && !!personalInformationElementId.length) {
      let NodeList:NodeList = document.querySelectorAll("[for='" + personalInformationElementId + "']");

      if(!!NodeList.length){
        let signatureTableElement:HTMLTableElement = NodeList[0] as HTMLTableElement;
        signatureTableElement.style.backgroundColor = this._quickEditTagColor;
      }
    }

    return isInserted;
  }
}

class TableBlockField extends BlockField{
  private static _instance:TableBlockField;
  autoSerializable:boolean    = false;
  header:boolean              = false;
  tableHead:string            = "";   

  private constructor(){
    super(BlockFieldFormat.PERSONAL_INFORMATION);
  }

  static override get instance() : TableBlockField {
    if(!TableBlockField._instance)
    TableBlockField._instance = new TableBlockField()

    return TableBlockField._instance;
  }

  prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.TABLE_FIELD.toString());
    this.quickEditTag.setAttribute("data-auto-serializable", this.autoSerializable.toString());
    this.quickEditTag.setAttribute("data-header", this.header.toString());
    this.quickEditTag.setAttribute("data-table-head", this.tableHead);
  }

  override markNew(selection:Selection):void{
    let tableElement:any = selection.getRangeAt(0).commonAncestorContainer;

    while( "TABLE" != tableElement.tagName) {
      if(tableElement.classList?.contains('body')) return;

      tableElement = tableElement.parentElement;
    }

    let tableElementParent  = tableElement.parentElement,
        tableElementIndex   = Array.from(tableElementParent.childNodes).indexOf(tableElement),
        range               = document.createRange();

    range.setStart(tableElementParent, tableElementIndex);
    range.setEnd(tableElementParent, tableElementIndex + 1);
    selection.removeAllRanges();
    selection.addRange(range);

    super.markNew(selection);

    this.autoSerializable = (tableElement.classList?.contains("auto-serialize")) ? true : false;
    this.header           = ("THEAD" == tableElement.firstChild.tagName) ? true : false;
    this.tableHead        = ("THEAD" == tableElement.firstChild.tagName) ? tableElement.firstChild.innerHTML.toString() : "";
  }
}


class AddressBlockField extends BlockField{
  private static _instance:AddressBlockField;
  bothCurrentAndPrevious:boolean              = false;

  private constructor(){
    super(BlockFieldFormat.PERSONAL_INFORMATION);
  }

  static override get instance() : AddressBlockField {
    if(!AddressBlockField._instance)
    AddressBlockField._instance = new AddressBlockField()

    return AddressBlockField._instance;
  }

  prepareSpecificTagAttributes():void{
    this.quickEditTag.setAttribute("data-format", QuickEditFieldFormat.ADDRESS_FIELD.toString());
    this.quickEditTag.setAttribute("data-both-current-and-previous", this.bothCurrentAndPrevious.toString());
  }  
}

@Component({
  selector: 'app-create-draft-template',
  templateUrl: './create-draft-template.component.html',
  styleUrls: ['./create-draft-template.component.scss'],
  providers:[FontService]
})
export class CreateDraftTemplateComponent implements OnInit {
  editorConfig:EditorConfig         = new EditorConfig();
  latestDraft:HTMLDivElement        = document.createElement("div");
  widgetColor:ThemePalette          = "primary";
  selectedTabIndex:number           = 0;

  tab                               = Tab;
  inputFieldType                    = InputFieldType;
  tabData                           = {
                                      [Tab.LABEL]  :  InputField,
                                      [Tab.CHOICE] :  ChoiceField,
                                      [Tab.DATE]   :  DateField,
                                      [Tab.PHOTO]  :  PhotoField,
                                      [Tab.BLOCK]  :  BlockField,
                                    };

  fieldPool:QuickEditField[]        = [];
  repeatField!:QuickEditField;
  quickEditFieldFormat              = QuickEditFieldFormat;
  
  constructor(public fontService:FontService, 
    public languageService:LanguageService) {
    QuickEditField.setLanguageService(languageService);
    QuickEditField.setLanguage(this.editorConfig.draftLanguage);

    this.editorConfig.setTools(ToolGroup.FILE, [FileToolGroup.FIND, FileToolGroup.FIND_AND_REPLACE]);
    this.editorConfig.setTools(ToolGroup.HOME, [HomeToolGroup.UNDO, HomeToolGroup.REDO,  HomeToolGroup.LINE_SPACING, HomeToolGroup.SUPERSCRIPT, HomeToolGroup.SUPERSCRIPT, HomeToolGroup.CHANGE_CASE,
                                                  HomeToolGroup.FORECOLOR, HomeToolGroup.HIGHLIGHT, HomeToolGroup.JUSTIFY, HomeToolGroup.INDENT, HomeToolGroup.OUTDENT,
                                                  HomeToolGroup.BULLETED_LIST, HomeToolGroup.NUMBERED_LIST, HomeToolGroup.SYMBOL, HomeToolGroup.IMAGE]);
    this.editorConfig.setTools(ToolGroup.TABLE, [TableToolGroup.TABLE, TableToolGroup.MERGE_CELLS, TableToolGroup.SPLIT_CELL, TableToolGroup.INSERT_COLUMNS_AND_ROWS, TableToolGroup.DELETE_COLUMNS_AND_ROWS]);
    this.editorConfig.setTools(ToolGroup.LAYOUT, [LayoutToolGroup.PAGE_SIZE, LayoutToolGroup.PAGE_ORIENTATION, LayoutToolGroup.PAGE_MARGINS, LayoutToolGroup.PAGE_NUMBER]);
    this.editorConfig.setTools(ToolGroup.BLOCK, [BlockToolGroup.PERSONAL_INFO]);
  }

  get selectedFont():Font{
    return (Tool.tools[ToolCommand.SET_FONT] as SelectTool).selected
  } 
  
  ngOnInit(): void {}

  updateDraft(draftElement:HTMLDivElement){
    this.latestDraft  = draftElement;
    this.fieldPool    = [];
    for(const key of Object.keys(this.tabData)){
      for( const fieldFormat of this.tabData[key as unknown as Tab].getSupportedFieldFormats()) {
        fieldFormat.value.resetMarkedTag();
        fieldFormat.value.resetQuickEditTag();
      }
    }
  }

  markNew():void{
    if(!this.isSelectionInsideView()) return;

    this.tabData[this.selectedTabIndex as Tab].instance.markNew(window.getSelection() as Selection);
  }

  markRepeat():void{
    if(!this.isSelectionInsideView()) return;

    if(!!this.repeatField)
      this.repeatField.markRepeat(window.getSelection() as Selection);
  }

  insert():void{
    if(this.tabData[this.selectedTabIndex as Tab].instance.insert())
      this.fieldPool.push(this.tabData[this.selectedTabIndex as Tab].instance.clone());

    if(1 == this.fieldPool.length)
      this.repeatField = this.fieldPool[0];
  }

  repeat():void{
    this.repeatField.repeat();
  }

  isSelectionInsideView() : boolean{
    let selectionContainer:any = window.getSelection()!.getRangeAt(0)!.commonAncestorContainer;

    while( !!selectionContainer && ( Node.TEXT_NODE == selectionContainer.nodeType || !selectionContainer.id.includes("view-app-page")) ) {
      selectionContainer = selectionContainer?.parentElement;
    }

    return !!selectionContainer;
  }

  disableDependent(choiceField:QuickEditField):boolean{
    return  choiceField.isField(QuickEditFieldFormat.DEPENDENT_FIELD) && !this.fieldPool.length;
  }

  getDependableFields():QuickEditField[]{
    return this.fieldPool.filter(quickEditField => [
                                                    QuickEditFieldFormat.PLAIN_INPUT_FIELD,
                                                    QuickEditFieldFormat.DIVIDED_INPUT_FIELD,
                                                    QuickEditFieldFormat.RADIO_FIELD,
                                                    QuickEditFieldFormat.LIST_FIELD,
                                                    QuickEditFieldFormat.DEPENDENT_FIELD,
                                                    QuickEditFieldFormat.PLAIN_DATE_FIELD,
                                                    QuickEditFieldFormat.AGE_FIELD,
                                                    QuickEditFieldFormat.PERSONAL_INFORMATION_FIELD,
                                                    QuickEditFieldFormat.ADDRESS_FIELD
                                                  ].some(key => quickEditField.isField(key)));
  }
}
