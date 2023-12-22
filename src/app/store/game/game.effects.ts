import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, filter, first, map, mergeMap, switchMap, debounceTime, withLatestFrom, shareReplay } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import { SlidesService } from 'src/app/services/slides.service';
import { TimeService } from 'src/app/services/time.service';
import { openDialog } from '../dialog/dialog.actions';
import { UserFacadeService } from '../user/user-facade.service';
import * as GameActions from './game.actions';
import { GameFacadeService } from './game.facade.service';

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
                return from(this.gameService.getGameByIdOnce(gameId)).pipe(
                    first(),
                    mergeMap((game) => [GameActions.getCurrentGameByIdSuccess({ game }), GameActions.getSlidesByGameIdOnce({ gameId })]),
                    catchError((_) => of(openDialog({ title: 'Error Getting game by ID' })))
                )
            }),
        )
    );

    getAllUserAnswers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.getCurrentGameByIdSuccess),
            withLatestFrom(this.userFacadeService.userId()),
            map(([{ game }, userId]) => {
                const { ownerId } = game;
                const gameId = game.id;
                const owner = ownerId === userId;
                return owner ? GameActions.getAllUsersAnswers({ gameId, ownerId }) : GameActions.getCurrentUserAnswerId({ gameId, userId});
            }),
        )
    );

    getCurrentUserAnswerId$ = createEffect(() =>
    this.actions$.pipe(
        ofType(GameActions.getCurrentUserAnswerId),
        switchMap(({ gameId, userId }) => {
            return from(this.gameService.getUserAnswersIdOnce(gameId, userId)).pipe(
                map(({answerId}) => GameActions.getCurrentUserAnswerIdSuccess({answerId})),
                catchError((_) => { 
                    return of(openDialog({ title: 'Error getUserAnswersIdOnce' }))
                })
            )
        }),
    )
);

    getAllUserAnswersOnce$ = createEffect(() =>
    this.actions$.pipe(
        ofType(GameActions.getAllUsersAnswersOnce),
        switchMap(({ gameId }) => {
            return from(this.gameService.getAllUserAnswersOnce(gameId)).pipe(
                map((answers) => { 
                    return GameActions.getAllUsersAnswersOnceSuccess({answers});
                }),
                catchError((_) => { 
                    return of(openDialog({ title: 'Error Getting all user answers Once' }))
                })
            )
        }),
    )
);

    getSlidesByGameIdOnce$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.getSlidesByGameIdOnce),
            switchMap(({ gameId }) => {
                return from(this.slidesService.getSlidesOnceByGamesIdCall(gameId)).pipe(
                    first(),
                    map((slides) => GameActions.getSlidesByGameIdOnceSuccess({ slides, gameId })),
                    catchError((_) => of(openDialog({ title: 'Error Getting slides by game ID Once' })))
                );
            }),
        )
    );

    getStatusAndTime$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.getSlidesByGameIdOnceSuccess),
            switchMap(({ gameId }) => {
                return this.gameService.getCurrentSlideIdAndTimeStamp(gameId).pipe(
                    map((data) => GameActions.getGameTimeAndStatusSuccess({ data })),
                    catchError((_) => of(openDialog({ title: 'Error Getting slides by game ID Once' })))
                );
            }),
        )
    );

    changeGameStatus$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.changeGameStatus),
            withLatestFrom(this.gameFacadeService.selectGameSlides(), this.gameFacadeService.selectCurrentSlideId()),
            switchMap(([{ gameStatus, gameId }, slides, currentSlideId]) => {
                const slideId = this.gameService.getNextSlideId(currentSlideId, slides);
                return from(this.gameService.changeGameStatusCall(gameStatus, gameId, slideId)).pipe(
                    map(() => GameActions.changeGameStatusSuccess()),
                    catchError((_) => of(openDialog({ title: 'Error changing game status' })))
                );
            }),
            catchError((_) => of(openDialog({ title: 'Error changing game status Effect' })))
        )
    );

    setNextSlide$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.setNextSlideId),
            withLatestFrom(this.gameFacadeService.selectGameSlides(), this.gameFacadeService.selectCurrentGameId(), this.gameFacadeService.selectCurrentSlideId()),
            switchMap(([_, slides, gameId, currentSlideId]) => {
                const slideId = this.gameService.getNextSlideId(currentSlideId, slides);
                return from(this.gameService.setCurrentSlide(gameId, slideId)).pipe(
                    map(() => GameActions.setNextSlideIdSuccess()),
                    catchError((_) => of(openDialog({ title: 'Error changing slides' })))
                );
            }),
            catchError((_) => of(openDialog({ title: 'Error on setNextSlide' })))
        )
    );

    getAllUsersAnswers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(GameActions.getAllUsersAnswers),
            switchMap(({ gameId }) => {
                return this.gameService.getAllUserAnswersByGameIdCall(gameId).pipe(
                    shareReplay(1),
                    map((answers) => GameActions.getAllUsersAnswersSuccess({ answers })),
                    catchError((_) => of(openDialog({ title: 'Error getting all user answers' })))
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
            ofType(GameActions.getGameTimeAndStatusSuccess),
            withLatestFrom(this.gameFacadeService.selectStatusTimeAndCurrentSlideId(), this.gameFacadeService.selectStateGameSlides(), this.gameFacadeService.selectCurrentUserAnswer()),
            filter(([, , slides]) => slides?.length !== 0),
            debounceTime(300),
            switchMap(([, data, slides, userAnswer]) => {
                const slide = slides.find(slide => slide.id === data?.currentSlideId);
                const alreadyAnswered = slide?.id === userAnswer?.slideId;
                const noTimeRemaining = (this.timeService.getTimeDifferenceInSeconds(data?.timeStamp as number, slide?.seconds as number) ?? 0) <= 0;
                return of(GameActions.setIsDisableAnswer({ isDisabled: alreadyAnswered || noTimeRemaining }));
            }),
        )
    );

}
