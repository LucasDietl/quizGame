import { ActionReducer, createReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { GameState } from './game.state';
import * as GameActions from './game.actions';

export const gameStateKey = '@game';
export const initialGameState: GameState = {
	game: null as any,
	loading: false,
	slides: [],
	answers: [],
	disableAnswers: true,
	currentSlideId: '',
	timeStamp: 0,
	status: null

};

export const gameReducer = createReducer(
	initialGameState,
	on(GameActions.getCurrentGameByIdSuccess, (state, { game }) => ({
		...state,
		game,
	})),
	on(GameActions.getSlidesByGameIdOnceSuccess, (state, { slides }) => ({
		...state,
		slides,
	})),
	on(GameActions.getGameTimeAndStatusSuccess, (state, { data }) => {
		return {
			...state,
			loading: true,
			currentSlideId: data.currentSlideId,
			status: data.status,
			timeStamp: data.timeStamp
		}
	}),
	on(GameActions.getAllUsersAnswersSuccess, (state, { answers }) => ({
		...state,
		answers: answers,
	})),
	on(GameActions.getAllUsersAnswersOnceSuccess, (state, { answers }) => ({
		...state,
		answers: [ ...state.answers, ...answers],
	})),
	on(GameActions.removeAllUserAnswers, (state) => ({
		...state,
		answers: [],
	})),
	on(GameActions.setUserAnswer, (state) => ({
		...state, disableAnswers: true,
	})),
	on(GameActions.setIsDisableAnswer, (state, { isDisabled }) => ({
		...state,
		loading: false,
		disableAnswers: isDisabled
	})),
);

export const gameStateConfig = {
	metaReducers: [gameSyncReducer],
	initialState: initialGameState
}

export function gameSyncReducer(reducer: ActionReducer<GameState>): ActionReducer<GameState> {
	return localStorageSync({
		keys: [],
		rehydrate: true
	})(reducer);
}
