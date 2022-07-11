import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDividedInput } from '../custom-mat-form-fields/mat-divided-input/mat-divided-input.component';
import { EditorConfig } from '../editor/editor.component';
import { FileToolGroup, HomeToolGroup, LayoutToolGroup, TableToolGroup, ToolGroup } from '../editor/tool-bar/tools/tool-bar';

@Component({
  selector: 'app-create-draft-template',
  templateUrl: './create-draft-template.component.html',
  styleUrls: ['./create-draft-template.component.scss']
})
export class CreateDraftTemplateComponent implements OnInit {
  editorConfig:EditorConfig         = new EditorConfig();
  latestDraft:HTMLDivElement        = document.createElement("div");
  widgetColor:ThemePalette          = "primary";

  labelTab:any                      = {
                                        data                      : {
                                                                    textBoxChoice             : "plain",
                                                                    textBoxParts              : 1,
                                                                    divideTextBoxSeparator    : "-",
                                                                    defaultTypeLength         : {type:"text", maxLength:3},
                                                                    textBoxTypeLengthGroup    : [],
                                                                  },
                                        getTypeLengthGroupNumber  : (i:number) => 1 < this.labelTab.data.textBoxParts ? i+1 : "",
                                        getTextBoxParts           : () => {
                                                                    this.labelTab.data.textBoxTypeLengthGroup = new Array();

                                                                    for(let i = 0; i < this.labelTab.data.textBoxParts; i++)
                                                                      this.labelTab.data.textBoxTypeLengthGroup.push(JSON.parse(JSON.stringify(this.labelTab.data.defaultTypeLength)));

                                                                    return new Array(this.labelTab.data.textBoxParts);
                                                                  },
                                        isShowDividedTextBox      : ():boolean => {
                                                                    if("plain" == this.labelTab.data.textBoxChoice) this.labelTab.data.textBoxParts = 1;
                                                                
                                                                    return "divided" == this.labelTab.data.textBoxChoice;
                                                                  }
                                      };

  choiceTab:any                     = {
                                        data                : {
                                                              displayType : "radio",
                                                              options     : [{option:"", output:""},
                                                                              {option:"", output:""}
                                                                          ]
                                                            },
                                        addOption           : () => this.choiceTab.data.options.push({option:"", output:""}),
                                        removeOption        : () => this.choiceTab.data.options.pop(),
                                        isShowRemoveButton  : () => 2 < this.choiceTab.data.options.length
                                      };

  dateTab:any                       = {
                                        data  : {
                                                fieldType : "today"
                                              }
                                    };

  photoTab:any                      = {
                                        data  : {
                                                photoType : "passport"
                                              }
                                    };

  

  constructor() {
    this.editorConfig.setTools(ToolGroup.FILE, [FileToolGroup.FIND, FileToolGroup.FIND_AND_REPLACE]);
    this.editorConfig.setTools(ToolGroup.HOME, [HomeToolGroup.UNDO, HomeToolGroup.REDO, HomeToolGroup.SUPERSCRIPT, HomeToolGroup.SUPERSCRIPT, HomeToolGroup.CHANGE_CASE,
                                                  HomeToolGroup.FORECOLOR, HomeToolGroup.HIGHLIGHT, HomeToolGroup.JUSTIFY, HomeToolGroup.INDENT, HomeToolGroup.OUTDENT,
                                                  HomeToolGroup.BULLETED_LIST, HomeToolGroup.NUMBERED_LIST, HomeToolGroup.SYMBOL, HomeToolGroup.IMAGE]);
    this.editorConfig.setTools(ToolGroup.TABLE, [TableToolGroup.TABLE, TableToolGroup.MERGE_CELLS, TableToolGroup.SPLIT_CELL, TableToolGroup.INSERT_COLUMNS_AND_ROWS, TableToolGroup.DELETE_COLUMNS_AND_ROWS]);
    this.editorConfig.setTools(ToolGroup.LAYOUT, [LayoutToolGroup.PAGE_SIZE, LayoutToolGroup.PAGE_ORIENTATION, LayoutToolGroup.PAGE_MARGINS, LayoutToolGroup.PAGE_NUMBER]);
  }

  ngOnInit(): void {
  }

  updateDraft(draftElement:HTMLDivElement){
    this.latestDraft = draftElement;
  }
}
