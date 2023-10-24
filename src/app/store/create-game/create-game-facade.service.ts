import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GameService } from 'src/app/services/game.service';
import { SlidesService } from 'src/app/services/slides.service';
import { AppState } from '../app.state';
import * as CreateGameActions from './create-game.actions';
import { selectGameById, selectGames, selectSlides } from './create-game.selectors';
import { Game, SlidesToCreate, SlidesToPlay } from './create-game.state';


@Injectable({
  providedIn: 'root',
})
export class CreateGameFacadeService {
  constructor(private store: Store<AppState>, private slidesService: SlidesService, private gameService: GameService) {
  }

  public getOwnedGames(): void {
    this.store.dispatch(CreateGameActions.getCurrentGamesOwned());
  }

  public getGameSlides(id: string): void {
    this.store.dispatch(CreateGameActions.getSlidesByGameId({ id }));
  }

  public selectGamesOwned(): Observable<Game[]> {
    return this.store.select(selectGames);
  }

  public selectedCurrentGameToCreate(id: string): Observable<Game> {
    return this.store.select(selectGameById(id)) as Observable<Game>;
  }

  public selectSlidesByGameId(): Observable<SlidesToPlay[]> {
    return this.store.select(selectSlides);
  }

  public createGame(game: Partial<Game>): Promise<string> {
    return this.gameService.createGame(game);
  }

  public deleteGame(game: Game): void {
    this.gameService.deleteGame(game);
  }

  public updateGameTitle(title: string, gameId: string): void {
    this.gameService.updateGameTitle(title,gameId);
  }

  public addNewSlide(gameId: string, newSlide: SlidesToCreate) {
    this.slidesService.addNewSlide(gameId, newSlide);
  }

  public deleteSlide(slideId: string, gameId:string): void {
    this.slidesService.deleteSlide(slideId, gameId);
  }

  public updateSlides(slides: SlidesToPlay[]): void {
    this.slidesService.updateSlides(slides);
  }

}