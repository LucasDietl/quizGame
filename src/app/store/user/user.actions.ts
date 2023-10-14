import { createAction, props } from '@ngrx/store';
import { AuthUser } from 'src/app/utils/user.interface';

export const saveUserData = createAction('[User] Save User data', props<{ user: AuthUser }>());