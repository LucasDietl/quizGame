import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { UserFacadeService } from '../store/user/user-facade.service';
import { first } from 'rxjs/operators';

export const GameGuard: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const gameService: GameService = inject(GameService);
    const router: Router = inject(Router);
    const userService: UserFacadeService = inject(UserFacadeService);
    const gameId = route?.params?.id;
    const userId = await userService.userId().pipe(first()).toPromise()
    if(gameId){
        let answerPresent: boolean = false;
        let gameExists: boolean = false;
        const answersPresent = await gameService.userAnswerCheck(gameId, userId);
        debugger;
        if(answersPresent.length !== 0){
            answerPresent = true;
        }
        const docInstance = gameService.gameIdExists(gameId);
        await docInstance.then(gameFound => {
            gameExists = gameFound
        }).catch(err => {
            gameExists = false;
        });
        return gameExists && answerPresent ? true : router.navigate(['/joinGame']);
    }
    return router.navigate(['/joinGame']);
};
