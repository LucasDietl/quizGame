import { ActionReducer, createReducer, on } from '@ngrx/store';
import * as DialogActions from './dialog.actions';
import { DialogState } from './dialog.state';
import { localStorageSync } from 'ngrx-store-localstorage';


export const dialogStateKey = '@dialog';
export const initialDialogState: DialogState = {
  isOpen: false,
  title: '',
  content: null,
};

export const dialogReducer = createReducer(
  initialDialogState,
  on(DialogActions.openDialog, (state, { title, content }) => ({
    ...state,
    isOpen: true,
    title,
    content,
  })),
  on(DialogActions.closeDialog, (state) => ({
    ...state,
    isOpen: false,
    title: '',
    content: null,
  }))
);

export const dialogStateConfig = {
  metaReducers: [dialogSyncReducer],
  initialState: initialDialogState
}

export function dialogSyncReducer(reducer: ActionReducer<DialogState>): ActionReducer<DialogState> {
  return localStorageSync({ 
    keys: ['isOpen','title', 'content'],
    rehydrate: true
  })(reducer);
}