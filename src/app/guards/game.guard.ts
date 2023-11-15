import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { UserFacadeService } from '../store/user/user-facade.service';
import { first } from 'rxjs/operators';
import { Game } from '../store/create-game/create-game.state';

export const GameGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const gameService: GameService = inject(GameService);
    const router: Router = inject(Router);
    const userService: UserFacadeService = inject(UserFacadeService);
    const gameId = route?.params?.id;
    const userId = await userService.userId().pipe(first()).toPromise() as string;
    if(gameId){
        let answerPresent: boolean = false;
        let gameExists: boolean = false;
        let foundGame: Game = {} as any;
        const answersPresent = await gameService.userAnswerCheck(gameId, userId);
        if(answersPresent.length !== 0){
            answerPresent = true;
        }
        const docInstance = gameService.gameIdExists(gameId);
        await docInstance.then(({exists, game}) => {
            gameExists = exists;
            foundGame = game;
            
        }).catch(err => {
            gameExists = false;
        });
        const isOwner = foundGame?.ownerId === userId;
        return isOwner || gameExists && answerPresent ? true : router.navigate(['/joinGame']);
    }
    return router.navigate(['/joinGame']);
};
