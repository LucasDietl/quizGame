import { dialogReducer, dialogStateKey } from "./dialog/dialog.reducer";

export const rootReducers = {
    [dialogStateKey]: dialogReducer
}
