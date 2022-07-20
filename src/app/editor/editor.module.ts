import { NgModule } from '@angular/core';

import { EditorComponent } from './editor.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { StatusBarComponent } from './status-bar/status-bar.component';

import { ButtonToolComponent } from './tool-bar/tools/button-tool/button-tool.component';
import { SelectToolComponent } from './tool-bar/tools/select-tool/select-tool.component';
import { ButtonWithSelectToolComponent } from './tool-bar/tools/button-with-select-tool/button-with-select-tool.component';
import { DialogToolComponent } from './tool-bar/tools/dialog-tool/dialog-tool.component';
import { CustomToolComponent } from './tool-bar/tools/custom-tool/custom-tool.component';
import { PageComponent } from './page/page/page.component';
import { DemarcationDirective } from './page/directives/demarcation.directive';

import { SharedModule } from '../shared/shared.module'


@NgModule({
  declarations: [
    EditorComponent,
    ToolBarComponent,
    StatusBarComponent,
    ButtonToolComponent,
    SelectToolComponent,
    ButtonWithSelectToolComponent,
    DialogToolComponent,
    CustomToolComponent,
    PageComponent,
    DemarcationDirective
  ],
  imports: [
    SharedModule
  ],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }
