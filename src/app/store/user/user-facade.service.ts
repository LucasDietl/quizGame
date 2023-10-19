import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as UserActions from './user.actions';
import * as UserSelectors from './user.selectors'
import { AppState } from '../app.state';
import { Observable } from 'rxjs';
import { AuthUser } from 'src/app/store/user/user.interface';
import { UserState } from './user.state';


@Injectable({
  providedIn: 'root',
})
export class UserFacadeService {
  constructor(private store: Store<AppState>) {
  }

  public saveUserData(user: AuthUser): void {
    this.store.dispatch(UserActions.saveUserData({ user }));
  }

  public userId(): Observable<string> {
    return this.store.select(UserSelectors.selectUserId);
  }

}