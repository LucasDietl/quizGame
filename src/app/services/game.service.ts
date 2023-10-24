import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, onSnapshot, query, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { collectionNames } from 'src/app/utils/helpers/collection-names';
import { Game, GameStatus, SlidesToPlay } from '../store/create-game/create-game.state';
import { Observable } from 'rxjs';
import { FireStoreOperators } from '../utils/helpers/firestore.operators';



@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private firestore: Firestore) {
  }

  public getGameByIdCall(gameId: string): Observable<Game> {
    const gameInstance = doc(this.firestore, collectionNames.games, gameId);
    return new Observable((observer) => {
        const unsubscribe = onSnapshot(gameInstance, (docSnapshot) => {
          const game: Game = {id: docSnapshot.id ,...docSnapshot.data()} as Game;
          observer.next(game);
        });
        return () => {
          unsubscribe();
        };
      });
  }


  public getOwnedGamesCall(ownerId: string): Observable<Game[]> {
    const collectionInstance = collection(this.firestore, collectionNames.games);
    const q = query(collectionInstance, where('ownerId', FireStoreOperators.EQ, ownerId));

    return new Observable((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const games: Game[] = [];
        querySnapshot.forEach((doc) => {
          const { title, ownerId, slides, status, answers, currentSlide } = doc.data();
          const game = { id: doc.id, title, ownerId, slides, status, answers, currentSlide };
          games.push(game);
        });
        observer.next(games);
      });
      return () => {
        unsubscribe();
      };
    });
  }


  public async createGame(game: Partial<Game>): Promise<string> {
    const collectionInstance = collection(this.firestore, collectionNames.games);
    const data = await addDoc(collectionInstance, game);
    console.log('Game creation success', data?.id);
    return data.id;
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

  public updateGameTitle(title: string, gameId: string): void {
    const docInstance = doc(this.firestore, collectionNames.games, gameId);
    const newTitle: Partial<Game> = { title: title };
    updateDoc(docInstance, newTitle).then((data) => {
      console.log('Success to add slide ID to game slides array', data);
    }).catch(err => {
      console.error(err);
    });
  }
  
  public changeGameStatusCall(gameStatus: GameStatus, gameId: string): Promise<void> {
    const docInstance = doc(this.firestore, collectionNames.games, gameId);
    const newStatus: Partial<Game> = { status: gameStatus };

    return updateDoc(docInstance, newStatus);
  }

  public getNextSlideId(game: Game, slides: SlidesToPlay[]): string {
    const {currentSlide} = game; 
    let order = 0
    if(currentSlide) {
      order = slides.find(slide => slide.id === currentSlide)?.order ?? 0;
      order = order + 1;
    }
    return slides.find(slide => slide.order === order)?.id ?? '';
  }

  public setCurrentSlide(gameId: string, slideId: string): Promise<void> {
    const docInstance = doc(this.firestore, collectionNames.games, gameId);
    const currentSlideUpdate: Partial<Game> = { currentSlide: slideId };
    return updateDoc(docInstance, currentSlideUpdate);
  }

  public setAnswer(): void{
    const answerCollectionInstance = collection(this.firestore, collectionNames.answers);
  }

  
}