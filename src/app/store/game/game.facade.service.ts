import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../app.state';
import { Game, GameStatus, SlidesToPlay } from '../create-game/create-game.state';
import * as CreateGameActions from './game.actions';
import { selectCurrentSlide, selectCurrentSlideId, selectGame, selectSlides } from './game.selectors';
import * as GameActions from './game.actions';


@Injectable({
  providedIn: 'root',
})
export class GameFacadeService {
  constructor(private store: Store<AppState>) {
  }

  public getGameById(gameId: string): void {
    this.store.dispatch(CreateGameActions.getCurrentGameById({gameId}));
  }

  public changeGameStatus(gameStatus: GameStatus, gameId: string): void {
    this.store.dispatch(GameActions.changeGameStatus({gameStatus, gameId}));
  }

  public setNextSlideId(): void {
    this.store.dispatch(GameActions.setNextSlideId())
  }

  public selectCurrentGame(): Observable<Game | null> {
    return this.store.select(selectGame);
  }

  public selectGameSlides(): Observable<SlidesToPlay[]> {
    return this.store.select(selectSlides);
  }

  public getCurrentSlideId(): Observable<string> {
    return this.store.select(selectCurrentSlideId);
  }

  public getCurrentSlide(): Observable<SlidesToPlay | undefined> {
    return this.store.select(selectCurrentSlide);
  }

  // public getNextSlideId(): Observable<string> {
  //   return this.store.select(selectNextSlideId)
  // }



}