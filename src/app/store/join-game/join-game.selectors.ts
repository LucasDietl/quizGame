import { createFeatureSelector, createSelector } from '@ngrx/store';
import { joinGameStateKey } from './join-game.reducer';
import { JoinGameState } from './join-game.state';

const selectJoinGameState = createFeatureSelector<JoinGameState>(joinGameStateKey);

export const selectLoading = createSelector(
  selectJoinGameState,
  (state) => state.loading
);


