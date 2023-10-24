import { createAction, props } from '@ngrx/store';
import { Game, GameStatus, SlidesToPlay } from '../create-game/create-game.state';

export const getCurrentGameById = createAction('[Game] Get game by id', props<{gameId: string}>());
export const getCurrentGameByIdSuccess = createAction('[Game] Get game by id success', props<{game: Game}>());

export const getSlides = createAction('[Game Slide] Get slides', props<{gameId: string}>());
export const getSlidesSuccess = createAction('[Game Slide] Get Slides Success', props<{ slides: SlidesToPlay[] }>());
export const getSlidesFailure = createAction('[Game Slide] Get Slides Failure', props<{ error: any }>());

export const changeGameStatus = createAction('[Game Slide] Change game status', props<{gameStatus: GameStatus, gameId: string}>());
export const changeGameStatusSuccess = createAction('[Game Slide] Change game status Success', props<{gameStatus: GameStatus, gameId: string}>());
export const changeGameStatusFail = createAction('[Game Slide] Change game status Fail',  props<{ error: any }>());

export const setNextSlideId = createAction('[Game Slide] Set next slide id');
export const setNextSlideIdSuccess = createAction('[Game Slide] Set next slide id Success');
export const setNextSlideIdFail = createAction('[Game Slide] Set next slide id Fail', props<{ error: any }>());

export const setUserAnswer = createAction('[Game Answer] Set game answer', props<{answerId: string, points: number}>());
export const setUserAnswerSuccess = createAction('[Game Answer] Set game answer Success');
export const setUserAnswerFail = createAction('[Game Answer] Set game answer Fail', props<{message: string}>());

 


