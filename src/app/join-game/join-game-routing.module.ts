import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JoinGameComponent } from './join-game.component';


const routes: Routes = [
  {
    path: ':id',
    component: JoinGameComponent
  },
  {
    path: '**',
    component: JoinGameComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JoinGameRoutingModule { }