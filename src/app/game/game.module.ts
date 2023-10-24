import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GameComponent } from './game.component';
import { GameRoutingModule } from './game.routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { gameReducer, gameStateConfig, gameStateKey } from '../store/game/game.reducer';
import { GameEffects } from '../store/game/game.effects';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    GameComponent,
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    MatButtonModule,
    StoreModule.forFeature(gameStateKey, gameReducer, gameStateConfig),
    EffectsModule.forFeature([GameEffects]),
  ],
  providers: []
})
export class GameModule { }
