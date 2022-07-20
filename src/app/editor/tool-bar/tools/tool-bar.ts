import { TemplateRef } from "@angular/core";
import { EditorService } from "../../editor.service";
import { Page, PageDefaults, PageNumberAlignment, PageNumberType } from "../../page/page/page";

export enum FontLanguage{
    ENGLISH,
    DEVNAGARI
}

export interface Font{
    fontName:string;
    fontFamily:string;
    isConvert:boolean;
    language:FontLanguage
    keyMappings?:object;
}

export enum Conversion{
    MM_TO_PIXEL_FACTOR = 3.7795275591,
    PIXEL_TO_MM_FACTOR = 0.2645833333
}

export enum ImageDisplayType{
    BACKGROUNG = "Background",
    BLOCK = "Block"
}

export enum ToolGroup{
    FILE    = "File",
    HOME    = "Home",
    TABLE   = "Table",
    LAYOUT  = "Layout",
    BLOCK   = "Block"
}

export enum PageOrientation{
    PORTRAIT,
    LANDSCAPE
}

export enum WordCase{
    SENTENCE_CASE,
    LOWERCASE,
    UPPERCASE,
    CAPITALIZE_EACH_WORD,
    TOGGLE_CASE
}

export enum Underline{
    SINGLE  = "solid",
    DOUBLE  = "double",
    DOTTED  = "dotted",
    DASHED  = "dashed",
    WAVY    = "wavy"
}

export enum ColorPalette{
    MARIGOLD          = "#FDAC53",
    CERULEAN          = "#9BB7D4",
    RUST              = "#B55A30",
    ILLUMINATING      = "#F5DF4D",
    FRENCH_BLUE       = "#0072B5",
    BURNT_CORAL       = "#E9897E",
    MINT              = "#00A170",
    AMETHYST_ORCHID   = "#926AA6",
    RASPBERRY_SORBET  = "#D2386C",
    INKWELL           = "#363945",
    ULTIMATE_GRAY     = "#939597",
    BUTTER_CREAM      = "#EFE1CE",
    DESERT_MIST       = "#E0B589",
    WILLOW            = "#9A8B4F"
}

export enum BulletedList{
    HOLLOW_CIRCLE   = "circle",
    SHADED_CIRCLE   = "disc",
    SQUARE          = "square"
}

export class ImageEvents{
    public static imageHeightToWidthRatio:number;

    zoom(previewImageElement:any, imageControl:ImageControl, triggeredTool:DialogTool) {
        let size:string[]           = previewImageElement.style.backgroundSize.split(" "),
            width:number            = parseInt(size[0]),
            height:number           = parseInt(size[1]),
            zoomWidthFactor:number  = 10,
            zoomHeightFactor:number = ImageEvents.imageHeightToWidthRatio * 10;

        switch(imageControl){
            case ImageControl.ZOOM_IN:
                zoomWidthFactor     = zoomWidthFactor;
                zoomHeightFactor    = zoomHeightFactor;
                break;
                
            case ImageControl.ZOOM_OUT:
                if(100 >= width || 100 >= height) return;

                zoomWidthFactor     = -zoomWidthFactor;
                zoomHeightFactor    = -zoomHeightFactor;
        }

        previewImageElement.style.backgroundSize = (width + zoomWidthFactor) + "% " + (height + zoomHeightFactor) + "% ";
        triggeredTool.updateData({imageHTML:previewImageElement.cloneNode()});
    }

    upload(event:any, previewImageElement:any, triggeredTool:DialogTool) {
        if(event.target.files && event.target.files[0]){
            const file = event.target.files[0];

            let fileReader = new FileReader();

            fileReader.onload = (e) => {
                previewImageElement.style.backgroundImage = "url(" + fileReader.result + ")";
                triggeredTool.updateData({imageHTML:previewImageElement.cloneNode()});

                let img:any = new Image();      
                img.src = e?.target?.result;

                img.onload = function () {
                    ImageEvents.imageHeightToWidthRatio = this.height/this.width;
                }
            }

            fileReader.readAsDataURL(file);
        }
    }
    
    move(previewImageElement:any, imageControl:ImageControl, triggeredTool:DialogTool) {
        let backgroundPosition:string[] = previewImageElement.style.backgroundPosition.split(" "),
            backgroundPositionX:number  = parseInt(backgroundPosition[0]),
            backgroundPositionY:number  = parseInt(backgroundPosition[1]),
            moveFactorX                 = 0,
            moveFactorY                 = 0;

        switch(imageControl){
            case ImageControl.MOVE_TOP :
                if( 0 >= backgroundPositionY ) return;
                
                moveFactorY = - ImageControl.MOVE_FACTOR;
                break;

            case ImageControl.MOVE_RIGHT :
                if( 100 <= backgroundPositionX ) return;
                
                moveFactorX = ImageControl.MOVE_FACTOR
                break;

            case ImageControl.MOVE_BOTTOM :
                if( 100 <= backgroundPositionY ) return;
                
                moveFactorY = ImageControl.MOVE_FACTOR;
                break;

            case ImageControl.MOVE_LEFT :
                if( 0 >= backgroundPositionX ) return;
                
                moveFactorX = - ImageControl.MOVE_FACTOR
        }

        previewImageElement.style.backgroundPosition = (backgroundPositionX + moveFactorX) + "% " + (backgroundPositionY + moveFactorY) + "%";
        triggeredTool.updateData({imageHTML:previewImageElement.cloneNode()});
    }
}

