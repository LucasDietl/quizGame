import { Component, OnInit } from '@angular/core';
import { DestroyableComponent } from '../utils/destroyable/destroyable.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFacadeService } from '../store/user/user-facade.service';
import { GameFacadeService } from '../store/game/game.facade.service';
import { first } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Game, GameStatus, SlideOptions, SlidesToPlay } from '../store/create-game/create-game.state';
import { AuthUser } from '../store/user/user.interface';
import { GameService } from '../services/game.service';

@Component({
  selector: 'qz-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent extends DestroyableComponent implements OnInit {
  private gameId: string = '';
  public game$!: Observable<Game | null>;
  public user$!: Observable<AuthUser>;
  public disableAnswers$! : Observable<boolean>;
  public currentSlide$!: Observable<SlidesToPlay | undefined>;
  public gameStatus = GameStatus;
  constructor(private route: ActivatedRoute, private router: Router, private userFacadeService: UserFacadeService, private gameFacadeService: GameFacadeService, private gameService: GameService){
    super();
  }
  ngOnInit(): void {
    this.route.params.pipe(first()).subscribe(async params => {
      const gameId = params['id'];
      const gameExists = await this.gameService.gameIdExists(gameId);
      if(gameExists){
        this.gameId = gameId;
        this.gameFacadeService.getGameById(gameId);
        this.checkUserStats(gameId);
        this.setObservables();
      } else {
        this.router.navigate(['joinGame'])
      }
    });
  }
  private checkUserStats(gameId: string): void {
    // this.gameFacadeService.checkUserStats();
  }
  
  private setObservables(): void {
    this.user$ = this.userFacadeService.userData();
    this.game$ = this.gameFacadeService.selectCurrentGame();
    this.currentSlide$ = this.gameFacadeService.getCurrentSlide();
    this.disableAnswers$ = this.gameFacadeService.selectDisabledAnswers();
  }
  public startGame(): void {
    this.gameFacadeService.changeGameStatus(GameStatus.inProgress, this.gameId);
  }

  public setNextSlide(): void {
    this.gameFacadeService.setNextSlideId();
  }
  public selectedOption(option: SlideOptions, points: number = 0){
    console.log(option, points);
  }
}
