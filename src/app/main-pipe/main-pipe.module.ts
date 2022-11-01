import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { FormatHtmlSpacePipe } from './format-html-space.pipe';
import { JsonParsePipe } from './json-parse.pipe';
import { MatDividedInputPipe } from './mat-divided-input.pipe';
import { MatImageUploadFieldPipe } from './mat-image-upload-field.pipe';
import { IndexOfPipe } from './index-of.pipe';
import { BuildMatTableDataPipe } from './build-mat-table-data.pipe';
import { EnableAddRemovePipe } from './enable-add-remove.pipe'

@NgModule({
  declarations: [SafeHtmlPipe, FormatHtmlSpacePipe, JsonParsePipe, MatDividedInputPipe, MatImageUploadFieldPipe, IndexOfPipe, BuildMatTableDataPipe, EnableAddRemovePipe],
  imports: [
    CommonModule
  ],
  exports:[SafeHtmlPipe, FormatHtmlSpacePipe, JsonParsePipe, MatDividedInputPipe, MatImageUploadFieldPipe, IndexOfPipe, BuildMatTableDataPipe, EnableAddRemovePipe],
  providers:[SafeHtmlPipe]
})
export class MainPipeModule { }
