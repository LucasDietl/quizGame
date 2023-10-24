import { Component, OnInit } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { DialogFacadeService } from '../store/dialog/dialog-facade.service';
import { UserFacadeService } from '../store/user/user-facade.service';
import { AuthUser } from '../store/user/user.interface';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DestroyableComponent } from '../utils/destroyable/destroyable.component';
import { JoinGameFacadeService } from '../store/join-game/join-game.facade.service';
import { JoinGameService } from '../services/join-game.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss']
})
export class JoinGameComponent extends DestroyableComponent implements OnInit{
  joinGameForm: FormGroup;
  isLoading$!: Observable<boolean>;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private firestore: Firestore, 
    private userFacadeService: UserFacadeService,
    private joinGameService: JoinGameService,
    private joinGameFacadeService: JoinGameFacadeService
    ) {
      super();
    this.joinGameForm = this.fb.group({
      gameId: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.isLoading$ = this.joinGameFacadeService.selectLoading();
  }

  public joinGame(formDirective: FormGroupDirective): void {
    const gameId =  this.joinGameForm.value.gameId;
    if (gameId) {
      this.joinGameFacadeService.joinGameById(gameId);
    }
    console.log('Add join game logic here', this.joinGameForm.value);
  }

  public createNewGame(): void {
    this.router.navigate(['createGame']);
  }
}
