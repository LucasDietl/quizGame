import { ActionReducer, createReducer, on } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';
import * as CommonActions from './common.actions';
import { CommonSate } from './common.state';
import { screenSizeNames } from 'src/app/utils/helpers/screen-size-names';


export const commonStateKey = '@common';
export const initialCommonState: CommonSate = {
    screenSize: screenSizeNames.Small,
};

export const commonReducer = createReducer(
  initialCommonState,
  on(CommonActions.setScreenSize, (state, { screenSize }) => ({
    ...state,
    screenSize,
  })),
);

export const commonStateConfig = {
  metaReducers: [commonSyncReducer],
  initialState: initialCommonState
}

export function commonSyncReducer(reducer: ActionReducer<CommonSate>): ActionReducer<CommonSate> {
  return localStorageSync({ 
    keys: [],
    rehydrate: true
  })(reducer);
}