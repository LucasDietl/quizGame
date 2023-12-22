import { createAction, props } from '@ngrx/store';
import { Game, GameStatus, GameTimeAndStatus, SlidesToPlay } from '../create-game/create-game.state';
import { Answers } from './game.state';

export const getCurrentGameById = createAction('[Game] Get game by id', props<{gameId: string}>());
export const getCurrentGameByIdSuccess = createAction('[Game] Get game by id success', props<{game: Game}>());

export const changeGameStatus = createAction('[Game Slide] Change game status', props<{gameStatus: GameStatus, gameId: string}>());
export const changeGameStatusSuccess = createAction('[Game Slide] Change game status Success'
// , props<{gameStatus: GameStatus, gameId: string}>()
);
export const changeGameStatusFail = createAction('[Game Slide] Change game status Fail',  props<{ error: any }>());

export const setNextSlideId = createAction('[Game Slide] Set next slide id');
export const setNextSlideIdSuccess = createAction('[Game Slide] Set next slide id Success');
export const setNextSlideIdFail = createAction('[Game Slide] Set next slide id Fail', props<{ error: any }>());

export const getAllUsersAnswers = createAction('[Game Answer] Get all users answers', props<{gameId: string, ownerId: string}>());
export const getAllUsersAnswersSuccess = createAction('[Game Answer] Get all users answers Success', props<{answers: Answers[]}>());
export const getAllUsersAnswersFail = createAction('[Game Answer] Get all users answers Fail', props<{message: string}>());
export const getCurrentUserAnswerId = createAction('[Game Answer] Get current users answer id', props<{ gameId: string, userId: string}>());
export const getCurrentUserAnswerIdSuccess = createAction('[Game Answer] Get current users answer id success', props<{ answerId: string }>());


export const getAllUsersAnswersOnce = createAction('[Game Answer] Get all users Once answers', props<{gameId: string}>());
export const getAllUsersAnswersOnceSuccess = createAction('[Game Answer] Get all users Once answers Success', props<{answers: Answers[]}>());
export const getAllUsersAnswersOnceFail = createAction('[Game Answer] Get all users answers Once Fail', props<{message: string}>());
export const removeAllUserAnswers = createAction('[Game Answer] Remove all user answers');

export const setUserAnswer = createAction('[Game Answer] Set game answer', props<{points: number, slideId: string}>());
export const setUserAnswerSuccess = createAction('[Game Answer] Set game answer Success');
export const setUserAnswerFail = createAction('[Game Answer] Set game answer Fail', props<{message: string}>());

export const setIsDisableAnswer = createAction('[Game Timer] Set is disable answer', props<{isDisabled: boolean}>());

export const getSlidesByGameIdOnce = createAction('[Game] Get slides by game id Once', props<{gameId: string}>());
export const getSlidesByGameIdOnceSuccess = createAction('[Game] Get slides by game id Once Success', props<{slides: SlidesToPlay[], gameId: string}>());

export const getGameTimeAndStatus = createAction('[Game] Get game status', props<{gameId: string}>());
export const getGameTimeAndStatusSuccess = createAction('[Game] Get game status Success', props<{ data: GameTimeAndStatus}>());
