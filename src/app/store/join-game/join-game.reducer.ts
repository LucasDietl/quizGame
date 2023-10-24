import { ActionReducer, createReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import * as JoinGameActions from './join-game.actions';
import { JoinGameState } from './join-game.state';

export const joinGameStateKey = '@joinGame';
export const initialJoinGameState: JoinGameState = {
  gameId: '',
  loading: false,
};


export const joinGameReducer = createReducer(
  initialJoinGameState,
  on(JoinGameActions.joinGame, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    JoinGameActions.initiateUserAnswersSuccess,
    JoinGameActions.initiateUserAnswersFail,
    JoinGameActions.initiateUserAnswersFail, 
    (state) => ({
    ...state,
    loading: false,
  })),
);

export const joinGameStateConfig = {
  metaReducers: [joinGameSyncReducer],
  initialState: initialJoinGameState
}

export function joinGameSyncReducer(reducer: ActionReducer<JoinGameState>): ActionReducer<JoinGameState> {
  return localStorageSync({
    keys: [],
    rehydrate: true
  })(reducer);
}
