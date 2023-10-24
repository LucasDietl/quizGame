import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, withLatestFrom } from 'rxjs/operators';
import { GameService } from 'src/app/services/game.service';
import { SlidesService } from 'src/app/services/slides.service';
import { UserFacadeService } from '../user/user-facade.service';
import * as CreateGameActions from './create-game.actions';

@Injectable()
export class CreateGameEffects {
    constructor(private actions$: Actions, private userFacadeService: UserFacadeService, private gameService: GameService, private slidesService: SlidesService) { }

    getOwnedGames$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateGameActions.getCurrentGamesOwned),
            withLatestFrom(this.userFacadeService.userId()),
            mergeMap(([_, userId]) => {
                return this.gameService.getOwnedGamesCall(userId);
            }),
            map((games) => CreateGameActions.getCurrentGameOwnedSuccess({ games }))
        )
    );

    getSlidesByGameId$ = createEffect(() =>
    this.actions$.pipe(
        ofType(CreateGameActions.getSlidesByGameId),
        mergeMap(({id}) => {
            return this.slidesService.getSlidesByGamesIdCall(id);
        }),
        map((slides) => CreateGameActions.getSlidesByGameIdSuccess({ slides })),
    )
);

}
