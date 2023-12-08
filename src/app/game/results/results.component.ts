import { Component, Input } from '@angular/core';
import { faMedal, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Answers } from 'src/app/store/game/game.state';
import { User } from 'src/app/store/user/user.interface';
import { DestroyableComponent } from 'src/app/utils/destroyable/destroyable.component';

@Component({
  selector: 'qz-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends DestroyableComponent {
  @Input() userAnswer: Answers | null = null;
  @Input() users!: User[];
  @Input() allUsersAnswers!: Answers[];
  @Input() title: string = '';
  faTrophy = faTrophy;
  faMedal = faMedal;
  algo = 10;
  constructor(){
    super();
    // For Testing
    // setInterval(() => {
    //   this.algo ++;
    //   this.allUsersAnswers.unshift({
    //     id: `${this.algo}`, 
    //     userId: '1',
    //     nickName: 'Nombre',
    //     gameId: '1',
    //     slideId: '1',
    //     totalPoints: 150,
    //     previousTotalPoints: 150,
    //     joinedTimeStamp: 150,
    // });
    // }, 1500);
  }

  public trackBy(index: number, item: Answers): any {
    return item.userId;
  }
}
