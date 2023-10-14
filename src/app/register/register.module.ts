import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RegisterComponent } from './register.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogModule } from '@angular/cdk/dialog';

@NgModule({
  declarations: [

    RegisterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    DialogModule
  ],
  exports: [RegisterComponent]
})
export class RegisterModule { }
