import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, withLatestFrom, switchMap } from 'rxjs/operators';
import { UserFacadeService } from '../user/user-facade.service';
import { CreateGameFacadeService } from './create-game-facade.service';
import * as CreateGameActions from './create-game.actions';

@Injectable()
export class CreateGameEffects {
    constructor(private actions$: Actions, private firestore: Firestore, private userFacadeService: UserFacadeService, private createGameFacadeService: CreateGameFacadeService) { }

    getOwnedGames$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CreateGameActions.getCurrentGameOwned),
            withLatestFrom(this.userFacadeService.userId()),
            mergeMap(([_, userId]) => {
                return this.createGameFacadeService.getOwnedGamesCall(userId);
            }),
            map((games) => CreateGameActions.getCurrentGameOwnedSuccess({ games }))
        )
    );

    getSlidesByGameId$ = createEffect(() =>
    this.actions$.pipe(
        ofType(CreateGameActions.getSlidesByGameId),
        mergeMap(({id}) => {
            return this.createGameFacadeService.getSlidesByGamesIdCall(id);
        }),
        map((slides) => CreateGameActions.getSlidesByGameIdSuccess({ slides })),
    )
);

}
