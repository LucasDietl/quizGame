import { createAction, props } from '@ngrx/store';

export const joinGame = createAction('[Join Game] Join game by id', props<{gameId: string}>());
export const joinGameSuccess = createAction('[Join Game] Join game by id Success', props<{gameId: string}>());
export const joinGameFail = createAction('[Join Game] Join game by id Fail', props<{ message: string, error?: any}>());

export const initiateUserAnswers = createAction('[Join Game] Initiate user', props<{gameId: string}>());
export const initiateUserAnswersSuccess = createAction('[Join Game] Initiate user Success', props<{gameId: string}>());
export const initiateUserAnswersFail = createAction('[Join Game] Initiate user Fail', props<{ message: string, error?: any}>());
