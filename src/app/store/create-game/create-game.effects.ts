import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import { SlidesService } from 'src/app/services/slides.service';
import { UserFacadeService } from '../user/user-facade.service';
import * as CreateGameActions from './create-game.actions';
import { openDialog } from '../dialog/dialog.actions';
import { from, of } from 'rxjs';

@Injectable()
export class CreateGameEffects {
    constructor(private actions$: Actions, private userFacadeService: UserFacadeService, private gameService: GameService, private slidesService: SlidesService) { }

    getOwnedGames$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateGameActions.getCurrentGamesOwned),
            withLatestFrom(this.userFacadeService.userId()),
            switchMap(([_, userId]) => {
                return this.gameService.getOwnedGamesCall(userId).pipe(
                    map((games) => CreateGameActions.getCurrentGameOwnedSuccess({ games })),
                    catchError((_) => of(openDialog({ title: 'Error getting Owned games' })))

                )
            }),
        )
    );

    getSlidesByGameId$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateGameActions.getSlidesByGameId),
            switchMap(({ id }) => {
                return this.slidesService.getSlidesByGamesIdCall(id).pipe(
                    map((slides) => CreateGameActions.getSlidesByGameIdSuccess({ slides })),
                    catchError((_) => of(openDialog({ title: 'Error getting slides for game' })))
                );
            }),
        )
    );

}
