import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { UserIdGuard } from './guards/user-id.guard';
import { GameGuard } from './guards/game.guard';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';

const routes: Routes = [
  { path: '', component: RegisterComponent },
  {
    path: 'joinGame',
    canActivate: [UserIdGuard],
    loadChildren: () => import('./join-game/join-game.module').then(m => m.JoinGameModule),
  },
  {
    path: 'createGame',
    canActivate: [UserIdGuard],
    loadChildren: () => import('./create-game/create-game.module').then(m=>m.CreateGameModule)
  },
  {
    path: 'game/:id',
    canActivate: [UserIdGuard, GameGuard],
    loadChildren: () => import('./game/game.module').then(m=>m.GameModule)
  },
  {
    path: 'qr/:id',
    loadChildren: () => import('./qr-code/qr-code.module').then(m=>m.QrCodeModule)
  },
  {
    path: '**',
    component: NoPageFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
