import { createFeatureSelector, createSelector } from '@ngrx/store';
import { gameStateKey } from './game.reducer';
import { Answers, GameState } from './game.state';
import { selectUserId } from '../user/user.selectors';

const selectGameState = createFeatureSelector<GameState>(gameStateKey);

export const selectGame = createSelector(
  selectGameState,
  (state) => state.game
);

export const selectGameTimeStamp = createSelector(
  selectGame,
  (state) => state?.timeStamp
);

export const selectGameSlides = createSelector(
  selectGameState,
  (state) => state.slides
);

export const selectStateSlides = createSelector(
  selectGameState,
  (state) => state.slides
);

export const selectCurrentSlideId = createSelector(
  selectGame,
  (state) => state?.currentSlide ?? ''
);

export const selectCurrentSlide = createSelector(
  selectGameSlides,
  selectCurrentSlideId,
  (slides, currentSlideId) => slides.find((slide) => slide?.id === currentSlideId)
);

export const selectAllUsersAnswers = createSelector(
  selectGameState,
  (state) => state?.answers
);

export const selectAllUsersAnswersSortedByJoinTime = createSelector(
  selectGameState,
  (state) => state?.answers?.slice().sort((a, b) => b.joinedTimeStamp - a.joinedTimeStamp)
);

export const selectAllUsersAnswersSortedByRanking = createSelector(
  selectGameState,
  (state) => state?.answers?.slice().sort((a, b) => b.totalPoints - a.totalPoints)
);

export const selectCurrentUserAnswers = createSelector(
  selectAllUsersAnswers,
  selectUserId,
  (answers, userId) => answers.find(answer => answer.userId === userId) as Answers
);

export const selectCurrentUserAnswersId = createSelector(
  selectCurrentUserAnswers,
  (answer) => answer?.id ?? ''
);

export const selectDisabledAnswers = createSelector(
  selectGameState,
  (state) => state?.disableAnswers ?? true
);
