import { dialogReducer, dialogStateKey } from "./dialog/dialog.reducer";
import { userReducer, userStateKey } from "./user/user.reducer";

export const rootReducers = {
    [dialogStateKey]: dialogReducer,
    [userStateKey]: userReducer
}
