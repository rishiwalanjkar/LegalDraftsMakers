import { Component, OnInit } from '@angular/core';
import { EditorConfig } from '../editor/editor.component';
import { FileToolGroup, HomeToolGroup, LayoutToolGroup, TableToolGroup, ToolGroup } from '../editor/tool-bar/tools/tool-bar';

@Component({
  selector: 'app-blank-draft',
  templateUrl: './blank-draft.component.html',
  styleUrls: ['./blank-draft.component.scss']
})
export class BlankDraftComponent implements OnInit {
  editorConfig:EditorConfig = new EditorConfig();
  
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

}
