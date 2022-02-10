import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankDraftComponent } from './blank-draft/blank-draft.component';
import { CreateCustomerProfileComponent } from './create-customer-profile/create-customer-profile.component';
import { CreateDraftTemplateComponent } from './create-draft-template/create-draft-template.component';
import { ExtractEmailDocumentsComponent } from './extract-email-documents/extract-email-documents.component';
import { ExtractWhatsappDocumentsComponent } from './extract-whatsapp-documents/extract-whatsapp-documents.component';
import { LogIncomeComponent } from './log-income/log-income.component';
import { ReadyDraftComponent } from './ready-draft/ready-draft.component';
import { UploadFontsComponent } from './upload-fonts/upload-fonts.component';
import { ViewCustomersComponent } from './view-customers/view-customers.component';
import { ViewIncomeComponent } from './view-income/view-income.component';

const routes: Routes = [
  {path:'blank-draft', component:BlankDraftComponent},
  {path:'ready-draft', component:ReadyDraftComponent},
  {path:'log-income', component:LogIncomeComponent},
  {path:'view-income', component:ViewIncomeComponent},
  {path:'create-customer-profile', component:CreateCustomerProfileComponent},
  {path:'view-customers', component:ViewCustomersComponent},
  {path:'extract-email-documents', component:ExtractEmailDocumentsComponent},
  {path:'extract-whatsapp-documents', component:ExtractWhatsappDocumentsComponent},
  {path:'upload-fonts', component:UploadFontsComponent},
  {path:'create-draft-template', component:CreateDraftTemplateComponent},
  {path:'**', component:BlankDraftComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
