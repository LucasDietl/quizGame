import { Component, Input } from '@angular/core';
import { Answers } from 'src/app/store/game/game.state';
import { animate, style, transition, trigger } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('1400ms', style({ opacity: 1 })),
  ]),
]);

@Component({
  selector: 'qz-stand-by',
  templateUrl: './stand-by.component.html',
  styleUrls: ['./stand-by.component.scss'],
  animations: [fadeIn]
})
export class StandByComponent {
  @Input() nickName: string = '';
  @Input() title: string = '';
  @Input() connectedUsers: Answers[] = [];

constructor(){
  // For Testing
  // setInterval(() => {
  //   this.connectedUsers.unshift({
  //     id: '1', 
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

}
