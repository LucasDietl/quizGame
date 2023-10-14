import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { UserIdGuard } from './guards/user-id.guard';

const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  {
    path: '', component: RegisterComponent, canActivate: [UserIdGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
