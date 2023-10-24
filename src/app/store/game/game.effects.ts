import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, withLatestFrom, } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import * as GameActions from './game.actions';
import { openDialog } from '../dialog/dialog.actions';
import { SlidesService } from 'src/app/services/slides.service';
import { GameFacadeService } from './game.facade.service';

@Injectable()
export class GameEffects {
    constructor(private actions$: Actions, private gameService: GameService, private slidesService: SlidesService, private gameFacadeService: GameFacadeService) { }

    getGameById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.getCurrentGameById),
            switchMap(({ gameId }) => {
                return from(this.gameService.getGameByIdCall(gameId)).pipe(
                    mergeMap((game) => [GameActions.getCurrentGameByIdSuccess({ game }), GameActions.getSlides({ gameId })]),
                    catchError((error) => of(openDialog({ title: 'Error Getting game by ID', content: JSON.stringify(error) })))
                )
            }),
        )
    );

    getSlidesByIds$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.getSlides),
            switchMap(({gameId}) => {
                return this.slidesService.getSlidesByGamesIdCall(gameId).pipe(
                    map((slides) => GameActions.getSlidesSuccess({ slides })),
                    catchError((error) => of(openDialog({ title: 'Error Getting slides by game ID', content: JSON.stringify(error) })))
                );
            }),
        )
    );

    changeGameStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.changeGameStatus),
            switchMap(({ gameStatus, gameId }) => {
                return from(this.gameService.changeGameStatusCall(gameStatus, gameId)).pipe(
                    map(() => GameActions.changeGameStatusSuccess({gameStatus, gameId})),
                    catchError((error) => of(openDialog({ title: 'Error changing game status', content: JSON.stringify(error) })))
                );
            }),
        )
    );

    gameStartedHandler$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.changeGameStatusSuccess, GameActions.setNextSlideId),
            withLatestFrom(this.gameFacadeService.selectCurrentGame(), this.gameFacadeService.selectGameSlides()),
            switchMap(([, game, slides]) => {
                const slideId = this.gameService.getNextSlideId(game!, slides);
                return from(this.gameService.setCurrentSlide(game!.id, slideId)).pipe(
                    map(() => GameActions.setNextSlideIdSuccess()),
                    catchError((error) => of(openDialog({ title: 'Error changing game status', content: JSON.stringify(error) })))
                );
            }),
        )
    );

    // setNextSlide$ = createEffect(() =>
    //     this.actions$.pipe(
    //         ofType(GameActions.setNextSlideId),
    //         withLatestFrom(this.gameFacadeService.getNextSlideId()),
    //         switchMap(([{
    //             gameId,
    //         }, nextSlideId]) => {
    //             const slideId = this.gameService.getNextSlideId(game!, slides);
    //             return from(this.gameService.setCurrentSlide(nextSlideId, gameId)).pipe(
    //                 map(() => GameActions.setNextSlideIdSuccess()),
    //                 catchError((error) => of(openDialog({ title: 'Error changing game status', content: JSON.stringify(error) })))
    //             );
    //         }),
    //     )
    // );
}
