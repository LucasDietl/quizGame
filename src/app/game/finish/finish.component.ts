import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { CommonFacadeService } from 'src/app/store/common/common-facade.service';
import { GameFacadeService } from 'src/app/store/game/game.facade.service';
import { Answers } from 'src/app/store/game/game.state';
import { DestroyableComponent } from 'src/app/utils/destroyable/destroyable.component';
import { screenSizeNames } from 'src/app/utils/helpers/screen-size-names';
import { loadFull } from "tsparticles";
import {
  Container,
  Engine
} from "tsparticles-engine";

@Component({
  selector: 'qz-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss']
})
export class FinishComponent extends DestroyableComponent implements OnInit {
  @Input() nickName: string = '';
  @Input() userAnswer!: Answers;
  @Input() gameId!: string;
  @Input() isOwner: boolean = false;
  public allUsersAnswersRanking$ = this.gameFacadeService.selectAllUsersAnswersByRanking();
  public amountToShow: number = 10; 
  public screenSizeNames = screenSizeNames;

  constructor(private commonFacadeService: CommonFacadeService, public gameFacadeService: GameFacadeService) {
    super();
    this.commonFacadeService.selectScreenSize().pipe(takeUntil(this.destroyed$)).subscribe((size)=>{
      this.amountToShow = size === screenSizeNames.XSmall || size === screenSizeNames.Small ? 200 : 10;
    });
  }

  ngOnInit(): void {
    if (!this.isOwner) {
      this.gameFacadeService.getAllUsersAnswersOnce(this.gameId);
    }
  }

  public bueno = {
    fpsLimit: 60,
    particles: {
      number: {
        value: 0
      },
      color: {
        value: "#f00"
      },
      shape: {
        type: ["circle", "square", "polygon"],
        options: {
          polygon: {
            sides: 6
          }
        }
      },
      opacity: {
        value: { min: 0, max: 1 },
        animation: {
          enable: true,
          speed: 1,
          startValue: "max",
          destroy: "min"
        }
      },
      size: {
        value: { min: 3, max: 7 }
      },
      life: {
        duration: {
          sync: true,
          value: 7
        },
        count: 1
      },
      move: {
        enable: true,
        gravity: {
          enable: true
        },
        drift: {
          min: -2,
          max: 2
        },
        speed: { min: 10, max: 30 },
        decay: 0.1,
        direction: "none",
        random: false,
        straight: false,
        outModes: {
          default: "destroy",
          top: "none"
        }
      },
      rotate: {
        value: {
          min: 0,
          max: 360
        },
        direction: "random",
        move: true,
        animation: {
          enable: true,
          speed: 60
        }
      },
      tilt: {
        direction: "random",
        enable: true,
        move: true,
        value: {
          min: 0,
          max: 360
        },
        animation: {
          enable: true,
          speed: 60
        }
      },
      roll: {
        darken: {
          enable: true,
          value: 25
        },
        enable: true,
        speed: {
          min: 15,
          max: 25
        }
      },
      wobble: {
        distance: 30,
        enable: true,
        move: true,
        speed: {
          min: -15,
          max: 15
        }
      }
    },
    detectRetina: true,
    emitters: {
      direction: "none",
      spawnColor: {
        value: "#ff0000",
        animation: {
          h: {
            enable: true,
            offset: {
              min: -1.4,
              max: 1.4
            },
            speed: 0.1,
            sync: false
          },
          l: {
            enable: true,
            offset: {
              min: 20,
              max: 80
            },
            speed: 0,
            sync: false
          }
        }
      },
      life: {
        count: 0,
        duration: 0.1,
        delay: 0.6
      },
      rate: {
        delay: 0.1,
        quantity: 100
      },
      size: {
        width: 0,
        height: 0
      }
    }
  };

  public particlesLoaded(container: Container): void {
    //console.log(container);
  }

  public async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }

  ngOnDestroy(): void {
    if (!this.isOwner) {
      this.gameFacadeService.removeAllUserAnswers();
    }
  }
}
