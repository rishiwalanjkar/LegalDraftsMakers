import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { MatNativeDateModule } from '@angular/material/core';

import { MainPipeModule } from '../main-pipe/main-pipe.module';

import { MatDividedInputComponent } from '../custom-mat-form-fields/mat-divided-input/mat-divided-input.component';
import { MatAgeFieldComponent } from '../custom-mat-form-fields/mat-age-field/mat-age-field.component';


@NgModule({
  declarations: [
    MatDividedInputComponent,
    MatAgeFieldComponent
  ],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
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
    MatAgeFieldComponent
  ]
})
export class SharedModule { }
