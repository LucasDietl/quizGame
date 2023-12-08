import { Component, Input } from '@angular/core';
import { Answers } from 'src/app/store/game/game.state';
import { animate, style, transition, trigger } from '@angular/animations';
import { Container, Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { CommonFacadeService } from 'src/app/store/common/common-facade.service';
import { Observable, of } from 'rxjs';
import { screenSizeNames } from 'src/app/utils/helpers/screen-size-names';

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
  @Input() isOwner: boolean = false;
  public screenSize$: Observable<string> = of();
  public screenSizeNames = screenSizeNames;

  public mario = {
    particles: {
      move: {
        enable: true,
        speed: { min: 1, max: 6 }
      },
      number: {
        value: 20,
        max: 30
      },
      opacity: {
        value: 1
      },
      rotate: {
        path: true
      },
      shape: {
        options: {
          image: {
            gif: true,
            height: 200,
            // src: "https://particles.js.org/images/mario.gif",
            src: "/assets/images/woody-buzz.png",
            width: 200
          }
        },
        type: "image"
      },
      size: {
        value: {
          min: 32,
          max: 64
        }
      }
    }
  };


constructor(private commonFacadeService: CommonFacadeService){
  this.screenSize$ = this.commonFacadeService.selectScreenSize();
  // For Testing
  setInterval(() => {
    this.connectedUsers.unshift({
      id: '1', 
      userId: '1',
      nickName: 'Nombre',
      gameId: '1',
      slideId: '1',
      totalPoints: 150,
      previousTotalPoints: 150,
      joinedTimeStamp: 150,
  });
  }, 1500);
}

particlesLoaded(container: Container): void {
  //console.log(container);
}

async particlesInit(engine: Engine): Promise<void> {
  await loadFull(engine);
}

}
