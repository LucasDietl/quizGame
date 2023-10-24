import { ActionReducer, createReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { GameState } from './game.state';
import * as GameActions from './game.actions';

export const gameStateKey = '@game';
export const initialGameState: GameState = {
  game: null,
  loading: false,
  slides: [],
  answers: [],
  disableAnswers: false,
};


export const gameReducer = createReducer(
  initialGameState,
  on(GameActions.getCurrentGameByIdSuccess, (state, { game }) => ({
    ...state,
    game,
  })),
  on(GameActions.getSlidesSuccess, (state, { slides }) => ({
    ...state,
    slides,
    disableAnswers: false
  })),
  on(GameActions.setUserAnswer, (state) => ({
    ...state,
    disableAnswers: true,
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
