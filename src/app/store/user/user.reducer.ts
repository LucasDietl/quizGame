import { ActionReducer, createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { localStorageSync } from 'ngrx-store-localstorage';
import { UserState } from './user.state';


export const userStateKey = '@user';
export const initialUserState: UserState = {
  firstName: '',
  lastName: '',
  nickName: '',
  id: '',
};

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.saveUserData, (state, { user }) => ({
    ...state,
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    nickName: user.nickName,
  })),
);

export const userStateConfig = {
  metaReducers: [userSyncReducer],
  initialState: initialUserState
}

export function userSyncReducer(reducer: ActionReducer<UserState>): ActionReducer<UserState> {
  return localStorageSync({ 
    keys: ['id','firstName', 'lastName', 'nickName'],
    rehydrate: true
  })(reducer);
}