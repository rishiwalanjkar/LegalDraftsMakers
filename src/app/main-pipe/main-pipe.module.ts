import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from './safe-html.pipe'

@NgModule({
  declarations: [SafeHtml],
  imports: [
    CommonModule
  ],
  exports:[SafeHtml]
})
export class MainPipeModule { }
