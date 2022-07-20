import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { EditorConfig } from '../editor/editor.component';
import { EditorService } from '../editor/editor.service';
import { FontService } from '../editor/font.service';
import { BlockToolGroup, FileToolGroup, HomeToolGroup, LayoutToolGroup, TableToolGroup, ToolGroup } from '../editor/tool-bar/tools/tool-bar';

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
  TODAY_FIELD,
  DATE_FIELD,
  AGE_FIELD,
  PASSPORT_PHOTO_FIELD,
  ADHAR_CARD_PHOTO_FIELD,
  FOUR_BY_SIX_PHOTO_FIELD,
  FIVE_BY_SEVEN_PHOTO_FIELD,
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
  RADIO   = "Radio",
  LIST    = "List" 
}

enum DateFieldFormat{
  TODAY   = "Today",
  DATE    = "Date",
  AGE     = "Age"
}

enum PhotoFieldFormat{
  PASSPORT_PHOTO  = "Passport Photo",
  ADHAR_CARD      = "Adhar Card",
  FOUR_BY_SIX     = "4*6",
  FIVE_BY_SEVEN   = "5*7"
}

interface InputFieldConfig{
  type :InputFieldType,
  maxLength :number,
  label :string,
  getAllTypes() :string[];
}

interface ChoiceFieldConfig{
  option : string,
  output : string,
  label : string
}

abstract class QuickEditField{
  private _label!:string;
  private _tag!:HTMLElement;

  protected get tag():HTMLElement{
    return this._tag;
  }

  get label():string{
    return this._label;
  }

  set label(label:string){
    this._label = label;
  }

  clone():QuickEditField {
    let clone       = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        clone._tag  = document.createElement("quick-edit");

    return Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this))
  }

  repeat(selection:Selection){
    this.insert(selection);
    this.tag.setAttribute("instance-type", QuickEditTagInstanceType.REPEAT.toString());
    this.tag.style.backgroundColor  = "#C62168";
  }

  insert(selection:Selection):void{
    let extractedContent  = selection.getRangeAt(0).extractContents() as DocumentFragment;
        this._tag         = document.createElement("quick-edit");

    this.prepareGeneralTagAttributes();
    this.prepareSpecificTagAttributes();
    this.tag.appendChild(extractedContent);
    selection.getRangeAt(0).insertNode(this.tag);
    selection.removeAllRanges();
  };

  prepareGeneralTagAttributes():void{
    this.tag.setAttribute("instance-type", QuickEditTagInstanceType.ORIGINAL.toString());
    this.tag.setAttribute("label", this.label);
    this.tag.setAttribute("title", this.label);
    this.tag.style.backgroundColor  = "#FF9900";
  };

  abstract prepareSpecificTagAttributes():void;
}

abstract class InputField extends QuickEditField{
  private _defaultInputFieldConfig:InputFieldConfig  = {type : InputFieldType.TEXT, maxLength : 30, label:"", getAllTypes: ()=> Object.values(InputFieldType)};

  constructor(private _inputFieldFormat:InputFieldFormat){
    super();
  }

  protected createInputFieldConfig():InputFieldConfig{
    return {...this._defaultInputFieldConfig};
  }

  get inputFieldFormat():InputFieldFormat{
    return this._inputFieldFormat;
  }

  getAllInputTypes():any[]{
    return Object.values(InputFieldType);
  }

  abstract getInputFieldConfigs():InputFieldConfig[];
  abstract isShowPartsAndSeparator():boolean;
}

class PlainInputField extends InputField{
  private _inputFieldConfig:InputFieldConfig    = this.createInputFieldConfig();

  constructor(){
    super(InputFieldFormat.PLAIN);
  }

  getInputFieldConfigs(): InputFieldConfig[] {
    return [this._inputFieldConfig];
  }

  isShowPartsAndSeparator():boolean{
    return false;
  }

  prepareSpecificTagAttributes(): void {
    this.tag.setAttribute("format", QuickEditFieldFormat.PLAIN_INPUT_FIELD.toString());
    this.tag.setAttribute("type", this._inputFieldConfig.type);
    this.tag.setAttribute("max-length", this._inputFieldConfig.maxLength.toString());
  }
}

class DividedInputField extends InputField{
  private _parts:number                         = 2;
  private _separator:string                     = "-";
  private _inputFieldConfigs:InputFieldConfig[]  = [];