export enum ImageControl {
    MOVE_TOP,
    MOVE_RIGHT,
    MOVE_BOTTOM,
    MOVE_LEFT,
    MOVE_FACTOR = 1,
    ZOOM_IN,
    ZOOM_OUT
}

export enum SymbolFlag{
    SYMBOLS,
    GRID_COLUMNS,
    GRID_TEMPLATE_COLUMNS,
    HAS_LEFT_BORDER,
    HAS_BOTTOM_BORDER,
    DEFAULT_SELECTED
}

export enum FileToolGroup{
    PRINT,
    SAVE,
    FIND,
    FIND_AND_REPLACE
}

export enum HomeToolGroup{
    UNDO,
    REDO,
    SET_FONT,
    SET_FONT_SIZE,
    BOLD,
    ITALIC,
    UNDERLINE,
    SUPERSCRIPT,
    SUBSCRIPT,
    CHANGE_CASE,
    FORECOLOR,
    HIGHLIGHT,
    JUSTIFY,
    INDENT,
    OUTDENT,
    BULLETED_LIST,
    NUMBERED_LIST,
    SYMBOL,
    IMAGE
}

export enum TableToolGroup{
    TABLE,
    MERGE_CELLS,
    SPLIT_CELL,
    INSERT_COLUMNS_AND_ROWS,
    DELETE_COLUMNS_AND_ROWS
}

export enum LayoutToolGroup{
    PAGE_SIZE,
    PAGE_ORIENTATION,
    PAGE_MARGINS,
    PAGE_NUMBER
}

export enum BlockToolGroup{
    PERSONAL_INFO
}

export enum ToolCommand{
    DEFAULT,
    PRINT,
    SAVE,
    FIND,
    FIND_AND_REPLACE,
    UNDO,
    REDO,
    SET_FONT,
    SET_FONT_SIZE,
    BOLD,
    ITALIC,
    UNDERLINE,
    SUPERSCRIPT,
    SUBSCRIPT,
    CHANGE_CASE,
    FORECOLOR,
    HIGHLIGHT,
    JUSTIFY,
    JUSTIFY_LEFT,
    JUSTIFY_CENTER,
    JUSTIFY_RIGHT,
    JUSTIFY_ALL,
    INDENT,
    OUTDENT,
    BULLETED_LIST,
    NUMBERED_LIST,
    INSERT_TABLE,
    MERGE_CELLS,
    SPLIT_CELL,
    INSERT_COLUMNS_AND_ROWS,
    DELETE_COLUMNS_AND_ROWS,
    INSERT_SYMBOL,
    INSERT_IMAGE,
    PAGE_SIZE,
    PAGE_ORIENTATION,
    PAGE_MARGINS,
    PAGE_NUMBER,
    PERSONAL_INFO
}

export abstract class Tool{
    private _id:string              = "";
    private _label:string           = "";
    private _matIcon:string         = "";
    private _toolTip:string         = "";
    private static _editorService:EditorService;
    private _toolGroup!:ToolGroup;
    public static transmuteTools    = new Array<Tool>(Object.keys(ToolCommand).length);
    public static tools             = new Array<Tool>(Object.keys(ToolCommand).length);


    constructor(private _command:ToolCommand){
        this.setId("tool-"+this._command);
        Tool.tools[this._command] = this;
    }

    get label():string{
        return this._label;
    }

    get icon():string{
        return this._matIcon;
    }

    get toolTip():string{
        return this._toolTip;
    }

    get editorService():EditorService{
        return Tool._editorService;
    }

    get id():string{
        return this._id;
    }

    get command():ToolCommand{
        return this._command;
    }

    get toolGroup():ToolGroup{
        return this._toolGroup;
    }

    setToolGroup(toolGroup:ToolGroup):void{
        this._toolGroup = toolGroup;
    }

    setId(id:string):void{
        this._id = id;
    }

    static setEditorService(editorService:EditorService):void{
        Tool._editorService = editorService;
    }

    setLabel(label:string):void{
        this._label = label;
    }

    setIcon(icon:string):void{
        this._matIcon = icon;
    }

    setToolTip(toolTip:string):void{
        this._toolTip = toolTip;
    }

    markTransmute():void{
        Tool.transmuteTools[this._command] = this;
    }

    beforeClickHandler:any =  (data:any)=>{};

    beforeClick(fn:any):void{
        this.beforeClickHandler = fn;
    };

    click(data:any):void{
        if(!!this._command) {
            this.beforeClickHandler(data);
            this.editorService.triggerCommand(this._command, data);
            this.afterClickHandler(data);
        }
        else
            console.error("Command is not set. Please provide it.");

    };

    afterClickHandler:any =  (data:any)=>{};

    afterClick(fn:any):void{
        this.afterClickHandler = fn;
    };

