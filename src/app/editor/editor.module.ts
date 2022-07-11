import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';
import { ToolBarComponent } from './tool-bar/tool-bar.component';
import { StatusBarComponent } from './status-bar/status-bar.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatTabsModule} from '@angular/material/tabs';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';


import { ButtonToolComponent } from './tool-bar/tools/button-tool/button-tool.component';
import { SelectToolComponent } from './tool-bar/tools/select-tool/select-tool.component';
import { ButtonWithSelectToolComponent } from './tool-bar/tools/button-with-select-tool/button-with-select-tool.component';
import { DialogToolComponent } from './tool-bar/tools/dialog-tool/dialog-tool.component';
import { CustomToolComponent } from './tool-bar/tools/custom-tool/custom-tool.component';
import { PageComponent } from './page/page/page.component';
import { DemarcationDirective } from './page/directives/demarcation.directive';

import { MainPipeModule } from '../main-pipe/main-pipe.module';


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
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule, 
    ReactiveFormsModule,
    MatTabsModule,
    MatRadioModule,
    MainPipeModule,
    MatTooltipModule 
  ],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }
