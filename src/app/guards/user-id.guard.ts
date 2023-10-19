import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserFacadeService } from '../store/user/user-facade.service';

export const UserIdGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
  const userFacadeService: UserFacadeService = inject(UserFacadeService); 
  const router: Router = inject(Router);
  return userFacadeService.userId().pipe(
    map((userId) => {
      if (userId) {
        return true;
      } else {
        return router.createUrlTree(['/joinGame']);
      }
    })
  );
};