    abstract updateView(data:any):void;
    abstract triggerClick():void;
    
    hasLabel():boolean{
        return this._label.length > 0;
    }

    hasIcon():boolean{
        return this._matIcon.length > 0;
    }

}

export abstract class ButtonTool extends Tool implements Iterable<ButtonTool>{
    private _toggle : boolean = false;
    private _on:boolean = false;

    constructor(command:ToolCommand){
        super(command);
    }
    
    get isToggle():boolean{
        return this._toggle;
    }

    setToggle(toggle:boolean) {
        this._toggle = toggle;
    }

    on():void{
        this._on = true;
    }

    off():void{
        this._on = false;
    }

    toggle():void{
        if(this.isON)
            this.off()
        else
            this.on();
    }

    get isON():boolean{
        return this._on;
    }

    abstract isSolo():boolean;
    abstract isGroup():boolean;
    abstract [Symbol.iterator](): Iterator<ButtonTool, ButtonTool, undefined>;
}
  
export class SoloButtonTool extends ButtonTool{

    constructor(command:ToolCommand){
        super(command);
    }

    isSolo(): boolean {
        return true;
    }

    isGroup(): boolean {
        return false;
    }

    updateView(data: any): void {
        if(!!data)
            this.on();
        else 
            this.off();
    }

    [Symbol.iterator](): Iterator<ButtonTool, ButtonTool, undefined> {
        let $thisRef = this;
        let isRead = false;

        return {
            next() {
                if(!isRead) {
                    isRead = true;
                    return {value :$thisRef, done :false} 
                } else 
                    return {value :$thisRef, done :true};
            }
        }
    }

    override click(data: any): void {
        super.click(data);
        this.toggle();
    }

    triggerClick(): void {
        (document.getElementById(this.id)?.firstChild as HTMLElement).click();
    }
}
  
export class ButtonGroupTool extends ButtonTool{
    private buttonToolGroup :SoloButtonTool[] = [];

    constructor(command:ToolCommand){
        super(command);
    }

    add(soloButtonTool:SoloButtonTool):void{
        this.buttonToolGroup.push(soloButtonTool);
    }

    isSolo(): boolean {
        return false;
    }

    isGroup(): boolean {
        return true;
    }

    updateView(data: any): void {
        
    }
    
    [Symbol.iterator](): Iterator<ButtonTool, ButtonTool, undefined> {
        let $thisRef = this;
        let i = 0;

        return {
            next() {
            if($thisRef.buttonToolGroup[i] !== undefined)
                return {value :$thisRef.buttonToolGroup[i++], done :false};
            else 
                return {value :$thisRef.buttonToolGroup[i++], done :true};
            }
        }
    }

    triggerClick(): void {
        // (document.getElementById(this.id)?.firstChild as HTMLElement).click();
    }
}
  
export class SelectOption{
    
    constructor(private _label:string|TemplateRef<any>, private _value:any, private _matIcon?:string){}

    get isTemplate():boolean{
        return this._label instanceof TemplateRef;
    }

    get label():string{
        return this._label as string;
    }

    get icon():string|undefined{
        return this._matIcon;
    }

    get value():any{
        return this._value;
    }

    get template():TemplateRef<any>{
        return this._label as TemplateRef<any>;
    }

    hasIcon():boolean{
        return !!this._matIcon;
    }

    setLabel(label:string|TemplateRef<any>):void{
        this._label = label;
    }

    setIcon(icon:string):void{
        this._matIcon = icon;
    }

    setValue(value:any):void{
        this._value = value;
    }
}  
  
export class SelectTool extends Tool{
    private _options:SelectOption[] = [];
    private _selected!:any;
    
    constructor(command:ToolCommand){
        super(command);
    }

    get width():number{
        return (this.hasIcon() && !this.hasLabel()) ? 60 : 180;
    }

    get selected():any{
        return this._selected;
    }

    set selected(selected:any){
        this._selected = selected;
    }

    addOption(options:SelectOption):void{
        this._options.push(options);

        if("undefined" == typeof this._selected && 0 < this._options.length )
            this._selected = this._options[0].value;
    }

    setOptions(options:SelectOption[]):void{
        this._options = options;
        
        if(0 < options.length)
            this.selected = options[0].value;
    }

    get options():SelectOption[]{
        return this._options;
    }

    setSelected(selected:any){
        this._selected = selected;
    }

    updateView(data: any): void {
        if(!!data) 
            this.setSelected(data);  
    }


    triggerClick(): void {
        // (document.getElementById(this.id)?.firstChild as HTMLElement).click();
    }

}

export class ButtonWithSelectTool extends Tool{
    private _buttonTool!:SoloButtonTool;
    private _selectTool!:SelectTool;

    constructor(command:ToolCommand){
        super(command);
        this._buttonTool = new SoloButtonTool(command);
        this._selectTool = new SelectTool(command);
    }

    get isToggle():boolean{
        return this._buttonTool.isToggle;
    }

    get isON():boolean{
        return this._buttonTool.isON;
    }

    setToggle(toggle:boolean):void{
        this._buttonTool.setToggle(toggle);
    }

