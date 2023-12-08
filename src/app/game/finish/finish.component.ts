import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { CommonFacadeService } from 'src/app/store/common/common-facade.service';
import { Answers } from 'src/app/store/game/game.state';
import { DestroyableComponent } from 'src/app/utils/destroyable/destroyable.component';
import { screenSizeNames } from 'src/app/utils/helpers/screen-size-names';
import { loadFull } from "tsparticles";
import {
  ClickMode,
  Container,
  Engine,
  HoverMode,
  MoveDirection,
  OutMode,
} from "tsparticles-engine";

@Component({
  selector: 'qz-finish',
  templateUrl: './finish.component.html',
  styleUrls: ['./finish.component.scss'],
  animations: []
})
export class FinishComponent extends DestroyableComponent {
  @Input() nickName: string = '';
  @Input() usersAnswers: Answers[] = [];
  @Input() userAnswer!: Answers;
  public amountToShow: number = 10; 
  public screenSizeNames = screenSizeNames;

  constructor(private commonFacadeService: CommonFacadeService) {
    super();
    this.commonFacadeService.selectScreenSize().pipe(takeUntil(this.destroyed$)).subscribe((size)=>{
      this.amountToShow = size === screenSizeNames.XSmall || size === screenSizeNames.Small ? 200 : 10;
    });
  }


  bueno = {
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
  mario = {
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
            src: "/assets/images/EmojiBlitzGenie1.webp",
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

  confettiSides = {
    fullScreen: {
      enable: true
    },
    particles: {
      number: {
        value: 0
      },
      color: {
        value: ["#1E00FF", "#FF0061", "#E1FF00", "#00FF9E"]
      },
      shape: {
        type: ["circle", "square"]
      },
      opacity: {
        value: {
          max: 1,
          min: 0
        },
        animation: {
          enable: true,
          speed: 2,
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
          value: 5
        },
        count: 1
      },
      move: {
        enable: true,
        gravity: {
          enable: true,
          acceleration: 20
        },
        speed: {
          min: 25,
          max: 50
        },
        drift: {
          min: -2,
          max: 2
        },
        decay: 0.05,
        direction: "none",
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
    interactivity: {
      detectsOn: "canvas",
      events: {
        resize: true
      }
    },
    detectRetina: true,
    // background: {
    //   color: "#000"
    // },
    responsive: [
      {
        maxWidth: 700,
        options: {
          particles: {
            move: {
              speed: 20,
              decay: 0.1
            }
          },
          emitters: [
            {
              direction: "top-right",
              rate: {
                delay: 0.1,
                quantity: 3
              },
              position: {
                x: 0,
                y: 10
              },
              size: {
                width: 0,
                height: 0
              }
            },
            {
              direction: "top-left",
              rate: {
                delay: 0.1,
                quantity: 3
              },
              position: {
                x: 100,
                y: 10
              },
              size: {
                width: 0,
                height: 0
              }
            }
          ]
        }
      }
    ],
    emitters: [
      {
        direction: "top-right",
        rate: {
          delay: 0.1,
          quantity: 10
        },
        position: {
          x: 0,
          y: 50
        },
        size: {
          width: 0,
          height: 0
        }
      },
      {
        direction: "top-left",
        rate: {
          delay: 0.1,
          quantity: 10
        },
        position: {
          x: 0,
          y: 50
        },
        size: {
          width: 0,
          height: 0
        }
      }
    ]
  };

  fireWorks = {
    // fullScreen: {
    //   enable: true
    // },
    detectRetina: true,
    // background: {
    //   color: "#000"
    // },
    fpsLimit: 60,
    emitters: {
      direction: "top",
      life: {
        count: 0,
        duration: 0.1,
        delay: 0.1
      },
      rate: {
        delay: 0.15,
        quantity: 1
      },
      size: {
        width: 100,
        height: 0
      },
      position: {
        y: 100,
        x: 50
      }
    },
    particles: {
      number: {
        value: 0
      },
      destroy: {
        mode: "split",
        split: {
          count: 1,
          factor: { value: 1 / 3 },
          rate: {
            value: 100
          },
          particles: {
            stroke: {
              color: {
                value: [
                  "#ffffff",
                  "#b22234",
                  "#b22234",
                  "#3c3bfe",
                  "#3c3bfe",
                  "#3c3bfe"
                ]
              },
              width: 1
            },
            number: {
              value: 0
            },
            collisions: {
              enable: false
            },
            opacity: {
              value: 1,
              animation: {
                enable: true,
                speed: 0.7,
                minimumValue: 0.1,
                sync: false,
                startValue: "max",
                destroy: "min"
              }
            },
            shape: {
              type: "circle"
            },
            size: {
              value: 1,
              animation: {
                enable: false
              }
            },
            life: {
              count: 1,
              duration: {
                value: {
                  min: 1,
                  max: 2
                }
              }
            },
            move: {
              enable: true,
              gravity: {
                enable: false
              },
              speed: 2,
              direction: "none",
              random: true,
              straight: false,
              outMode: "destroy"
            }
          }
        }
      },
      life: {
        count: 1
      },
      shape: {
        type: "line"
      },
      size: {
        value: 50,
        animation: {
          enable: true,
          sync: true,
          speed: 150,
          startValue: "max",
          destroy: "min"
        }
      },
      stroke: {
        color: {
          value: "#ffffff"
        },
        width: 1
      },
      rotate: {
        path: true
      },
      move: {
        enable: true,
        gravity: {
          acceleration: 15,
          enable: true,
          inverse: true,
          maxSpeed: 100
        },
        speed: { min: 10, max: 20 },
        outModes: {
          default: "destroy",
          top: "none"
        },
        trail: {
          fillColor: "#000",
          enable: true,
          length: 10
        }
      }
    }
  }
  particlesOptions2 = {
    background: {
      color: {
        value: "#0d47a1",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: ClickMode.push,
        },
        onHover: {
          enable: true,
          mode: HoverMode.repulse,
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff",
      },
      links: {
        color: "#ffffff",
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: MoveDirection.none,
        enable: true,
        outModes: {
          default: OutMode.bounce,
        },
        random: false,
        speed: 6,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 80,
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 5 },
      },
    },
    detectRetina: true,
  };

  particlesLoaded(container: Container): void {
    //console.log(container);
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }
}
