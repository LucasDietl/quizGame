import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterComponent } from './register.component';

@NgModule({
  declarations: [

    RegisterComponent,
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  exports: [RegisterComponent]
})
export class RegisterModule { }
