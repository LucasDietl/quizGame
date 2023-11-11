import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GameComponent } from './game.component';
import { GameRoutingModule } from './game.routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { gameReducer, gameStateConfig, gameStateKey } from '../store/game/game.reducer';
import { GameEffects } from '../store/game/game.effects';
import { MatButtonModule } from '@angular/material/button';
import { OwnerControlsComponent } from './owner-controls/owner-controls.component';
import { ResultsComponent } from './results/results.component';
import { TimerComponent } from './timer/timer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GameOptionComponent } from './game-option/game-option.component';
import { StandByComponent } from './stand-by/stand-by.component';
import { FinishComponent } from './finish/finish.component';
import { NgParticlesModule } from 'ng-particles';
import { AnswerComponent } from './answer/answer.component';

@NgModule({
  declarations: [
    GameComponent,
    OwnerControlsComponent,
    ResultsComponent,
    TimerComponent,
    GameOptionComponent,
    StandByComponent,
    FinishComponent,
    AnswerComponent
  ],
  imports: [
    CommonModule,
    GameRoutingModule,
    MatButtonModule,
    StoreModule.forFeature(gameStateKey, gameReducer, gameStateConfig),
    EffectsModule.forFeature([GameEffects]),
    FontAwesomeModule,
    NgParticlesModule 
  ],
  exports: [TimerComponent]
})
export class GameModule { }
