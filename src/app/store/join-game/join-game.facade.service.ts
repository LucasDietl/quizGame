import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../app.state';
import { selectLoading } from './join-game.selectors';
import * as JoinGameActions from './join-game.actions';


@Injectable({
  providedIn: 'root',
})
export class JoinGameFacadeService {
  constructor(private store: Store<AppState>) {
  }

  public joinGameById(gameId: string): void {
    this.store.dispatch(JoinGameActions.joinGame({gameId}));
  }

  public selectLoading(): Observable<boolean> {
    return this.store.select(selectLoading);
  }

}