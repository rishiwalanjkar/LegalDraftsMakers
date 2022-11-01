import { Component, OnInit } from '@angular/core';
import { Draft } from '../draft/draft.service';
import { EditorConfig } from '../editor/editor.component';
import { ToolGroup } from '../editor/tool-bar/tools/tool-bar';

@Component({
  selector: 'app-blank-draft',
  templateUrl: './blank-draft.component.html',
  styleUrls: ['./blank-draft.component.scss']
})
export class BlankDraftComponent implements OnInit {
  editorConfig:EditorConfig = new EditorConfig();
  draft!:Draft;
  
  constructor() {
    this.editorConfig.setTools(ToolGroup.FILE);
    this.editorConfig.setTools(ToolGroup.HOME);
    this.editorConfig.setTools(ToolGroup.TABLE);
    this.editorConfig.setTools(ToolGroup.LAYOUT);
    this.editorConfig.setTools(ToolGroup.BLOCK);
  }

  ngOnInit(): void {
  }

}
