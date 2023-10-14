import { DialogState } from "./dialog/dialog.state";
import { UserState } from "./user/user.state";

export interface AppState {
  dialog: DialogState;
  user: UserState;
  // Add other state properties as needed
}