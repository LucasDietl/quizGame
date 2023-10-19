import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs'
import * as CommonActions from './common.actions';
import { AppState } from 'src/app/store/app.state';
import { selectScreenSize } from './common.selectors';


@Injectable({
  providedIn: 'root',
})
export class CommonFacadeService {
  constructor(private store: Store<AppState>) {
  }

  public setScreenSize(screenSize: string): void {
    this.store.dispatch(CommonActions.setScreenSize({screenSize}));
  }

  public selectScreenSize(): Observable<string> {
    return this.store.select(selectScreenSize);
  }
}