import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { FormatHtmlSpacePipe } from './format-html-space.pipe'

@NgModule({
  declarations: [SafeHtmlPipe, FormatHtmlSpacePipe],
  imports: [
    CommonModule
  ],
  exports:[SafeHtmlPipe, FormatHtmlSpacePipe]
})
export class MainPipeModule { }
