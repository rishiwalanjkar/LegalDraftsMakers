import { Font, SelectTool, Tool, ToolCommand } from "../../tool-bar/tools/tool-bar";

export enum PageDefaults{
    WIDTH   = 210, 
    HEIGHT  = 297,
    PADDING = 25.4,
}

export enum PageNumberType{
    HEADER  = "Header",
    FOOTER  = "Footer"
}

export enum PageNumberAlignment{
    LEFT    = "flex-start", 
    CENTER  = "center",
    RIGHT   = "flex-end"
}

export class Page{
    private _size:[number, number]                  = [PageDefaults.WIDTH, PageDefaults.HEIGHT];

    private _rightPadding:number                    = PageDefaults.PADDING;
    private _leftPadding:number                     = PageDefaults.PADDING;
    private _contentWidth!:number;

    private _headerHeight:number                    = PageDefaults.PADDING;
    private _footerHeight:number                    = PageDefaults.PADDING;
    private _bodyHeight!:number;

    private _body:string                            = "";
    private _pageNumber!:number;

    private static _showHeaderPageNumber            = false;
    private static _showFooterPageNumber            = false;
    private static _pageNumberAlignment:PageNumberAlignment = PageNumberAlignment.RIGHT;         

    constructor(){
        this.calculateMeasurements();
    }

    setSize(size:[number, number]){
        this._size = size;
        this.calculateMeasurements();
    }

    get size():[number, number]{
        return this._size;
    }

    get width():number{
        return this._size[0];
    }

    get height():number{
        return this._size[1];
    }

    setLeftPadding(padding:number){
        this._leftPadding = padding;
        this.calculateContentWidth();
    }

    get leftPadding():number{
        return this._leftPadding;
    }

    setRightPadding(padding:number){
        this._rightPadding = padding;
        this.calculateContentWidth();
    }

    get rightPadding():number{
        return this._rightPadding;
    }

    setHeaderHeight(height:number):void{
        this._headerHeight = height;
        this.calculateBodyHeight();
    }

    get headerHeight():number{
        return this._headerHeight;
    }

    get bodyHeight():number{
        return this._bodyHeight;
    }

    setFooterHeight(footer:number):void{
        this._footerHeight = footer;
        this.calculateBodyHeight();
    }

    get footerHeight():number{
        return this._footerHeight;
    }

    calculateMeasurements():void{
        this.calculateContentWidth();
        this.calculateBodyHeight();
    }

    calculateBodyHeight():void{
        this._bodyHeight = this.size[1] - this.headerHeight - this.footerHeight;
    }

    calculateContentWidth():void{
        this._contentWidth = this.size[0] - this.rightPadding - this.leftPadding;
    }

    get contentWidth():number{
        return this._contentWidth;
    }

    get body():string{
        return this._body;
    }

    setBody(body:string){
        this._body = body
    }

    get pageNumber():number{
        return this._pageNumber;
    }

    setPageNumber(pageNumber:number){
        this._pageNumber = pageNumber;
    }

    public static setShowPageNumber(show:boolean, pageNumberType:PageNumberType){
        switch(pageNumberType){
            case PageNumberType.HEADER:
                Page._showHeaderPageNumber = true;
                Page._showFooterPageNumber = false;
                break;

            case PageNumberType.FOOTER:
                Page._showHeaderPageNumber = false;
                Page._showFooterPageNumber = true;
                break;
        }

        if(!show)
            Page._showHeaderPageNumber = Page._showFooterPageNumber = false;
    }

    public static setPageNumberAlignment(alignment:PageNumberAlignment){
        Page._pageNumberAlignment = alignment;
    }

    get isShowPageNumber():boolean{
        return Page._showHeaderPageNumber || Page._showFooterPageNumber;
    }

    get isShowHeaderPageNumber():boolean{
        return Page._showHeaderPageNumber;
    }

    get isShowFooterPageNumber():boolean{
        return Page._showFooterPageNumber;
    }

    get pageNumberAlignment():PageNumberAlignment{
        return Page._pageNumberAlignment;
    }

    static get isShowPageNumber():boolean{
        return Page._showHeaderPageNumber || Page._showFooterPageNumber;
    }

    static get isShowHeaderPageNumber():boolean{
        return Page._showHeaderPageNumber;
    }

    static get isShowFooterPageNumber():boolean{
        return Page._showFooterPageNumber;
    }

    get fontSize():string{
        return !!(Tool.tools[ToolCommand.SET_FONT_SIZE] as SelectTool)?.selected ? (Tool.tools[ToolCommand.SET_FONT_SIZE] as SelectTool)?.selected +"pt" : "";
    }

    get fontFamily():string{
        return !!((Tool.tools[ToolCommand.SET_FONT] as SelectTool)?.selected as Font)?.fontFamily ? ((Tool.tools[ToolCommand.SET_FONT] as SelectTool)?.selected as Font)?.fontFamily: "";
    }
}
