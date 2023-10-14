import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DialogState } from './dialog.state';
import { dialogStateKey } from './dialog.reducer';

const selectDialogState = createFeatureSelector<DialogState>(dialogStateKey);

export const selectIsDialogOpen = createSelector(
  selectDialogState,
  (state) => state.isOpen
);

export const selectDialogTitle = createSelector(
  selectDialogState,
  (state) => state.title
);

export const selectDialogContent = createSelector(
  selectDialogState,
  (state) => state.content
);