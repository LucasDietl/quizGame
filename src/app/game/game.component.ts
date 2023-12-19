import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { Game, GameStatus, SlideOptions, SlideType, SlidesToPlay } from '../store/create-game/create-game.state';
import { GameFacadeService } from '../store/game/game.facade.service';
import { Answers } from '../store/game/game.state';
import { UserFacadeService } from '../store/user/user-facade.service';
import { AuthUser } from '../store/user/user.interface';
import { DestroyableComponent } from '../utils/destroyable/destroyable.component';
import { TimeService } from '../services/time.service';

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
    public timeStamp$!: Observable<number>;
    public gameStatus = GameStatus;
    public slideType = SlideType;
    public currentSlideId$!: Observable<string>;
    public status$!: Observable<GameStatus | null>;
    public loading: boolean = true;
    public isOwnerOfGame: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private userFacadeService: UserFacadeService,
        private gameFacadeService: GameFacadeService,
        private timeService: TimeService) {
        super();
    }

    ngOnInit(): void {
        this.route.params.pipe(first()).subscribe(async params => {
            const gameId = params['id'];
            this.gameId = gameId;
            this.gameFacadeService.getGameById(gameId);
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
        this.status$ = this.gameFacadeService.selectGameStatus();
        this.allUsersAnswers$ = this.gameFacadeService.selectAllUsersAnswersByJoinTime();
        this.timeStamp$ = this.gameFacadeService.selectGameTimeStamp();
        this.gameFacadeService.selectIsOwnerOfGame().pipe(
            takeUntil(this.destroyed$)
        ).subscribe(isOwner => {
            this.isOwnerOfGame = isOwner;
        });

        this.gameFacadeService.selectLoading().pipe(
            takeUntil(this.destroyed$)
        ).subscribe(loading => {
            this.loading = loading;
        });
    }

    public selectedOption(option: SlideOptions, slideId: string, currentSlide: SlidesToPlay, timeStamp: number) {
        if (!this.isOwnerOfGame) {
            const points = currentSlide?.points || 1;
            const seconds = currentSlide?.seconds || 1;
            const remainingSeconds = this.timeService.getTimeDifferenceInSeconds(timeStamp, seconds);
            const minPoints = Math.round(points * 0.05);
            const speedPoints = Math.max((remainingSeconds / seconds * points), minPoints);
            const pointsToAdd = option.isCorrect ? Math.round(speedPoints) : 0;
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
