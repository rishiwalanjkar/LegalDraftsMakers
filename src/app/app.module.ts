import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { DashboardComponent } from './dashboard/dashboard.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';

import { SideNavComponent } from './side-nav/side-nav.component';
import { BlankDraftComponent } from './blank-draft/blank-draft.component';
import { ReadyDraftComponent } from './ready-draft/ready-draft.component';
import { LogIncomeComponent } from './log-income/log-income.component';
import { ViewIncomeComponent } from './view-income/view-income.component';
import { CreateCustomerProfileComponent } from './create-customer-profile/create-customer-profile.component';
import { ViewCustomersComponent } from './view-customers/view-customers.component';
import { ExtractEmailDocumentsComponent } from './extract-email-documents/extract-email-documents.component';
import { ExtractWhatsappDocumentsComponent } from './extract-whatsapp-documents/extract-whatsapp-documents.component';
import { UploadFontsComponent } from './upload-fonts/upload-fonts.component';
import { CreateDraftTemplateComponent } from './create-draft-template/create-draft-template.component';

import { EditorModule } from './editor/editor.module';
import { SharedModule } from './shared/shared.module';
import { ViewDraftComponent } from './draft/view-draft/view-draft.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SideNavComponent,
    BlankDraftComponent,
    ReadyDraftComponent,
    LogIncomeComponent,
    ViewIncomeComponent,
    CreateCustomerProfileComponent,
    ViewCustomersComponent,
    ExtractEmailDocumentsComponent,
    ExtractWhatsappDocumentsComponent,
    UploadFontsComponent,
    CreateDraftTemplateComponent,
    ViewDraftComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    HttpClientModule,
    EditorModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
