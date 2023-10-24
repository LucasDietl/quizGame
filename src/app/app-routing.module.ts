import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { UserIdGuard } from './guards/user-id.guard';

const routes: Routes = [
  { path: '', component: RegisterComponent },
  {
    path: 'joinGame',
    canActivate: [UserIdGuard],
    loadChildren: () => import('./join-game/join-game.module').then(m => m.JoinGameModule)
  },
  {
    path: 'createGame',
    canActivate: [UserIdGuard],
    loadChildren: () => import('./create-game/create-game.module').then(m=>m.CreateGameModule)
  },
  {
    path: 'game/:id',
    canActivate: [UserIdGuard],
    loadChildren: () => import('./game/game.module').then(m=>m.GameModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
