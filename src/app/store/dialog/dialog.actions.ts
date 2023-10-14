import { createAction, props } from '@ngrx/store';

export const openDialog = createAction('[Dialog] Open Dialog', props<{ title: string, content?: any }>());
export const checkDialogsToOpen = createAction('[Dialog] Check Dialogs to open', props<{open: boolean}>());
export const closeDialog = createAction('[Dialog] Close Dialog');