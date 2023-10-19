import { ActionReducer, createReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import { CreateGameState } from './create-game.state';
import * as CreateGameActions from './create-game.actions';


export const createGameStateKey = '@createGame';
export const initialCreateGameState: CreateGameState = {
    games: [],
    slides: [],
};

export const createGameReducer = createReducer(
  initialCreateGameState,
  on(CreateGameActions.getCurrentGameOwnedSuccess, (state, { games }) => ({
    ...state,
    games,
  })),
  on(CreateGameActions.getSlidesByGameIdSuccess, (state, { slides }) => ({
    ...state,
    slides,
  })),
);

export const createGameStateConfig = {
  metaReducers: [createGameSyncReducer],
  initialState: initialCreateGameState
}

export function createGameSyncReducer(reducer: ActionReducer<CreateGameState>): ActionReducer<CreateGameState> {
  return localStorageSync({ 
    keys: [],
    rehydrate: true
  })(reducer);
}