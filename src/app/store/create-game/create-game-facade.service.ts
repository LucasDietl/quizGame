import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.state';
import { Observable } from 'rxjs';
import * as CreateGameActions from './create-game.actions'
import { collection, where, getDocs, Firestore, query, onSnapshot, Unsubscribe, addDoc, updateDoc, doc, arrayUnion, writeBatch, setDoc, deleteDoc, arrayRemove } from '@angular/fire/firestore';
import { collectionNames } from 'src/app/utils/helpers/collection-names';
import { FireStoreOperators } from 'src/app/utils/helpers/firestore.operators';
import { Game, SlideType, SlidesToCreate, SlidesToPlay } from './create-game.state';
import { selectGameById, selectGames, selectSlides } from './create-game.selectors';


@Injectable({
  providedIn: 'root',
})
export class CreateGameFacadeService {
  constructor(private store: Store<AppState>, private firestore: Firestore) {
  }

  public getOwnedGames(): void {
    this.store.dispatch(CreateGameActions.getCurrentGameOwned());
  }

  public getGameSlides(id: string): void {
    this.store.dispatch(CreateGameActions.getSlidesByGameId({ id }));
  }

  public selectGamesOwned(): Observable<Game[]> {
    return this.store.select(selectGames);
  }

  public selectedCurrentGameToCreate(id: string): Observable<Game> {
    return this.store.select(selectGameById(id)) as Observable<Game>;
  }

  public selectSlidesByGameId(): Observable<SlidesToPlay[]> {
    return this.store.select(selectSlides);
  }

  // public userId(): Observable<string> {
  //   return this.store.select(UserSelectors.selectUserId);
  // }

  // public user(): Observable<UserState> {
  //   return this.store.select(UserSelectors.selectUser);
  // }

  public getOwnedGamesCall(ownerId: string): Observable<Game[]> {
    const collectionInstance = collection(this.firestore, collectionNames.games);
    const q = query(collectionInstance, where('ownerId', FireStoreOperators.EQ, ownerId));

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const games: Game[] = [];
        querySnapshot.forEach((doc) => {
          const { title, ownerId, slides, status } = doc.data();
          const game = { id: doc.id, title, ownerId, slides, status };
          games.push(game);
        });
        observer.next(games);
      });
      return () => {
        unsubscribe();
      };
    });
  }

  public getSlidesByGamesIdCall(gameId: string): Observable<SlidesToPlay[]> {
    const collectionInstance = collection(this.firestore, collectionNames.slides);
    const q = query(collectionInstance, where('gameId', FireStoreOperators.EQ, gameId));

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const slides: SlidesToPlay[] = [];
        querySnapshot.forEach((doc) => {
          const { title, type, order, gameId } = doc.data();
          let slide: SlidesToPlay = { id: doc.id, gameId, title, type, order };

          if (type === SlideType.quiz || type === SlideType.aOrB) {
            const { options, imageUrl } = doc.data();
            slide = { ...slide, options, imageUrl };
          }
          slides[slide?.order || 0] = slide;
        });
        observer.next(slides);
      });
      return () => {
        unsubscribe();
      };
    });
  }

  public addNewSlide(gameId: string, newSlide: SlidesToCreate): void {
    const collectionInstance = collection(this.firestore, collectionNames.slides);
    addDoc(collectionInstance, newSlide).then((data) => {
      console.log('creation success');
      const docInstance = doc(this.firestore, collectionNames.games, gameId);
      updateDoc(docInstance, {
        slides: arrayUnion(data.id)
      }).then((data) => {
        console.log('Success to add slide ID to game slides array', data);
      }).catch(err => {
        console.error(err);
      });
    });
  }

  public deleteGame(game: Game): void {
    const batch = writeBatch(this.firestore);
    game.slides.forEach((slideId: string) => {
      const slideInstance = doc(this.firestore, collectionNames.slides, slideId);
      deleteDoc(slideInstance);
    });
    batch.commit()
    .then(()=> {
      const gameInstance = doc(this.firestore, collectionNames.games, game.id);
      deleteDoc(gameInstance);
    }).catch(err=> {
      console.error(err)
    });
  }

  public deleteSlide(slideId: string, gameId:string): void {
    const slideInstance = doc(this.firestore, collectionNames.slides, slideId);
    deleteDoc(slideInstance).then(() => {
      console.log('Delete slide success');
    }).catch((err) => {
      console.error(err);
    });

    const gameInstance = doc(this.firestore, collectionNames.games, gameId);
    updateDoc(gameInstance, {
      slides: arrayRemove(slideId)
    }).then((data) => {
      console.log('Success removal of slide ID to game slides array', data);
    }).catch(err => {
      console.error(err);
    });

  }

  public updateGameTitle(title: string, gameId: string): void {
    const docInstance = doc(this.firestore, collectionNames.games, gameId);
    const newTitle: Partial<Game> = { title: title };
    updateDoc(docInstance, newTitle).then((data) => {
      console.log('Success to add slide ID to game slides array', data);
    }).catch(err => {
      console.error(err);
    });
  }

  public updateSlides(slides: SlidesToPlay[]): void {

    const batch = writeBatch(this.firestore);
    slides.forEach((slide) => {
      const slideInstance = doc(this.firestore, collectionNames.slides, slide.id);
      const slideNew: Partial<SlidesToCreate> = slide.type !== SlideType.results ? { options: slide.options, title: slide.title, imageUrl: slide.imageUrl } : { title: slide.title, imageUrl: slide.imageUrl };
      setDoc(slideInstance, slideNew, { merge: true });
    });
    batch.commit();
  }
}