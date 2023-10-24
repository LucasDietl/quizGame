import { Component, OnInit } from '@angular/core';
import { DestroyableComponent } from '../utils/destroyable/destroyable.component';
import { ActivatedRoute } from '@angular/router';
import { UserFacadeService } from '../store/user/user-facade.service';
import { GameFacadeService } from '../store/game/game.facade.service';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Game, GameStatus, SlidesToPlay } from '../store/create-game/create-game.state';
import { AuthUser, User } from '../store/user/user.interface';

@Component({
  selector: 'qz-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent extends DestroyableComponent implements OnInit {
  private gameId: string = '';
  public game$!: Observable<Game | null>;
  public user$!: Observable<AuthUser>;
  public currentSlide$!: Observable<SlidesToPlay | undefined>;
  public gameStatus = GameStatus;
  constructor(private route: ActivatedRoute, private userFacadeService: UserFacadeService, private gameFacadeService: GameFacadeService){
    super();
  }
  ngOnInit(): void {
    this.route.params.pipe(first()).subscribe(params => {
      console.log(params) //log the entire params object
      console.log(params['id']) //log the value of id
      const gameId = params['id']; 
      if(gameId){
        this.gameId = gameId;
        this.gameFacadeService.getGameById(params?.id);
      }
    });
    this.user$ = this.userFacadeService.userData();
    this.game$ = this.gameFacadeService.selectCurrentGame();
    this.currentSlide$ = this.gameFacadeService.getCurrentSlide();

  }
  public startGame(): void {
    this.gameFacadeService.changeGameStatus(GameStatus.inProgress, this.gameId);
  }

  public setNextSlide(): void {
    this.gameFacadeService.setNextSlideId();
  }
}
