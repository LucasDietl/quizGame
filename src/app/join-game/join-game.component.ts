import { Component } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { DialogFacadeService } from '../store/dialog/dialog-facade.service';
import { UserFacadeService } from '../store/user/user-facade.service';
import { AuthUser } from '../store/user/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss']
})
export class JoinGameComponent {
  joinGameForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private firestore: Firestore, 
    private dialogFacadeService: DialogFacadeService, 
    private userFacadeService: UserFacadeService
    ) {
    this.joinGameForm = this.fb.group({
      join: ['', [Validators.required]],
    });
  }

  public joinGame(formDirective: FormGroupDirective): void {
    console.log('Add join game logic here', this.joinGameForm.value);
  }

  public createNewGame(): void {
    this.router.navigate(['createGame']);
  }
}
