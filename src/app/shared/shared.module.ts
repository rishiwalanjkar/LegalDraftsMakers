import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser'

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
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MainPipeModule } from '../main-pipe/main-pipe.module';

import { MatDividedInputComponent } from '../custom-mat-form-fields/mat-divided-input/mat-divided-input.component';
import { MatNameFieldComponent } from '../custom-mat-form-fields/mat-name-field/mat-name-field.component';
import { MatFatherOrHusbandNameFieldComponent } from '../custom-mat-form-fields/mat-father-or-husband-name-field/mat-father-or-husband-name-field.component';
import { MatAgeFieldComponent } from '../custom-mat-form-fields/mat-age-field/mat-age-field.component';
import { MatOccupationFieldComponent } from '../custom-mat-form-fields/mat-occupation-field/mat-occupation-field.component';    
import { MatAddressFieldComponent } from '../custom-mat-form-fields/mat-address-field/mat-address-field.component';
import { PersonalInfoBlockComponent } from '../personal-info-block/personal-info-block.component';
import { MatMobileNumberFieldComponent } from '../custom-mat-form-fields/mat-mobile-number-field/mat-mobile-number-field.component';
import { MatAdharNumberFieldComponent } from '../custom-mat-form-fields/mat-adhar-number-field/mat-adhar-number-field.component';
import { MatPanNumberFieldComponent } from '../custom-mat-form-fields/mat-pan-number-field/mat-pan-number-field.component';
import { MatImageUploadFieldComponent } from '../custom-mat-form-fields/mat-image-upload-field/mat-image-upload-field.component';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';


@NgModule({
  declarations: [
    MatDividedInputComponent,
    MatNameFieldComponent,
    MatFatherOrHusbandNameFieldComponent,
    MatAgeFieldComponent,
    MatOccupationFieldComponent,
    MatAddressFieldComponent,
    MatMobileNumberFieldComponent,
    MatAdharNumberFieldComponent,
    MatPanNumberFieldComponent,
    PersonalInfoBlockComponent,
    MatImageUploadFieldComponent,
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    BrowserModule,
    MainPipeModule,
    FormsModule, 
    ReactiveFormsModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  exports:[
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
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividedInputComponent,
    MatNameFieldComponent,
    MatAgeFieldComponent,
    MatOccupationFieldComponent,
    MatAddressFieldComponent,
    MatMobileNumberFieldComponent,
    MatAdharNumberFieldComponent,
    MatPanNumberFieldComponent,
    MatImageUploadFieldComponent,    
    PersonalInfoBlockComponent,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatStepperModule,
    MatSnackBarModule
  ],
  providers : [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'}, 
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}, 
    CdkColumnDef]
})
export class SharedModule { }
