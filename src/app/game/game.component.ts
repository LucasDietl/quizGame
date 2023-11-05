import { Component, OnInit } from '@angular/core';
import { DestroyableComponent } from '../utils/destroyable/destroyable.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserFacadeService } from '../store/user/user-facade.service';
import { GameFacadeService } from '../store/game/game.facade.service';
import { first, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Game, GameStatus, SlideOptions, SlideType, SlidesToPlay } from '../store/create-game/create-game.state';
import { AuthUser } from '../store/user/user.interface';
import { Answers } from '../store/game/game.state';

@Component({
    selector: 'qz-game',
    templateUrl: './game.component.html',
    styleUrls: ['./game.component.scss']
})
export class GameComponent extends DestroyableComponent implements OnInit {
    private gameId: string = '';
    public game$!: Observable<Game | null>;
    public user$!: Observable<AuthUser>;
    public disableAnswers$!: Observable<boolean>;
    public currentSlide$!: Observable<SlidesToPlay | undefined>;
    public userAnswer$!: Observable<Answers>;
    public allUsersAnswers$!: Observable<Answers[]>;
    public allUsersAnswersRanking$!: Observable<Answers[]>;
    public timeStamp$!: Observable<number>;
    public gameStatus = GameStatus;
    public slideType = SlideType;
    public currentSlideId$!: Observable<string>;

    constructor(private route: ActivatedRoute, private userFacadeService: UserFacadeService, private gameFacadeService: GameFacadeService) {
        super();
    }
    ngOnInit(): void {
        this.route.params.pipe(first()).subscribe(async params => {
            const gameId = params['id'];
            this.gameId = gameId;
            this.gameFacadeService.getGameById(gameId);
            this.gameFacadeService.getAllUsersAnswers(this.gameId);
            this.setObservables();
        });
    }

    private setObservables(): void {
        this.user$ = this.userFacadeService.userData();
        this.game$ = this.gameFacadeService.selectCurrentGame();
        this.currentSlide$ = this.gameFacadeService.selectCurrentSlide();
        this.currentSlideId$ = this.gameFacadeService.selectCurrentSlideId();
        this.disableAnswers$ = this.gameFacadeService.selectDisabledAnswers();
        this.userAnswer$ = this.gameFacadeService.selectCurrentUserAnswer();
        this.timeStamp$ = this.gameFacadeService.selectGameTimeStamp();
        this.allUsersAnswers$ = this.gameFacadeService.selectAllUsersAnswersByJoinTime();
        this.allUsersAnswersRanking$ = this.gameFacadeService.selectAllUsersAnswersByRanking()
    }

    public selectedOption(option: SlideOptions, slideId: string, points: number = 0) {
        const pointsToAdd = option.isCorrect ? points : 0;
        this.gameFacadeService.setUserAnswer(pointsToAdd, slideId);
    }

    public timeIsUp(event: any): void {
        debugger;
        this.gameFacadeService.setIsDisableAnswer(true);
    }
    trackBy(index: number, item: Answers): string {
        return item.userId;
    }
}
