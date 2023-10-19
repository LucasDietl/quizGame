import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DialogModule } from '@angular/cdk/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { CreateGameEffects } from '../store/create-game/create-game.effects';
import { createGameReducer, createGameStateConfig, createGameStateKey } from '../store/create-game/create-game.reducer';
import { CreateGameRoutingModule } from './create-game-routing.module';
import { CreateGameComponent } from './create-game.component';
import { CreationSlideOptionComponent } from './creation-slide-option/creation-slide-option.component';
import { CreationSlideComponent } from './creation-slide/creation-slide.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';




@NgModule({
  declarations: [
    CreateGameComponent,
    CreationSlideComponent,
    CreationSlideOptionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    DialogModule,
    CreateGameRoutingModule,
    StoreModule.forFeature(createGameStateKey, createGameReducer, createGameStateConfig),
    EffectsModule.forFeature([CreateGameEffects]),
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
  ],
  exports: [
    CreateGameComponent,
    CreationSlideComponent,
    CreationSlideOptionComponent
  ]
})
export class CreateGameModule { }
