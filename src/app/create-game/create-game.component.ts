import { Component, OnInit } from '@angular/core';
import { Firestore, addDoc, arrayUnion, collection, doc, updateDoc } from '@angular/fire/firestore';
import { collectionNames } from '../utils/helpers/collection-names';
import { UserFacadeService } from '../store/user/user-facade.service';
import { first, tap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CreateGameFacadeService } from '../store/create-game/create-game-facade.service';
import { Game, GameStatus, SlideType, SlidesToCreate, SlidesToPlay } from '../store/create-game/create-game.state';
import { FormArray, FormBuilder, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {
  public gameForm: FormGroup;
  public slides!: FormArray;
  private userId: string = '';
  public games$: Observable<Game[]>;
  public selectedGame!: Game;
  public gameTitle: FormControl = new FormControl();
  public slideType = SlideType;

  constructor(private formBuilder: FormBuilder, private firestore: Firestore, private userFacadeService: UserFacadeService, private createGameFacadeService: CreateGameFacadeService) {
    this.gameForm = this.formBuilder.group({
      title: '',
      slides: this.formBuilder.array<any>([]),
    });
    
    this.games$ = this.createGameFacadeService.selectGamesOwned().pipe(tap(games => {
      if (this.selectedGame === undefined && !!games?.length) {
        this.setGameById(games[0].id);
        this.createGameFacadeService.getGameSlides(games[0].id)
      }
    }));

  }

  getSlides(): FormArray {
    return this.gameForm.get('slides') as FormArray;
  }

  ngOnInit(): void {
    this.userFacadeService.userId().subscribe((userId => {
      this.userId = userId;
    }));
    this.createGameFacadeService.getOwnedGames();
  }

  public onSubmit(): void {
    const { slides, title } = this.gameForm.value;
    this.createGameFacadeService.updateGameTitle(title, this.selectedGame.id);
    this.createGameFacadeService.updateSlides(slides);

  }

  public createNewGame(): void {
    const newGame = {
      title: 'New Game',
      slides: [],
      ownerId: this.userId,
      status: GameStatus.standBy
    };
    const collectionInstance = collection(this.firestore, collectionNames.games);
    addDoc(collectionInstance, newGame).then((data)=> {
      this.setGameById(data.id);
      console.log('creation success');
    });
  }

  public deleteGame(): void{
    this.createGameFacadeService.deleteGame(this.selectedGame);
  }

  public addNewSlide(type: SlideType): void {
    const slidesLength = this.selectedGame.slides.length;
    const order = slidesLength ?? 0;
    let newSlide: SlidesToCreate = {
      type,
      gameId: this.selectedGame.id,
      title: 'New Slide Question or title',
      order
    }
    if ( type !== 'results') {
      const amount = type === this.slideType.quiz ? 4 : type === this.slideType.aOrB ? 2: 0;
      const options = new Array(amount).fill({ title: 'Add answer or title', isCorrect: false});
      newSlide = { ...newSlide,
        seconds: 15,
        points: 100,
        imageUrl: '',
        options: options
      };
    }

    this.createGameFacadeService.addNewSlide(this.selectedGame.id, newSlide);
  }

  public deleteSlide(_: any, slideIndex: number): void {
    const slides: SlidesToPlay[] = this.gameForm.value.slides;
    const {id} = slides[slideIndex];
    this.createGameFacadeService.deleteSlide(id, this.selectedGame.id);
  }

  public setGameById(id: string): void {
    this.createGameFacadeService.selectedCurrentGameToCreate(id).subscribe((game: Game) => {
      console.log('Setting game with subscription');
      this.selectedGame = game;
      this.gameForm.patchValue(game);
    });

    this.createGameFacadeService.selectSlidesByGameId().subscribe((slides: SlidesToPlay[]) => {
      this.slides = this.formBuilder.array(slides.map((slide) => {
        return this.createSlideFormGroup(slide)
      }));
      this.gameForm.setControl('slides', this.slides);
    })
  }

  private createSlideFormGroup(slide: SlidesToPlay) {
    return this.formBuilder.group({
      id: slide.id,
      type: slide.type,
      title: slide.title,
      imageUrl: slide?.imageUrl,
      order: slide.order,
      points: slide?.points,
      seconds: slide?.seconds,
      options: slide.options ? this.formBuilder.array(
        slide.options.map((option) =>
          this.formBuilder.group({
            isCorrect: option.isCorrect,
            title: option.title,
          })
        )
      ): [],
    });
  }

}
