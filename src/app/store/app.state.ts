import { commonStateKey } from "./common/common.reducer";
import { CommonSate } from "./common/common.state";
import { createGameStateKey } from "./create-game/create-game.reducer";
import { CreateGameState } from "./create-game/create-game.state";
import { dialogStateKey } from "./dialog/dialog.reducer";
import { DialogState } from "./dialog/dialog.state";
import { gameStateKey } from "./game/game.reducer";
import { GameState } from "./game/game.state";
import { joinGameStateKey } from "./join-game/join-game.reducer";
import { JoinGameState } from "./join-game/join-game.state";
import { userStateKey } from "./user/user.reducer";
import { UserState } from "./user/user.state";

export interface AppState {
  [dialogStateKey]: DialogState;
  [userStateKey]: UserState;
  [commonStateKey]: CommonSate;
  [createGameStateKey]: CreateGameState;
  [gameStateKey]: GameState;
  [joinGameStateKey]: JoinGameState;
}
