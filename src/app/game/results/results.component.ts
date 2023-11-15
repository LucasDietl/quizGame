import { Component, Input, OnInit } from '@angular/core';
import { Answers } from 'src/app/store/game/game.state';
import { User } from 'src/app/store/user/user.interface';
import { DestroyableComponent } from 'src/app/utils/destroyable/destroyable.component';
import { faTrophy, faMedal } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'qz-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent extends DestroyableComponent implements OnInit {
  @Input() userAnswer: Answers | null = null;
  @Input() users!: User[];
  @Input() allUsersAnswers!: Answers[];
  @Input() title: string = '';
  faTrophy = faTrophy;
  faMedal = faMedal;
  constructor(){
    super();
  }

  ngOnInit() {

  }

  public trackBy(index: number, item: Answers): any {
    return item.userId;
  }
}
