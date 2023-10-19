import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CreateGameState } from './create-game.state';
import { createGameStateKey } from './create-game.reducer';

const selectCreateGameState = createFeatureSelector<CreateGameState>(createGameStateKey);

export const selectGames = createSelector(
  selectCreateGameState,
  (state) => state.games
);

export const selectSlides = createSelector(
  selectCreateGameState,
  (state) => state.slides
);

export const selectGameById = (gameId: string) => createSelector(selectGames, (games) => games.find((game) => game?.id === gameId));