  constructor(){
    super(InputFieldFormat.DIVIDED);
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

  isShowPartsAndSeparator():boolean{
    return true;
  }

  override createInputFieldConfig():InputFieldConfig{
    let defaultInputFieldConfig   = super.createInputFieldConfig();
    defaultInputFieldConfig.label = (this._inputFieldConfigs.length + 1).toString();

    return defaultInputFieldConfig;
  }

  prepareSpecificTagAttributes(): void {
    this.tag.setAttribute("format", QuickEditFieldFormat.DIVIDED_INPUT_FIELD.toString());
    this.tag.setAttribute("parts", this.parts.toString());
    this.tag.setAttribute("separator", this.separator);

    for(let i = 0; i < this._inputFieldConfigs.length; i++) {
      this.tag.setAttribute("type-" + i, this._inputFieldConfigs[i].type);
      this.tag.setAttribute("max-length-" + i, this._inputFieldConfigs[i].maxLength.toString());
    }
  }
}

class ChoiceField extends QuickEditField{
  private _choiceFieldFormat:ChoiceFieldFormat        = ChoiceFieldFormat.RADIO;
  private _defaultChoiceFieldConfig:ChoiceFieldConfig = {option:"", output:"", label:""};
  private _choiceFieldConfigs:ChoiceFieldConfig[]     = [];
  private _choiceFieldConfigCounter:number            = 2;

  get choiceFieldFormat():ChoiceFieldFormat{
    return this._choiceFieldFormat;
  }

  set choiceFieldFormat(choiceFieldFormat:ChoiceFieldFormat){
    this._choiceFieldFormat = choiceFieldFormat;
  }

  getAllChoiceFieldFormats():string[]{
    return Object.values(ChoiceFieldFormat);
  }

  getChoiceFieldConfigs():ChoiceFieldConfig[]{

    if(this._choiceFieldConfigCounter < 2)
      this._choiceFieldConfigCounter = 2;

    if(this._choiceFieldConfigCounter > this._choiceFieldConfigs.length)
      for(let i = this._choiceFieldConfigs.length; i < this._choiceFieldConfigCounter; i++)
        this.createChoiceFieldConfig();

    if(this._choiceFieldConfigCounter < this._choiceFieldConfigs.length)
      this._choiceFieldConfigs.splice(this._choiceFieldConfigCounter);

    return this._choiceFieldConfigs;
  }

  createChoiceFieldConfig():void{
    let choiceFieldConfig     = {...this._defaultChoiceFieldConfig};
    choiceFieldConfig.label   = (this._choiceFieldConfigs.length + 1).toString();

    this._choiceFieldConfigs.push(choiceFieldConfig);
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
    this.tag.setAttribute("format", ChoiceFieldFormat.RADIO == this.choiceFieldFormat ? QuickEditFieldFormat.RADIO_FIELD.toString() : QuickEditFieldFormat.LIST_FIELD.toString());

    for(let i = 0; i < this._choiceFieldConfigs.length; i++) {
      this.tag.setAttribute("option-" + i, this._choiceFieldConfigs[i].option);
      this.tag.setAttribute("output-" + i, this._choiceFieldConfigs[i].output);
    }
  }
}

class DateField extends QuickEditField{
  private _dateFieldFormat:DateFieldFormat = DateFieldFormat.TODAY;

  get dateFieldFormat():DateFieldFormat{
    return this._dateFieldFormat;
  }

  set dateFieldFormat(dateFieldFormat:DateFieldFormat){
    this._dateFieldFormat = dateFieldFormat;
  }

  getAllDateFieldFormats():string[]{
    return Object.values(DateFieldFormat);
  }

  prepareSpecificTagAttributes(): void {
    this.tag.setAttribute("format", DateFieldFormat.TODAY == this.dateFieldFormat ? QuickEditFieldFormat.TODAY_FIELD.toString() : DateFieldFormat.DATE == this.dateFieldFormat ? QuickEditFieldFormat.DATE_FIELD.toString() : QuickEditFieldFormat.AGE_FIELD.toString());
  }
}

class PhotoField extends QuickEditField{
  private _photoFieldFormat:PhotoFieldFormat = PhotoFieldFormat.PASSPORT_PHOTO;

  get photoFieldFormat():PhotoFieldFormat{
    return this._photoFieldFormat;
  }

  set photoFieldFormat(photoFieldFormat:PhotoFieldFormat){
    this._photoFieldFormat = photoFieldFormat;
  }
  
  getAllPhotoFieldFormats():string[]{
    return Object.values(PhotoFieldFormat);
  }

  prepareSpecificTagAttributes(): void {
    this.tag.setAttribute("format", PhotoFieldFormat.PASSPORT_PHOTO == this.photoFieldFormat ? QuickEditFieldFormat.PASSPORT_PHOTO_FIELD.toString() : PhotoFieldFormat.ADHAR_CARD == this.photoFieldFormat ? QuickEditFieldFormat.ADHAR_CARD_PHOTO_FIELD.toString() :  PhotoFieldFormat.FOUR_BY_SIX == this.photoFieldFormat ? QuickEditFieldFormat.FOUR_BY_SIX_PHOTO_FIELD.toString() : QuickEditFieldFormat.FIVE_BY_SEVEN_PHOTO_FIELD.toString());
  }
}


class BlockField extends QuickEditField{
  private _photoFieldFormat:PhotoFieldFormat = PhotoFieldFormat.PASSPORT_PHOTO;

