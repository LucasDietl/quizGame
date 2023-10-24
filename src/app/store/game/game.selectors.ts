import { createFeatureSelector, createSelector } from '@ngrx/store';
import { gameStateKey } from './game.reducer';
import { GameState } from './game.state';

const selectGameState = createFeatureSelector<GameState>(gameStateKey);

export const selectGame = createSelector(
  selectGameState,
  (state) => state.game
);

export const selectSlides = createSelector(
  selectGameState,
  (state) => state.slides
);

export const selectCurrentSlideId = createSelector(
  selectGame,
  (state) => state?.currentSlide ?? ''
);

export const selectCurrentSlide = createSelector(
  selectSlides,
  selectCurrentSlideId,
  (slides, currentSlideId) => slides.find((slide) => slide?.id === currentSlideId)
);

export const selectDisabledAnswers = createSelector(
  selectGameState,
  (state) => state.disableAnswers
);