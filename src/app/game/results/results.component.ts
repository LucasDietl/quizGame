import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { faMedal, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { GameFacadeService } from 'src/app/store/game/game.facade.service';
import { Answers } from 'src/app/store/game/game.state';

@Component({
  selector: 'qz-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit, OnDestroy {
  @Input() userAnswer: Answers | null = null;
  @Input() isOwner: boolean = false;
  @Input() gameId!: string;
  @Input() title: string = '';
  public faTrophy = faTrophy;
  public faMedal = faMedal;
  public allUsersAnswersRanking$ = this.gameFacadeService.selectAllUsersAnswersByRanking();
  // public allUsersAnswersRanking$ = of([{
  //   id: `${1}`,
  //   userId: '1',
  //   nickName: 'Nombre',
  //   gameId: '1',
  //   slideId: '1',
  //   totalPoints: 150,
  //   previousTotalPoints: 150,
  //   joinedTimeStamp: 150,
  // }
  // ]);


  constructor(private gameFacadeService: GameFacadeService) {
  }

  ngOnInit(): void {
    if (!this.isOwner) {
      this.gameFacadeService.getAllUsersAnswersOnce(this.gameId);
    }
  }

  public trackBy(index: number, item: Answers): any {
    return item.userId;
  }

  ngOnDestroy(): void {
    if (!this.isOwner) {
      this.gameFacadeService.removeAllUserAnswers();
    }
  }
}
