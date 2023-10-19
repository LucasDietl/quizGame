import { CommonSate } from "./common/common.state";
import { DialogState } from "./dialog/dialog.state";
import { UserState } from "./user/user.state";

export interface AppState {
  dialog: DialogState;
  user: UserState;
  common: CommonSate;
  // Add other state properties as needed
}
