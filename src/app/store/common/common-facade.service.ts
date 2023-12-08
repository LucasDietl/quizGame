import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs'
import * as CommonActions from './common.actions';
import { AppState } from 'src/app/store/app.state';
import { selectScreenSize } from './common.selectors';
import { screenSizeNames } from 'src/app/utils/helpers/screen-size-names';


@Injectable({
  providedIn: 'root',
})
export class CommonFacadeService {
  constructor(private store: Store<AppState>) {
  }

  public setScreenSize(screenSize: screenSizeNames): void {
    this.store.dispatch(CommonActions.setScreenSize({screenSize}));
  }

  public selectScreenSize(): Observable<screenSizeNames> {
    return this.store.select(selectScreenSize);
  }
}