  get photoFieldFormat():PhotoFieldFormat{
    return this._photoFieldFormat;
  }

  set photoFieldFormat(photoFieldFormat:PhotoFieldFormat){
    this._photoFieldFormat = photoFieldFormat;
  }
  
  getAllPhotoFieldFormats():string[]{
    return Object.values(PhotoFieldFormat);
  }

  prepareSpecificTagAttributes(): void {
    this.tag.setAttribute("format", PhotoFieldFormat.PASSPORT_PHOTO == this.photoFieldFormat ? QuickEditFieldFormat.PASSPORT_PHOTO_FIELD.toString() : PhotoFieldFormat.ADHAR_CARD == this.photoFieldFormat ? QuickEditFieldFormat.ADHAR_CARD_PHOTO_FIELD.toString() :  PhotoFieldFormat.FOUR_BY_SIX == this.photoFieldFormat ? QuickEditFieldFormat.FOUR_BY_SIX_PHOTO_FIELD.toString() : QuickEditFieldFormat.FIVE_BY_SEVEN_PHOTO_FIELD.toString());
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
  plainInputField:any               = new PlainInputField();
  dividedInputField                 = new DividedInputField();
  tabData                           = {
                                      [Tab.LABEL]  :  this.plainInputField,
                                      [Tab.CHOICE] :  new ChoiceField(),
                                      [Tab.DATE]   :  new DateField(),
                                      [Tab.PHOTO]  :  new PhotoField(),
                                      [Tab.BLOCK]  :  new PhotoField(),
                                    };

  fieldPool:QuickEditField[]        = [];
  repeatField!:QuickEditField;

  constructor(public _fontService:FontService) {
    this.editorConfig.setTools(ToolGroup.FILE, [FileToolGroup.FIND, FileToolGroup.FIND_AND_REPLACE]);
    this.editorConfig.setTools(ToolGroup.HOME, [HomeToolGroup.UNDO, HomeToolGroup.REDO, HomeToolGroup.SUPERSCRIPT, HomeToolGroup.SUPERSCRIPT, HomeToolGroup.CHANGE_CASE,
                                                  HomeToolGroup.FORECOLOR, HomeToolGroup.HIGHLIGHT, HomeToolGroup.JUSTIFY, HomeToolGroup.INDENT, HomeToolGroup.OUTDENT,
                                                  HomeToolGroup.BULLETED_LIST, HomeToolGroup.NUMBERED_LIST, HomeToolGroup.SYMBOL, HomeToolGroup.IMAGE]);
    this.editorConfig.setTools(ToolGroup.TABLE, [TableToolGroup.TABLE, TableToolGroup.MERGE_CELLS, TableToolGroup.SPLIT_CELL, TableToolGroup.INSERT_COLUMNS_AND_ROWS, TableToolGroup.DELETE_COLUMNS_AND_ROWS]);
    this.editorConfig.setTools(ToolGroup.LAYOUT, [LayoutToolGroup.PAGE_SIZE, LayoutToolGroup.PAGE_ORIENTATION, LayoutToolGroup.PAGE_MARGINS, LayoutToolGroup.PAGE_NUMBER]);
    this.editorConfig.setTools(ToolGroup.BLOCK, [BlockToolGroup.PERSONAL_INFO]);
  }

  ngOnInit(): void {}

  updateDraft(draftElement:HTMLDivElement){
    this.latestDraft  = draftElement;
    this.fieldPool    = []
  }

  insert():void{
    if(!this.isSelectionInsideView()) return;

    this.tabData[this.selectedTabIndex as Tab].insert(window.getSelection());
    this.fieldPool.push(this.tabData[this.selectedTabIndex as Tab].clone());

    if(1 == this.fieldPool.length)
      this.repeatField = this.fieldPool[0];
  }

  repeat():void{
    if(!this.isSelectionInsideView()) return;

    this.repeatField.repeat(window.getSelection() as Selection);
  }

  isSelectionInsideView() : boolean{
    let selectionContainer:any = window.getSelection()!.getRangeAt(0)!.commonAncestorContainer;

    while( !!selectionContainer && ( Node.TEXT_NODE == selectionContainer.nodeType || !selectionContainer.id.includes("view-app-page")) ) {
      selectionContainer = selectionContainer?.parentElement;
    }

    return !!selectionContainer;
  }
}
