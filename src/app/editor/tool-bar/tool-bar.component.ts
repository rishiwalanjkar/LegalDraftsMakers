import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImageType } from 'src/app/custom-mat-form-fields/mat-image-upload-field/mat-image-upload-field.component';
import { Font, FontService } from 'src/app/font/font.service';
import { LanguageService } from 'src/app/language/language.service';
import { EditorConfig } from '../editor.component';
import { EditorService } from '../editor.service';
import { Underline, ColorPalette, ToolFactory, Tool, ButtonWithSelectTool, BulletedList, DialogTool, SymbolFlag, ToolGroup, ToolCommand, SelectTool, FileToolGroup, HomeToolGroup, LayoutToolGroup, TableToolGroup, BlockToolGroup } from './tools/tool-bar';


@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() config!:EditorConfig;
  fileToolGroup                     = FileToolGroup;
  homeToolGroup                     = HomeToolGroup;
  tableToolGroup                    = TableToolGroup;
  layoutToolGroup                   = LayoutToolGroup;
  blockToolGroup                    = BlockToolGroup;
  @Input() color!:string;

  selectedTabIndex:number           = 1;
  triggerToolSubscription!:Subscription

  undo:Tool                         = ToolFactory.create(ToolCommand.UNDO);
  redo:Tool                         = ToolFactory.create(ToolCommand.REDO);
  find:Tool                         = ToolFactory.create(ToolCommand.FIND);
  replace:Tool                      = ToolFactory.create(ToolCommand.FIND_AND_REPLACE);
  // fileOpen:Tool                     = ToolFactory.create(ToolCommand.);
  print:Tool                        = ToolFactory.create(ToolCommand.PRINT);
  save:Tool                         = ToolFactory.create(ToolCommand.SAVE);
  alignmentGroup:Tool               = ToolFactory.create(ToolCommand.JUSTIFY);
  indentDecrease:Tool               = ToolFactory.create(ToolCommand.OUTDENT);
  indentIncrease:Tool               = ToolFactory.create(ToolCommand.INDENT);
  bulletedList:Tool                 = ToolFactory.create(ToolCommand.BULLETED_LIST);
  numberedList:Tool                 = ToolFactory.create(ToolCommand.NUMBERED_LIST);
  table:Tool                        = ToolFactory.create(ToolCommand.INSERT_TABLE);
  mergeTableCell:Tool               = ToolFactory.create(ToolCommand.MERGE_CELLS);
  splitTableCell:Tool               = ToolFactory.create(ToolCommand.SPLIT_CELL);
  insertTableColumnsAndRows:Tool    = ToolFactory.create(ToolCommand.INSERT_COLUMNS_AND_ROWS);
  deleteTableColumnsAndRows:Tool     = ToolFactory.create(ToolCommand.DELETE_COLUMNS_AND_ROWS);
  symbol:Tool                       = ToolFactory.create(ToolCommand.INSERT_SYMBOL);
  image:Tool                        = ToolFactory.create(ToolCommand.INSERT_IMAGE);
  pageSize:Tool                     = ToolFactory.create(ToolCommand.PAGE_SIZE);
  pageOrientation:Tool              = ToolFactory.create(ToolCommand.PAGE_ORIENTATION);
  pageMargin:Tool                   = ToolFactory.create(ToolCommand.PAGE_MARGINS);
  font:Tool                         = ToolFactory.create(ToolCommand.SET_FONT); 
  fontSize:Tool                     = ToolFactory.create(ToolCommand.SET_FONT_SIZE);
  changeCase:Tool                   = ToolFactory.create(ToolCommand.CHANGE_CASE);
  bold:Tool                         = ToolFactory.create(ToolCommand.BOLD);
  italic:Tool                       = ToolFactory.create(ToolCommand.ITALIC);
  underline:Tool                    = ToolFactory.create(ToolCommand.UNDERLINE);
  lineSpacing:Tool                  = ToolFactory.create(ToolCommand.LINE_SPACING)
  superscript:Tool                  = ToolFactory.create(ToolCommand.SUPERSCRIPT);
  subscript:Tool                    = ToolFactory.create(ToolCommand.SUBSCRIPT);
  textColor:Tool                    = ToolFactory.create(ToolCommand.FORECOLOR);
  highlight:Tool                    = ToolFactory.create(ToolCommand.HIGHLIGHT);
  pageNumber:Tool                   = ToolFactory.create(ToolCommand.PAGE_NUMBER);
  personalInfo:Tool                 = ToolFactory.create(ToolCommand.PERSONAL_INFO);
  
  @ViewChild("findTmpl") findTmpl!:TemplateRef<any>;
  @ViewChild("replaceTmpl") replaceTmpl!:TemplateRef<any>;
  @ViewChild("bulletedListTmpl") bulletedListTmpl!:TemplateRef<any>;
  @ViewChild("tableTmpl") tableTmpl!:TemplateRef<any>; 
  @ViewChild("splitTableCellTmpl") splitTableCellTmpl!:TemplateRef<any>;
  @ViewChild("insertColumnsAndRowsTmpl") insertColumnsAndRowsTmpl!:TemplateRef<any>;
  @ViewChild("deleteTableColumnsAndRowsTmpl") deleteTableColumnsAndRowsTmpl!:TemplateRef<any>;
  @ViewChild("symbolTmpl") symbolTmpl!:TemplateRef<any>;
  @ViewChild("passportPhotoTmpl") passportPhotoTmpl!:TemplateRef<any>;
  @ViewChild("imageTmpl") imageTmpl!:TemplateRef<any>;
  @ViewChild("pageMarginTmpl") pageMarginTmpl!:TemplateRef<any>;
  @ViewChild('underlineTmpl') underlineTmpl!:TemplateRef<any>;
  @ViewChild('colorPaletteTmpl') colorPaletteTmpl!:TemplateRef<any>;
  @ViewChild('pageNumberTmpl') pageNumberTmpl!:TemplateRef<any>;
  @ViewChild('personalInfoTmpl') personalInfoTmpl!:TemplateRef<any>;

  toolGroup                         = ToolGroup;
  bulletedListType                  = BulletedList;
  symbolFlags                       = SymbolFlag;
  unerlineType                      = Underline;
  colorPalette                      = ColorPalette;
  imageType                         = ImageType;

  constructor(private _changeDetectorRef: ChangeDetectorRef, 
    private _editorService:EditorService, 
    public fontService:FontService,
    public languageService:LanguageService) {

      Tool.setLanguageService(this.languageService);
      Tool.setEditorService(this._editorService);

      this.triggerToolSubscription = this._editorService.onTriggerTool().subscribe((toolCommand:ToolCommand)=>{
        this.selectedTabIndex = Object.values(ToolGroup).indexOf(Tool.tools[toolCommand].toolGroup);
        setTimeout(()=>Tool.tools[toolCommand].triggerClick(), 0.01);
      });
  }

  ngOnDestroy(): void {
    this.triggerToolSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {    
    this.setSelectOrDialogToolContents();
    this._changeDetectorRef.detectChanges();
  }

  setSelectOrDialogToolContents(){
    (this.find as DialogTool).setContent(this.findTmpl);
    (this.replace as DialogTool).setContent(this.replaceTmpl);
    (this.table as DialogTool).setContent(this.tableTmpl);
    (this.splitTableCell as DialogTool).setContent(this.splitTableCellTmpl);
    (this.insertTableColumnsAndRows as DialogTool).setContent(this.insertColumnsAndRowsTmpl);
    (this.deleteTableColumnsAndRows as DialogTool).setContent(this.deleteTableColumnsAndRowsTmpl);    
    (this.pageMargin as DialogTool).setContent(this.pageMarginTmpl);
    (this.image as DialogTool).setContent(this.imageTmpl);
    (this.symbol as DialogTool).setContent(this.symbolTmpl);
    (this.pageNumber as DialogTool).setContent(this.pageNumberTmpl);
    (this.personalInfo as DialogTool).setContent(this.personalInfoTmpl);

    setTimeout(() => (this.font as SelectTool).setOptions(this.fontService.fetchFonts()), 1);
    (this.underline as ButtonWithSelectTool).setOptions(this.underlineTmpl, Underline);
    (this.textColor as ButtonWithSelectTool).setOptions(this.colorPaletteTmpl, ColorPalette);
    (this.highlight as ButtonWithSelectTool).setOptions(this.colorPaletteTmpl, ColorPalette);
    (this.bulletedList as ButtonWithSelectTool).setOptions(this.bulletedListTmpl, BulletedList);
  }

  get selectedFont():Font{
    return (this.font as SelectTool).selected;
  }

  ngOnInit(): void {
    Tool.setConfig(this.config);
  }
}


