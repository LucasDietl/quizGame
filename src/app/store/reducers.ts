import { commonReducer, commonStateKey } from "./common/common.reducer";
import { createGameReducer, createGameStateKey } from "./create-game/create-game.reducer";
import { dialogReducer, dialogStateKey } from "./dialog/dialog.reducer";
import { userReducer, userStateKey } from "./user/user.reducer";

export const rootReducers = {
    [dialogStateKey]: dialogReducer,
    [userStateKey]: userReducer,
    [createGameStateKey]: createGameReducer,
    [commonStateKey]: commonReducer,
}
