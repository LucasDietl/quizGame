import { createAction, props } from '@ngrx/store';

export const setScreenSize = createAction('[Common] Set screen size', props<{screenSize: string}>());

