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
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { joinGameReducer, joinGameStateConfig, joinGameStateKey } from '../store/join-game/join-game.reducer';
import { JoinGameEffects } from '../store/join-game/join-game.effects';

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
    JoinGameRoutingModule,
    StoreModule.forFeature(joinGameStateKey, joinGameReducer, joinGameStateConfig),
    EffectsModule.forFeature([JoinGameEffects]),
  ],
  exports: [JoinGameComponent]
})
export class JoinGameModule { }
