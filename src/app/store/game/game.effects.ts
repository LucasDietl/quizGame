import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, interval, of, timer } from 'rxjs';
import { catchError, debounceTime, filter, map, mergeMap, switchMap, take, takeUntil, takeWhile, tap, withLatestFrom, } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import * as GameActions from './game.actions';
import { openDialog } from '../dialog/dialog.actions';
import { SlidesService } from 'src/app/services/slides.service';
import { GameFacadeService } from './game.facade.service';
import { UserFacadeService } from '../user/user-facade.service';
import { TimeService } from 'src/app/services/time.service';

@Injectable()
export class GameEffects {
    constructor(
        private actions$: Actions, 
        private gameService: GameService, 
        private slidesService: SlidesService, 
        private gameFacadeService: GameFacadeService, 
        private userFacadeService: UserFacadeService, 
        private timeService: TimeService) { }

    getGameById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.getCurrentGameById),
            switchMap(({ gameId }) => {
                return from(this.gameService.getGameByIdCall(gameId)).pipe(
                    withLatestFrom(this.gameFacadeService.selectStateGameSlides()),
                    mergeMap(([game, slides]) => [GameActions.getCurrentGameByIdSuccess({ game }), ...(slides.length === 0 ? [GameActions.getSlidesByGameIdOnce({ gameId })] : [])]),
                    catchError((_) => of(openDialog({ title: 'Error Getting game by ID' })))
                )
            }),
        )
    );

    getSlidesByGameIdOnce$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.getSlidesByGameIdOnce),
            switchMap(({ gameId }) => {
                return from(this.slidesService.getSlidesOnceByGamesIdCall(gameId)).pipe(
                    map((slides) => GameActions.getSlidesByGameIdOnceSuccess({ slides })),
                    catchError((_) => of(openDialog({ title: 'Error Getting slides by game ID Once' })))
                );
            }),
        )
    );


    changeGameStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.changeGameStatus),
            switchMap(({ gameStatus, gameId }) => {
                return from(this.gameService.changeGameStatusCall(gameStatus, gameId)).pipe(
                    map(() => GameActions.changeGameStatusSuccess({ gameStatus, gameId })),
                    catchError((_) => of(openDialog({ title: 'Error changing game status' })))
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
                    catchError((_) => of(openDialog({ title: 'Error changing game status' })))
                );
            }),
            catchError((_)=> of(openDialog({ title: 'Error on gameStartedHandler' })))
        )
    );

    getAllUsersAnswers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.getAllUsersAnswers),
            withLatestFrom(this.userFacadeService.userId()),
            switchMap(([{ gameId }, userId]) => {
                return this.gameService.getAllUserAnswersByGameIdCall(gameId).pipe(
                    map((answers) => GameActions.getAllUsersAnswersSuccess({ answers, userId })),
                    catchError((_) => of(openDialog({ title: 'Error changing game status' })))
                );
            }),
        )
    );

    setUserAnswer$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.setUserAnswer),
            withLatestFrom(this.gameFacadeService.selectCurrentUserAnswerId()),
            switchMap(([{ points, slideId }, answerId]) => {
                return from(this.gameService.setUserAnswer(answerId, points, slideId)).pipe(
                    map(() => GameActions.setUserAnswerSuccess()),
                    catchError((error) => of(openDialog({ title: 'Error updating your points' })))
                );
            }),
        )
    );

    checkGameUpdatesToStartTimer$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.getCurrentGameByIdSuccess, GameActions.getSlidesByGameIdOnceSuccess),
            withLatestFrom(this.gameFacadeService.selectCurrentGame(), this.gameFacadeService.selectStateGameSlides(), this.gameFacadeService.selectCurrentUserAnswer()),
            filter(([,game, slides]) => slides?.length !== 0),
            map(([, game, slides, userAnswer]) => {

                const slide = slides.find(slide => slide.id === game?.currentSlide);
                console.log(slide?.id);
                console.log(userAnswer?.slideId);
                console.log(game);
                const alreadyAnswered = slide?.id === userAnswer?.slideId;
                const noTimeRemaining = (this.timeService.getTimeDifferenceInSeconds(game?.timeStamp as number, slide?.seconds as number) ?? 0) <= 0;
                console.log(alreadyAnswered);
                return GameActions.setIsDisableAnswer({ isDisabled: alreadyAnswered || noTimeRemaining });
            }),
        )
    );

}
