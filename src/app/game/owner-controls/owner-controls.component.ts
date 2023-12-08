import { Component, Input, OnInit } from '@angular/core';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Game, GameStatus } from 'src/app/store/create-game/create-game.state';
import { GameFacadeService } from 'src/app/store/game/game.facade.service';
import { AuthUser } from 'src/app/store/user/user.interface';
import { DestroyableComponent } from 'src/app/utils/destroyable/destroyable.component';
import { faAngleRight, faFlagCheckered, faPlayCircle, faPlay, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'qz-owner-controls',
    templateUrl: './owner-controls.component.html',
    styleUrls: ['./owner-controls.component.scss']
})
export class OwnerControlsComponent extends DestroyableComponent implements OnInit {
    @Input() game!: Game;
    @Input() user!: AuthUser;
    @Input() currentSlideId!: string;
    @Input() status!: GameStatus;
    public faAngleRight = faAngleRight;
    public faFlagCheckered = faFlagCheckered;
    public faPlayCircle = faPlayCircle;


    public gameStatus = GameStatus;
    public lastSlideId!: string;
    constructor(private gameFacadeService: GameFacadeService) {
        super()
    }

    ngOnInit(): void {
        this.setSubscriptions();
    }

    private setSubscriptions(): void {
        combineLatest([
            this.gameFacadeService.selectAllUsersAnswers(),
            this.gameFacadeService.selectStatusTimeAndCurrentSlideId()
        ]).pipe(
            debounceTime(200),
            takeUntil(this.destroyed$)
        ).subscribe(([allAnswers, data]) => {
            const {currentSlideId, status} = data;
            if (currentSlideId && status === GameStatus.inProgress && allAnswers?.length) {
                const allAnswered = allAnswers.every((answer) => answer.slideId === currentSlideId);
                if (allAnswered) {
                    this.gameFacadeService.setNextSlideId();
                }
            }
            this.currentSlideId = currentSlideId;
        });
        this.gameFacadeService.selectGameSlides().pipe(takeUntil(this.destroyed$)).subscribe(slides => { this.lastSlideId = slides.find(slide => slide.order === slides.length - 1)?.id ?? ''; });
    }

    public startGame(): void {
        this.gameFacadeService.changeGameStatus(GameStatus.inProgress, this.game.id);
    }

    public setNextSlide(): void {
        this.gameFacadeService.setNextSlideId();
    }

    public finishGame(): void {
        this.gameFacadeService.changeGameStatus(this.gameStatus.finished, this.game.id);
    }
}
