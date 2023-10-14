import { createFeatureSelector, createSelector } from '@ngrx/store';
import { userStateKey } from './user.reducer';
import { UserState } from './user.state';

const selectUserState = createFeatureSelector<UserState>(userStateKey);

export const selectUser = createSelector(
  selectUserState,
  (state) => state
);

export const selectFirstName = createSelector(
  selectUserState,
  (state) => state.firstName
);

export const selectLastName = createSelector(
  selectUserState,
  (state) => state.lastName
);

export const selectNickNameContent = createSelector(
  selectUserState,
  (state) => state.nickName
);

export const selectUserId = createSelector(
  selectUserState,
  (state) => state.id
);