import { ActionReducerMap } from "@ngrx/store";
import { commonReducer, commonStateKey } from "./common/common.reducer";
import { createGameReducer, createGameStateKey } from "./create-game/create-game.reducer";
import { dialogReducer, dialogStateKey } from "./dialog/dialog.reducer";
import { gameReducer, gameStateKey } from "./game/game.reducer";
import { userReducer, userStateKey } from "./user/user.reducer";
import { AppState } from "./app.state";
import { joinGameReducer, joinGameStateKey } from "./join-game/join-game.reducer";

export const rootReducers: ActionReducerMap<AppState> = {
    [dialogStateKey]: dialogReducer,
    [userStateKey]: userReducer,
    [createGameStateKey]: createGameReducer,
    [commonStateKey]: commonReducer,
    [gameStateKey]: gameReducer,
    [joinGameStateKey]: joinGameReducer,
}
