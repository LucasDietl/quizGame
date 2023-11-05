import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { catchError, map, switchMap } from 'rxjs/operators';
import { JoinGameService } from 'src/app/services/join-game.service';
import { openDialog } from '../dialog/dialog.actions';
import * as JoinGameActions from './join-game.actions';
import { JoinGameFacadeService } from './join-game.facade.service';
import { UserFacadeService } from '../user/user-facade.service';
import { Router } from '@angular/router';

@Injectable()
export class JoinGameEffects {
    constructor(
        private actions$: Actions,
        private joinGameService: JoinGameService,
        private userFacadeService: UserFacadeService,
        private router: Router
    ) { }

    JoinGameById$ = createEffect(() =>
        this.actions$.pipe(
            ofType(JoinGameActions.joinGame),
            switchMap(({ gameId }) => {
                return from(this.joinGameService.gameIdExists(gameId)).pipe(
                    map((_) => JoinGameActions.joinGameSuccess({ gameId })),
                    catchError((error) => of(JoinGameActions.joinGameFail({ message: 'Could not find Game ID', error: JSON.stringify(error) })))
                )
            }),
        )
    );

    InitiateUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(JoinGameActions.joinGameSuccess),
            withLatestFrom(this.userFacadeService.userData()),
            switchMap(([{ gameId }, user]) => {
                return from(this.joinGameService.initiateAnswers(gameId, user)).pipe(
                    map(() => JoinGameActions.initiateUserAnswersSuccess({ gameId })),
                    catchError((error) => of(JoinGameActions.initiateUserAnswersFail({ message: 'Could not initiate user in game', error: JSON.stringify(error) })))
                )
            }),
        )
    );

    navigateUserUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(JoinGameActions.initiateUserAnswersSuccess),
            tap(({ gameId }) => {
                this.router.navigate(['/game', gameId])
            }),
        ),
        { dispatch: false }
    );

    JoinGameByIdFail$ = createEffect(() =>
        this.actions$.pipe(
            ofType(JoinGameActions.joinGameFail, JoinGameActions.initiateUserAnswersFail),
            map(({ message, error }) => {
                return openDialog({ title: message })
            }),
        )
    );
}
