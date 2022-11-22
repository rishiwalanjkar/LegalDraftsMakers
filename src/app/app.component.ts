import { Component } from '@angular/core';

export enum Opaque{
  OpaqueLevel1  = "opaque-1",
  OpaqueLevel2  = "opaque-2",
  OpaqueLevel3  = "opaque-3",
  OpaqueLevel4  = "opaque-4",
  OpaqueLevel5  = "opaque-5",
  OpaqueLevel6  = "opaque-6",
  OpaqueLevel7  = "opaque-7",
  OpaqueLevel8  = "opaque-8",
  OpaqueLevel9  = "opaque-9",
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'LegalDraftsMakers';
}