    get selected():SelectTool{
        return this._selectTool.selected;
    }

    set selected(selected:any){
        this._selectTool.selected = selected;
    }

    setButtonTool(buttonTool:SoloButtonTool):void{
        this._buttonTool = buttonTool;
    }

    setSelectTool(selectTool:SelectTool):void{
        this._selectTool = selectTool;
    }

    get options():SelectOption[]{
        return this._selectTool.options;
    }

    addOption(item:SelectOption):void{
        this._selectTool.addOption(item);
    }

    setOptions(list:any, enumOptions?:any):void{
        switch(true){
        case Array.isArray(list):
            this._selectTool.setOptions(list);
        break;

        case list instanceof TemplateRef:
            for( const option of Object.keys(enumOptions)){
                let selectOption =  new SelectOption(list, enumOptions[option]);

                this._selectTool.addOption(selectOption);
            }
        }
    }
    
    on():void{
        this._buttonTool.on();
    }

    off():void{
        this._buttonTool.off();
    }

    setSelected(selected:any){
        this._selectTool.selected = selected;
    }

    updateView(data: any): void {
        this._buttonTool.updateView(data);
        this._selectTool.updateView(data);
    }

    override click(): void {
        this._buttonTool.click(this.selected);
    }
    
    triggerClick(): void {
        (document.getElementById(this.id)?.firstChild as HTMLElement).click();
    }
}
  
export class DialogTool extends Tool { 
    _caption:string             = "Dialog";
    _content!:TemplateRef<any>;
    _witdh:number               = 250;
    _height!:number;
    _events!:object;
    _data!:object;
    _successButtonCaption       = "Ok";

    constructor(command:ToolCommand){
        super(command);
    }

    get caption():string{
        return this._caption;
    }

    setCaption(caption:string):void{
        this._caption = caption;
    }

    get content():TemplateRef<any>{
        return this._content;
    }

    setContent(content:TemplateRef<any>):void{
        this._content = content;
    }

    get width():number{
        return this._witdh;
    }

    setWidth(width:number){
        this._witdh = width;
    }

    get height():number{
        return this._height;
    }

    setHeight(height:number){
        this._height = height;
    }

    get events():object{
        return this._events;
    }

    setEvents(events:object){
        this._events = events;
    }

    get data():object{
        return this._data;
    }

    set data(data:object){
        this._data = data;
    }

    get successButtonCaption():string{
        return this._successButtonCaption;
    }

    setSuccessButtonCaption(successButtonCaption:string):void{
        this._successButtonCaption = successButtonCaption;
    }

    addData(data:object):void{
        Object.assign(this._data, data);
    }

    setData(data:object):void{
        this._data = data;
    }

    getData():any{
        return this._data;
    }

    updateData(data:object):void{
        Object.defineProperty(this._data, Object.keys(data)[0], {value: Object.values(data)[0]});
    }

    updateView(data: any): void {

    }

    override click(): void {
        super.click(this.data);
    }

    triggerClick(): void {
        (document.getElementById(this.id)?.firstChild as HTMLElement).click();
    }
}

