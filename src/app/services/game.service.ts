import { Injectable } from '@angular/core';
import { DocumentData, DocumentSnapshot, FieldValue, Firestore, QuerySnapshot, Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { collectionNames } from 'src/app/utils/helpers/collection-names';
import { Game, GameStatus, SlidesToPlay } from '../store/create-game/create-game.state';
import { Observable } from 'rxjs';
import { FireStoreOperators } from '../utils/helpers/firestore.operators';
import { Answers } from '../store/game/game.state';
import { User } from '../store/user/user.interface';



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
                const fireStoreDateData: { seconds: number, nanoseconds: number } = docSnapshot.data()?.timeStamp;
                const timeStamp = fireStoreDateData ? this.generateTimeStamp(fireStoreDateData) : 0;
                const { title, ownerId, slides, status, answers, currentSlide } = docSnapshot.data() as Game;
                const game: Game = { id: docSnapshot.id, title, ownerId, slides, status, answers, currentSlide, timeStamp };
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
                    const fireStoreDateData: { seconds: number, nanoseconds: number } = doc.data()?.timeStamp;
                    const timeStamp = this.generateTimeStamp(fireStoreDateData);
                    const { title, ownerId, slides, status, answers, currentSlide } = doc.data();
                    const game = { id: doc.id, title, ownerId, slides, status, answers, currentSlide, timeStamp };
                    games.push(game);
                });
                observer.next(games);
            });
            return () => {
                unsubscribe();
            };
        });
    }

    private generateTimeStamp(data: { seconds: number, nanoseconds: number }): any {
        return new Timestamp(data.seconds, data.nanoseconds).toMillis();
    }

    public async createGame(game: Partial<Game>): Promise<string> {
        const collectionInstance = collection(this.firestore, collectionNames.games);
        const gameToCreate = { ...game, timestamp: serverTimestamp() }
        const data = await addDoc(collectionInstance, gameToCreate);
        return data.id;
    }


    public deleteGame(game: Game): void {
        const batch = writeBatch(this.firestore);
        game.slides.forEach((slideId: string) => {
            const slideInstance = doc(this.firestore, collectionNames.slides, slideId);
            deleteDoc(slideInstance);
        });
        batch.commit()
            .then(() => {
                const gameInstance = doc(this.firestore, collectionNames.games, game.id);
                deleteDoc(gameInstance);
            }).catch(err => {
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
        const game = { ...newStatus, timeStamp: serverTimestamp() };
        if (gameStatus === GameStatus.finished) {
            game.currentSlide = '';
        }
        return updateDoc(docInstance, game);
    }

    public getNextSlideId(game: Game, slides: SlidesToPlay[]): string {
        const { currentSlide } = game;
        let order = 0
        if (currentSlide) {
            order = slides.find(slide => slide.id === currentSlide)?.order ?? 0;
            order = order + 1;
        }
        return slides.find(slide => slide.order === order)?.id ?? '';
    }

    public setCurrentSlide(gameId: string, slideId: string): Promise<void> {
        const docInstance = doc(this.firestore, collectionNames.games, gameId);
        const currentSlideUpdate: Partial<Game> = slideId === '' ? { currentSlide: slideId, status: GameStatus.finished}: { currentSlide: slideId };
        const game = { ...currentSlideUpdate, timeStamp: serverTimestamp() }
        return updateDoc(docInstance, game);
    }

    public setUserAnswer(answerId: string, points: number, slideId: string): Promise<void> {
        const answerDocInstance = doc(this.firestore, collectionNames.answers, answerId);
        return updateDoc(answerDocInstance, { totalPoints: increment(points), previousTotalPoints: increment(points), slideId })
    }

    public async gameIdExists(gameId: string): Promise<boolean> {
        const gameDocInstance = doc(this.firestore, collectionNames.games, gameId);
        const game = await getDoc(gameDocInstance);
        return game.exists();
    }

    public async userAnswerCheck(gameId: string, userId: string): Promise<Answers[]> {
        const answersInstance = collection(this.firestore, collectionNames.answers);
        const q = query(answersInstance, where('gameId', FireStoreOperators.EQ, gameId), where('userId', FireStoreOperators.EQ, userId));
        const querySnapShot = await getDocs(q);
        const isRegister: Answers[] = [];
        querySnapShot.forEach((doc) => {
            isRegister.push(doc.data() as Answers);
        })
        return isRegister;
    }

    public getAllUserAnswersByGameIdCall(gameId: string): Observable<Answers[]> {
        const answersInstance = collection(this.firestore, collectionNames.answers);
        // orderBy("totalPoints", "desc")
        const q = query(answersInstance, where('gameId', FireStoreOperators.EQ, gameId));
        return new Observable((observer) => {
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const answers = this.handleAnswerQuerySnapshot(querySnapshot);
                observer.next(answers);
            });
            return () => {
                unsubscribe();
            };
        });
    }

    private handleAnswerQuerySnapshot(querySnapshot: QuerySnapshot<DocumentData>): Answers[] {
    const answers: Answers[] = [];
    querySnapshot.forEach((doc) => {
        const fireStoreDateData: { seconds: number, nanoseconds: number } = doc.data()?.joinedTimeStamp;
        const joinedTimeStamp = this.generateTimeStamp(fireStoreDateData);
        const { totalPoints, previousTotalPoints, gameId, userId, slideId, nickName } = doc.data();
        const answer = { id: doc.id, totalPoints, previousTotalPoints, gameId, userId, slideId, nickName, joinedTimeStamp };
        answers.push(answer);
    });
    return answers;
}

}