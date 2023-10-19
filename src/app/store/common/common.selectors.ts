import { createFeatureSelector, createSelector } from '@ngrx/store';
import { commonStateKey } from './common.reducer';
import { CommonSate } from './common.state';

const selectCommonState = createFeatureSelector<CommonSate>(commonStateKey);

export const selectScreenSize = createSelector(
  selectCommonState,
  (state) => state.screenSize
);

