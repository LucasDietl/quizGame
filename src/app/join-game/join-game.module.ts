import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogModule } from '@angular/cdk/dialog';
import { JoinGameComponent } from './join-game.component';
import { JoinGameRoutingModule } from './join-game-routing.module';

@NgModule({
  declarations: [JoinGameComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    DialogModule,
    JoinGameRoutingModule
  ],
  exports: [JoinGameComponent]
})
export class JoinGameModule { }