export class ToolFactory{
    static create(option:ToolCommand):Tool{
        let tool:Tool = new SoloButtonTool(ToolCommand.DEFAULT);

        switch(option){
            case ToolCommand.UNDO:
                let undo:SoloButtonTool = new SoloButtonTool(option);
                undo.setIcon("undo");
                undo.setToolGroup(ToolGroup.HOME);
                undo.setToolTip("Undo changes");

                tool = undo;
                break;

            case ToolCommand.REDO:
                let redo:SoloButtonTool = new SoloButtonTool(option);
                redo.setIcon("redo");
                redo.setToolGroup(ToolGroup.HOME);
                redo.setToolTip("Redo changes");

                tool = redo;
                break;

            case ToolCommand.PRINT:
                let print:ButtonTool = new SoloButtonTool(option);
                print.setIcon("print");
                print.setToolGroup(ToolGroup.FILE);
                print.setToolTip("Print Draft");

                tool = print;
                break;
    
            case ToolCommand.SAVE:
                let save:ButtonTool = new SoloButtonTool(option);
                save.setIcon("saves");
                save.setToolGroup(ToolGroup.FILE);
                save.setToolTip("Save Draft");

                tool = save;
                break;
        
            case ToolCommand.FIND:
                let find:DialogTool = new DialogTool(option);
                find.setIcon("find_in_page");
                find.setCaption("Find");
                find.setToolTip("Find text in draft");
                find.setToolGroup(ToolGroup.FILE);
                find.setData({
                    searchText          : "",
                    previousSearchText  : ""
                });
                find.setSuccessButtonCaption("Find");
                find.afterClick((data:any)=>{
                    data.previousSearchText = data.searchText;
                });

                tool = find;
                break;

            case ToolCommand.FIND_AND_REPLACE:
                let replace:DialogTool = new DialogTool(option);
                replace.setIcon("find_replace");
                replace.setToolTip("Replace text in draft");
                replace.setCaption("Replace");
                replace.setToolGroup(ToolGroup.FILE);
                replace.setSuccessButtonCaption("Replace");
                replace.setData({
                    searchText  : "",
                    replaceText : ""
                });
                
                tool = replace;
                break;

            case ToolCommand.JUSTIFY:
                let alignmentGroup:ButtonGroupTool = new ButtonGroupTool(option) as ButtonGroupTool,
                alignLeft:ButtonTool            = new SoloButtonTool(ToolCommand.JUSTIFY_LEFT),
                alignCenter:ButtonTool          = new SoloButtonTool(ToolCommand.JUSTIFY_CENTER),
                alignRight:ButtonTool           = new SoloButtonTool(ToolCommand.JUSTIFY_RIGHT),
                justify:ButtonTool              = new SoloButtonTool(ToolCommand.JUSTIFY_ALL);

                alignLeft.setIcon("format_align_left");
                alignLeft.on();
                alignCenter.setIcon("format_align_center");
                alignRight.setIcon("format_align_right");
                justify.setIcon("format_align_justify");

                alignLeft.setToolTip("Left Align");
                alignCenter.setToolTip("Center Align");
                alignRight.setToolTip("Right Align");
                justify.setToolTip("Justify");

                alignmentGroup.add(alignLeft);
                alignmentGroup.add(alignCenter);
                alignmentGroup.add(alignRight);
                alignmentGroup.add(justify);
                alignmentGroup.setToggle(true);

                alignmentGroup.setToolGroup(ToolGroup.HOME);

                tool = alignmentGroup;
                break;

            case ToolCommand.INDENT:
                let indentIncrease:SoloButtonTool = new SoloButtonTool(option);
                indentIncrease.setIcon("format_indent_increase");
                indentIncrease.setToolGroup(ToolGroup.HOME);
                indentIncrease.setToolTip("Indent");

                tool = indentIncrease;
                break;

            case ToolCommand.OUTDENT:
                let indentDecrease:SoloButtonTool = new SoloButtonTool(option);
                indentDecrease.setIcon("format_indent_decrease");
                indentDecrease.setToolGroup(ToolGroup.HOME);
                indentDecrease.setToolTip("Outdent");

                tool = indentDecrease;
                break;
            
            case ToolCommand.BULLETED_LIST:
                let bulletedList:ButtonWithSelectTool  = new ButtonWithSelectTool(option);
                
                bulletedList.setIcon("format_list_bulleted");
                bulletedList.markTransmute();
                bulletedList.setToolGroup(ToolGroup.HOME);
                bulletedList.setToolTip("Insert bulleted list");

                tool = bulletedList;
                break;
            
            case ToolCommand.NUMBERED_LIST:
                let numberedList:ButtonWithSelectTool  = new ButtonWithSelectTool(option);
                
                numberedList.setIcon("format_list_numbered");
                numberedList.setToolTip("Insert numbered list");
                numberedList.setOptions([new SelectOption("1", "1"),
                                            new SelectOption("A", "A"),
                                            new SelectOption("a", "a"),
                                            new SelectOption("I", "I"),
                                            new SelectOption("i", "i")]);
                numberedList.setToolGroup(ToolGroup.HOME);
                numberedList.markTransmute();

                tool = numberedList;
                break;
            
            case ToolCommand.INSERT_TABLE:
                let table = new DialogTool(option);
                table.setIcon("table_chart");
                table.setCaption("Insert Table");
                table.setToolTip("Insert table");
                table.setWidth(500);
                table.setData({
                    hasHeader           : true,
                    hasAutoSerialize    : true,
                    rows                : 2,
                    minRows             : 2,
                    columns             : 2,
                    minColumns          : 2,
                    rowHeight           : 30,
                    minRowHeight        : 30,
                    headers             : (columns:number) => new Array(columns),
                    panelHeight         : (columns:number, headerInputHeight:number = 70) => headerInputHeight * (columns + 1) + 'px',
                    headerLabels        : []
                });
                table.setToolGroup(ToolGroup.TABLE);

                tool = table;
                break;

            case ToolCommand.MERGE_CELLS:
                let mergeTableCell = new SoloButtonTool(option);
                mergeTableCell.setIcon("compress");
                mergeTableCell.setToolTip("Merge selected cells");
                mergeTableCell.setToolGroup(ToolGroup.TABLE);

                tool = mergeTableCell;
                break;

            case ToolCommand.SPLIT_CELL:
                let splitTableCell = new DialogTool(option);
                splitTableCell.setCaption("Split Table Cell");
                splitTableCell.setIcon("expand");
                splitTableCell.setToolTip("Split selected cells");
                splitTableCell.setToolGroup(ToolGroup.TABLE);

                splitTableCell.setData({
                    columns     : 2,
                    minColumns  : 1,
                    rows        : 1,
                    minRows     : 1
                });

                tool = splitTableCell;
                break;

            case ToolCommand.INSERT_COLUMNS_AND_ROWS:
                let insertColumnAndRow = new DialogTool(option);
                insertColumnAndRow.setCaption("Insert Columns and Rows");
                insertColumnAndRow.setWidth(700);
                insertColumnAndRow.setIcon("add_box");
                insertColumnAndRow.setToolTip("Insert Column & Rows");
                insertColumnAndRow.setToolGroup(ToolGroup.TABLE);

                insertColumnAndRow.setData({
                    insertColumnsToRight    : 0,
                    minColumnsToRight       : 0,
                    insertColumnsToLeft     : 0,
                    minColumnsToLeft        : 0,
                    insertRowsAbove         : 0,
                    minRowsAbove            : 0,
                    insertRowsBelow         : 0,
                    minRowsBelow            : 0
                })

                tool = insertColumnAndRow;
                break;
                
            case ToolCommand.DELETE_COLUMNS_AND_ROWS:
                let deleteColumnsOrRows = new DialogTool(option);
                deleteColumnsOrRows.setCaption("Delete Columns or Rows");
                deleteColumnsOrRows.setWidth(400);
                deleteColumnsOrRows.setIcon("delete");
                deleteColumnsOrRows.setToolTip("Delete Columns or Rows");
                deleteColumnsOrRows.setToolGroup(ToolGroup.TABLE);

                deleteColumnsOrRows.setData({
                    deleteRows    : false,
                    deleteColumns : false,
                    deleteTable   : false
                })

                tool = deleteColumnsOrRows;
                break;
        
            case ToolCommand.INSERT_SYMBOL:
                let symbol = new DialogTool(option);
                symbol.setIcon("attach_money");
                symbol.setCaption("Insert Symbol");
                symbol.setToolTip("Insert symbol");
                symbol.setWidth(400);

                let events = {
                    symbols     : [...[...Array(15).keys()].map((i)=> "&#" + (i+33) + ";"), 
                                    ...[...Array(7).keys()].map((i)=> "&#" + (i+58) + ";"), 
                                    ...[...Array(6).keys()].map((i)=> "&#" + (i+91) + ";"),
                                    ...[...Array(4).keys()].map((i)=> "&#" + (i+123) + ";"),
                                    ...["&#169;", "&#174;", "&#8471;", "&#8482;", "&#8480;"],
                                    ...["&#8364;", "&#163;", "&#165;", "&#162;", "&#8377;", "&#8360;", "&#8369;", "&#8361;", "&#3647;", "&#8363;", "&#8362;"],
                                    ...[...Array(25).keys()].map((i)=> "&#" + (i+917) + ";"),
                                    ...[...Array(25).keys()].map((i)=> "&#" + (i+945) + ";")],
                    gridColumns : (i:number = 10) => {
                                        for(i; i > 0; i--) 
                                        if(0 == events.symbols.length % i) break;

                                        return i;
                                    },            
                    onLoad      : (flag:SymbolFlag, ...data:any) => {
                                    switch(flag){
                                        case SymbolFlag.GRID_COLUMNS:
                                        return events.gridColumns();
                            
                                        case SymbolFlag.GRID_TEMPLATE_COLUMNS:
                                        return "repeat(" + events.gridColumns() + ", 1Fr)";
                            
                                        case SymbolFlag.SYMBOLS:
                                        return events.symbols;
                                        
                                        case SymbolFlag.HAS_LEFT_BORDER:
                                        return 0 == data[0] % events.gridColumns();
                            
                                        case SymbolFlag.HAS_BOTTOM_BORDER:
                                        return (events.symbols.length - events.gridColumns() - 1) < data[0];

                                        case SymbolFlag.DEFAULT_SELECTED:
                                            return events.symbols[0];
                                    }
                                }
                }

                symbol.setEvents(events);
                symbol.setData({
                    selected    : events.onLoad(SymbolFlag.DEFAULT_SELECTED)
                });
                symbol.setToolGroup(ToolGroup.HOME);


                tool = symbol;
                break;
            
            case ToolCommand.PAGE_SIZE:
                let pageSize:SelectTool = new SelectTool(option);
                pageSize.setToolTip("Set page size");
                pageSize.setOptions([new SelectOption("A4", "[210, 297]"),
                                        new SelectOption("Legal", "[216, 356]")]);
                pageSize.setLabel("Page Size");
                pageSize.setToolGroup(ToolGroup.LAYOUT);
                
                tool = pageSize;
                break;

            case ToolCommand.PAGE_ORIENTATION:
                let pageOrientation:SelectTool = new SelectTool(option);
                pageOrientation.setToolTip("Set page oreintation");
                pageOrientation.setOptions([new SelectOption("", PageOrientation.PORTRAIT, "crop_portrait"),
                                            new SelectOption("", PageOrientation.LANDSCAPE, "crop_landscape")]);
                pageOrientation.setIcon("flip_camera_android");
                pageOrientation.setToolGroup(ToolGroup.LAYOUT);
                
                tool = pageOrientation;
                break;

            case ToolCommand.PAGE_MARGINS:
                let pageMargin = new DialogTool(option);
                pageMargin.setToolTip("Set page margin");
                pageMargin.setIcon("padding");
                pageMargin.setCaption("Page Margin");
                pageMargin.setWidth(900);
                pageMargin.setData({
                    isPageMirror    : false,
                    topPadding      : PageDefaults.PADDING,
                    rightPadding    : PageDefaults.PADDING,
                    bottomPadding   : PageDefaults.PADDING,
                    leftPadding     : PageDefaults.PADDING,
                    getLeftLabel    : () => pageMargin.getData().isPageMirror ? "Adjacent To Binding" : "Left",
                    getRightLabel   : () => pageMargin.getData().isPageMirror ? "Opposite To Binding" : "Right"
                });
                pageMargin.setToolGroup(ToolGroup.LAYOUT);

                tool = pageMargin;
                break;

            case ToolCommand.SET_FONT:
                let font:SelectTool = new SelectTool(option);
                font.setToolTip("Set font");
                font.setLabel("Font");
                font.setToolGroup(ToolGroup.HOME);
                font.markTransmute();

                tool = font;
                break;
            
            case ToolCommand.SET_FONT_SIZE:
                let fontSize:SelectTool = new SelectTool(option);
                fontSize.setToolTip("Set font size");
                fontSize.setOptions([new SelectOption("08", "08"),
                                        new SelectOption("09", "09"),
                                        new SelectOption("10", "10"),
                                        new SelectOption("11", "11"),
                                        new SelectOption("12", "12"),
                                        new SelectOption("14", "14"),
                                        new SelectOption("16", "16"),
                                        new SelectOption("18", "18"),
                                        new SelectOption("20", "20"),
                                        new SelectOption("22", "22"),
                                        new SelectOption("24", "24"),
                                        new SelectOption("26", "26"),
                                        new SelectOption("28", "28"),
                                        new SelectOption("36", "36"),
                                        new SelectOption("48", "48"),
                                        new SelectOption("72", "72")]);
                fontSize.setSelected("12");
                fontSize.setIcon("format_size");
                fontSize.setToolGroup(ToolGroup.HOME);
                fontSize.markTransmute();

                tool = fontSize;
                break;

            case ToolCommand.CHANGE_CASE:
                let changeCase = new ButtonWithSelectTool(option);
                changeCase.setToolTip("Change case");
                changeCase.setOptions([new SelectOption("<u>S</u>entence case", WordCase.SENTENCE_CASE.toString()),
                                        new SelectOption("lowercase", WordCase.LOWERCASE.toString()),
                                        new SelectOption("UPPERCASE", WordCase.UPPERCASE.toString()),
                                        new SelectOption("<u>C</u>apitalize <u>E</u>ach <u>W</u>ord", WordCase.CAPITALIZE_EACH_WORD.toString()),
                                        new SelectOption("<u>t</u>OGGLE <u>c</u>ASE", WordCase.TOGGLE_CASE.toString())]);
                changeCase.setLabel("Aa");
                changeCase.setToolGroup(ToolGroup.HOME);
                changeCase.markTransmute();

                tool = changeCase;
                break;

            case ToolCommand.BOLD:
                let bold:SoloButtonTool = new SoloButtonTool(option);
                bold.setToolTip("Bold the text");
                bold.setIcon("format_bold");
                bold.setToggle(true);
                bold.setToolGroup(ToolGroup.HOME);
                bold.markTransmute();

                tool = bold;
                break;

            case ToolCommand.ITALIC:
                let italic:SoloButtonTool = new SoloButtonTool(option);
                italic.setToolTip("Italic the text");
                italic.setIcon("format_italic");
                italic.setToggle(true);
                italic.setToolGroup(ToolGroup.HOME);
                italic.markTransmute();

                tool = italic;
                break;
            
            case ToolCommand.UNDERLINE:
                let underline:ButtonWithSelectTool  = new ButtonWithSelectTool(option);
                underline.setToolTip("Underline the text");
                underline.setIcon("format_underline");
                underline.setToggle(true);
                underline.setToolGroup(ToolGroup.HOME);
                underline.markTransmute();

                tool = underline;
                break;
            
            case ToolCommand.SUPERSCRIPT:
                let superscript:SoloButtonTool = new SoloButtonTool(option);
                superscript.setToolTip("Superscript the text");
                superscript.setIcon("superscript");
                superscript.setToolGroup(ToolGroup.HOME);

                tool = superscript;
                break;
            
            case ToolCommand.SUBSCRIPT:
                let subscript:SoloButtonTool = new SoloButtonTool(option);
                subscript.setToolTip("Subscript the text");
                subscript.setToolGroup(ToolGroup.HOME);

                tool = subscript;
                break;
                
            case ToolCommand.FORECOLOR:
                let textColor:ButtonWithSelectTool  = new ButtonWithSelectTool(option);
                textColor.setToolTip("Change the text color");
                textColor.setIcon("format_color_text");
                textColor.setToggle(true);
                textColor.setToolGroup(ToolGroup.HOME);

                textColor.markTransmute();

                tool = textColor;
                break;

            case ToolCommand.HIGHLIGHT:
                let highlight:ButtonWithSelectTool  = new ButtonWithSelectTool(option);
                highlight.setToolTip("Highlight the text");
                highlight.setIcon("highlight");
                highlight.setToggle(true);
                highlight.setToolGroup(ToolGroup.HOME);
                highlight.markTransmute();

                tool = highlight;
                break;

            case ToolCommand.INSERT_IMAGE:
                let image:DialogTool    = new DialogTool(option);;
                image.setToolTip("Insert the image");
                image.setIcon("image");
                image.setWidth(1200);
                image.setCaption("Insert Image");
                image.setToolGroup(ToolGroup.HOME);
                
                image.setData({
                    imageHTML               : new Object(),
                    width                   : ():string=>{
                                                return (ImageDisplayType.BACKGROUNG == image.getData().displayType) 
                                                    ? "100mm" 
                                                        : image.getData().selectedImageSize[0] + "mm";
                                            },
                    height                  : ():string=>{
                                                return (ImageDisplayType.BACKGROUNG == image.getData().displayType) 
                                                    ? "150mm" 
                                                        : image.getData().selectedImageSize[1] + "mm";
                                            },
                    displayType             : ImageDisplayType.BACKGROUNG,
                    getAllDisplayTypes      : ()=>Object.values(ImageDisplayType),
                    pageNumber              : 1,
                    maxPageNumber           : () => document.getElementsByTagName("app-page").length,
                    imageSizes              : {
                                                passportPhoto   : {
                                                                    label   : "Passport Photo", 
                                                                    size    : [51, 51]
                                                                },
                                                adharCard       : {
                                                                    label   : "Adhar Card", 
                                                                    size    : [85, 55]
                                                                },
                                                fourBySix       : {
                                                                    label   : "4*6", 
                                                                    size    : [101.6, 152.4]
                                                                },
                                                fiveBySeven     : {
                                                                    label   : "5*7", 
                                                                    size    : [127, 177.8]
                                                                }
                                            },
                    selectedImageSize       : [51, 51],
                    isShowMask              : ():boolean => ImageDisplayType.BLOCK == image.getData().displayType
                                                             && image.getData().selectedImageSize[0] == image.getData().imageSizes.passportPhoto.size[0]
                                                             && image.getData().selectedImageSize[1] == image.getData().imageSizes.passportPhoto.size[1],
                    getImageSizes           : () => Object.values(image.getData().imageSizes),
                    getPassPortPhotoMask    : () => "<path d='M" + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.5 +" 1 " +
                                                                    "L1 1 "+
                                                                    "1 " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.7 + 
                                                                    " " + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.4 + " " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.6 + 
                                                                    " " + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.4 + " " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.5 + 
                                                                    " C" + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.34 + " " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.53 + 
                                                                    " " + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.1 + " " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.04 + 
                                                                    " " + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.5 + " " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.05 + 
                                                                    " " + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.9 + " " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.04 + 
                                                                    " " + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.67 + " " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.53 + 
                                                                    " " + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.6 + " " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.5 + 
                                                                    " L" + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.6 + " " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.6 + 
                                                                    " " + (parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR - 1) + " " + parseInt(image.getData().imageSizes.passportPhoto.size[1]) * Conversion.MM_TO_PIXEL_FACTOR * 0.7 + 
                                                                    " " + (parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR - 1) +  " 1" +
                                                                    " " + parseInt(image.getData().imageSizes.passportPhoto.size[0]) * Conversion.MM_TO_PIXEL_FACTOR * 0.6 +" 1 " +
                                                                    " Z'/>"
                });

                image.setEvents(new ImageEvents());
                
                tool = image;
                break;
            
            case ToolCommand.PAGE_NUMBER:
                let pageNumber:DialogTool = new DialogTool(option);
                pageNumber.setToolTip("Insert the page number");
                pageNumber.setIcon("filter_1");
                pageNumber.setCaption("Page Number");
                pageNumber.setToolGroup(ToolGroup.LAYOUT);

                pageNumber.setData({
                    show                            : Page.isShowPageNumber,
                    pageNumberType                  : PageNumberType.FOOTER,
                    pageNumberAlignment             : PageNumberAlignment.RIGHT,
                    getAllPageNumberTypes           : () => Object.values(PageNumberType),
                    getAllPageNumberAlignmentLabels : () => Object.keys(PageNumberAlignment).map((key) => key.replace(/\w+/g, (txt)=> txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())),
                    getAllPageNumberAlignmentValues : (key:string) => (Object.values(PageNumberAlignment)[Object.keys(PageNumberAlignment).indexOf(key.toUpperCase())])
                })

                tool = pageNumber;
                break;
            
            case ToolCommand.PERSONAL_INFO:
                let personalInfo:DialogTool = new DialogTool(option);
                personalInfo.setToolTip("Insert personal information");
                personalInfo.setIcon("info");
                personalInfo.setCaption("Person Details Block");
                personalInfo.setToolGroup(ToolGroup.BLOCK);
                personalInfo.setWidth(700);

                personalInfo.setData({
                    blockCount              : 1,
                    blockCaption            : "",
                    blocks                  : [""],
                    getIndividualBlockLabel : (blockIndex:number) => 1 == personalInfo.getData().blockCount ? "Block" : "Block " + (blockIndex + 1),
                    getDummyBlocks          : (blockCount:number) => new Array(personalInfo.getData().blockCount)
                });

                tool = personalInfo;
                break;
        }

        return tool;
    }
}