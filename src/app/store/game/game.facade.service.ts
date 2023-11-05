import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AppState } from '../app.state';
import { Game, GameStatus, SlidesToPlay } from '../create-game/create-game.state';
import * as CreateGameActions from './game.actions';
import { selectAllUsersAnswers, selectAllUsersAnswersSortedByJoinTime, selectAllUsersAnswersSortedByRanking, selectCurrentSlide, selectCurrentSlideId, selectCurrentUserAnswers, selectCurrentUserAnswersId, selectDisabledAnswers, selectGame, selectGameSlides, selectGameTimeStamp, selectStateSlides } from './game.selectors';
import * as GameActions from './game.actions';
import { Answers } from './game.state';


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
    this.store.dispatch(GameActions.setNextSlideId());
  }

  public getAllUsersAnswers(gameId: string): void {
    this.store.dispatch(GameActions.getAllUsersAnswers({gameId}));
  }

  public setUserAnswer(points: number, slideId: string): void {
    this.store.dispatch(GameActions.setUserAnswer({points, slideId}));
  }

  public setIsDisableAnswer(isDisabled: boolean): void {
    this.store.dispatch(GameActions.setIsDisableAnswer({isDisabled}));
  }

  public selectCurrentGame(): Observable<Game | null> {
    return this.store.select(selectGame);
  }

  public selectCurrentGameTimeStamp(): Observable<number> {
    return this.store.select(selectGameTimeStamp);
  }

  public selectDisabledAnswers(): Observable<boolean> {
    return this.store.select(selectDisabledAnswers);
  }

  public selectGameSlides(): Observable<SlidesToPlay[]> {
    return this.store.select(selectGameSlides);
  }

  public selectStateGameSlides(): Observable<SlidesToPlay[]> {
    return this.store.select(selectStateSlides);
  }

  public selectCurrentSlideId(): Observable<string> {
    return this.store.select(selectCurrentSlideId);
  }

  public selectCurrentSlide(): Observable<SlidesToPlay | undefined> {
    return this.store.select(selectCurrentSlide);
  }

  public selectCurrentUserAnswer(): Observable<Answers>{
    return this.store.select(selectCurrentUserAnswers);
  }

  public selectAllUsersAnswers(): Observable<Answers[]>{
    return this.store.select(selectAllUsersAnswers);
  }

  public selectAllUsersAnswersByJoinTime(): Observable<Answers[]>{
    return this.store.select(selectAllUsersAnswersSortedByJoinTime);
  }
  public selectAllUsersAnswersByRanking(): Observable<Answers[]>{
    return this.store.select(selectAllUsersAnswersSortedByRanking);
  }

  public selectCurrentUserAnswerId(): Observable<string>{
    return this.store.select(selectCurrentUserAnswersId);
  }

  public selectGameTimeStamp(): Observable<number> {
    return this.store.select(selectGameTimeStamp);
  }

}