import { selectGameStatus } from './../store/game/game.selectors';
import { Component, OnInit } from '@angular/core';
import { DestroyableComponent } from '../utils/destroyable/destroyable.component';
import { ActivatedRoute } from '@angular/router';
import { UserFacadeService } from '../store/user/user-facade.service';
import { GameFacadeService } from '../store/game/game.facade.service';
import { first, takeUntil } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Game, GameStatus, SlideOptions, SlideType, SlidesToPlay } from '../store/create-game/create-game.state';
import { AuthUser } from '../store/user/user.interface';
import { Answers } from '../store/game/game.state';
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
    public disableAnswers$!: Observable<boolean>;
    public currentSlide$!: Observable<SlidesToPlay | undefined>;
    public userAnswer$!: Observable<Answers>;
    public allUsersAnswers$!: Observable<Answers[]>;
    public allUsersAnswersRanking$!: Observable<Answers[]>;
    public timeStamp$!: Observable<number>;
    public gameStatus = GameStatus;
    public slideType = SlideType;
    public currentSlideId$!: Observable<string>;
    public status$!: Observable<GameStatus | null>;
    public loading: boolean = true;
    public isOwnerOfGame: boolean = false;

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
        this.status$ = this.gameFacadeService.selectGameStatus();
        this.allUsersAnswers$ = this.gameFacadeService.selectAllUsersAnswersByJoinTime();
        this.allUsersAnswersRanking$ = this.gameFacadeService.selectAllUsersAnswersByRanking();
        this.gameFacadeService.selectIsOwnerOfGame().pipe(
            takeUntil(this.destroyed$)
        ).subscribe(isOwner => {
            this.isOwnerOfGame = isOwner;
        });

        this.gameFacadeService.selectLoading()
            .pipe(
                takeUntil(this.destroyed$)
            ).subscribe(loading => {
                this.loading = loading;
            });
    }

    public selectedOption(option: SlideOptions, slideId: string, points: number = 0) {
        if(!this.isOwnerOfGame){
            const pointsToAdd = option.isCorrect ? points : 0;
            this.gameFacadeService.setUserAnswer(pointsToAdd, slideId);
        }
    }

    public timeIsUp(event: void): void {
        this.gameFacadeService.setIsDisableAnswer(true);
    }
    public trackBy(index: number, item: Answers): string {
        return item.userId;
    }
}
