import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, first } from 'rxjs';
import { JoinGameFacadeService } from '../store/join-game/join-game.facade.service';
import { DestroyableComponent } from '../utils/destroyable/destroyable.component';

@Component({
  selector: 'qz-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.scss']
})
export class JoinGameComponent extends DestroyableComponent implements OnInit{
  joinGameForm: FormGroup;
  isLoading$!: Observable<boolean>;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private joinGameFacadeService: JoinGameFacadeService,
    private route: ActivatedRoute
    ) {
      super();
    this.joinGameForm = this.fb.group({
      gameId: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.isLoading$ = this.joinGameFacadeService.selectLoading();
    this.route.params.pipe(first()).subscribe(async params => {
      const gameId = params['id'];
      if (gameId) {

        this.joinGameForm.setValue({ gameId});
      }
    });
  }

  public joinGame(formDirective: FormGroupDirective): void {
    const gameId =  this.joinGameForm.value.gameId;
    if (gameId) {
      this.joinGameFacadeService.joinGameById(gameId);
    }
  }

  public createNewGame(): void {
    this.router.navigate(['createGame']);
  }
}
