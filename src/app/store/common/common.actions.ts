import { createAction, props } from '@ngrx/store';
import { screenSizeNames } from 'src/app/utils/helpers/screen-size-names';

export const setScreenSize = createAction('[Common] Set screen size', props<{screenSize: screenSizeNames}>());

