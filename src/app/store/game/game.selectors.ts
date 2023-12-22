import { createFeatureSelector, createSelector } from '@ngrx/store';
import { gameStateKey } from './game.reducer';
import { Answers, GameState } from './game.state';
import { selectUserId } from '../user/user.selectors';

const selectGameState = createFeatureSelector<GameState>(gameStateKey);

export const selectGame = createSelector(
  selectGameState,
  (state) => state.game
);

export const selectIsOwnerOfGame = createSelector(
  selectGame,
  selectUserId,
  (game, userId) => game?.ownerId === userId
);
export const selectLoading = createSelector(
  selectGameState,
  (state) => state.loading
);

export const selectGameId = createSelector(
  selectGame,
  (game) => game?.id
);

export const selectGameTimeStamp = createSelector(
  selectGameState,
  (state) => state?.timeStamp || 0
);
export const selectGameStatus = createSelector(
  selectGameState,
  (state) => state?.status
);


export const selectGameSlides = createSelector(
  selectGameState,
  (state) => state.slides
);
export const selectStatusTimeAndCurrentSlideId = createSelector(
  selectGameState,
  (state) => { 
    return {
      currentSlideId: state.currentSlideId,
      status: state?.status,
      timeStamp: state.timeStamp
    }
  }
);

export const selectStateSlides = createSelector(
  selectGameState,
  (state) => state.slides
);

export const selectCurrentSlideId = createSelector(
  selectGameState,
  (state) => state?.currentSlideId ?? ''
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
  selectGameState,
  (state) => state?.answerId
);

export const selectDisabledAnswers = createSelector(
  selectGameState,
  (state) => state?.disableAnswers ?? true
);
