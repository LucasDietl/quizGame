import { Injectable } from '@angular/core';
import { DocumentData, Firestore, QuerySnapshot, Timestamp, addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionNames } from 'src/app/utils/helpers/collection-names';
import { Game, GameStatus, GameTimeAndStatus, SlidesToPlay } from '../store/create-game/create-game.state';
import { Answers } from '../store/game/game.state';
import { FireStoreOperators } from '../utils/helpers/firestore.operators';



@Injectable({
    providedIn: 'root'
})
export class GameService {
    constructor(private firestore: Firestore) {
    }

    public async getGameByIdOnce(gameId: string): Promise<Game> {
        const gameInstance = doc(this.firestore, collectionNames.games, gameId);
        const gameDoc = await getDoc(gameInstance);
        // const fireStoreDateData: { seconds: number, nanoseconds: number } = gameDoc.data()?.timeStamp;
        // const timeStamp = fireStoreDateData ? this.generateTimeStamp(fireStoreDateData) : 0;
        const { title, ownerId, slides, answers } = gameDoc.data() as Game;
        const game: Game = { id: gameDoc.id, title, ownerId, slides, answers };
        return game;
    }

    // public getGameByIdCall(gameId: string): Observable<Game> {
    //     const gameInstance = doc(this.firestore, collectionNames.games, gameId);
    //     return new Observable((observer) => {
    //         const unsubscribe = onSnapshot(gameInstance, (docSnapshot) => {
    //             const fireStoreDateData: { seconds: number, nanoseconds: number } = docSnapshot.data()?.timeStamp;
    //             const timeStamp = fireStoreDateData ? this.generateTimeStamp(fireStoreDateData) : 0;
    //             const { title, ownerId, slides, status, answers, currentSlide } = docSnapshot.data() as Game;
    //             const game: Game = { id: docSnapshot.id, title, ownerId, slides, status, answers, currentSlide, timeStamp };
    //             observer.next(game);
    //         });
    //         return () => {
    //             unsubscribe();
    //         };
    //     });
    // }

    public getCurrentSlideIdAndTimeStamp(gameId: string): Observable<GameTimeAndStatus> {
        return new Observable((observer) => {
            const unsubscribe = onSnapshot(doc(this.firestore, collectionNames.status, gameId), (doc) => {
                const fireStoreDateData: { seconds: number, nanoseconds: number } = doc.data()?.timeStamp ?? { seconds: 0, nanoseconds: 0};
                const timeStamp = this.generateTimeStamp(fireStoreDateData);
                const { currentSlideId, status } = doc.data() as GameTimeAndStatus;
                const gameStatus: GameTimeAndStatus = { currentSlideId, status, timeStamp};

                observer.next(gameStatus);
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
                    const { title, ownerId, slides, status, answers } = doc.data();
                    const game = { id: doc.id, title, ownerId, slides, status, answers };
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
        const gameToCreate = { ...game,  };
        const data = await addDoc(collectionInstance, gameToCreate);
        const gameId = data.id;
        const statusToCreate = { currentSlideId: '', status: GameStatus.standBy, timeStamp: serverTimestamp() };
        const docToAdd = doc(this.firestore, collectionNames.status, gameId)
        await setDoc(docToAdd, statusToCreate);
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

    public changeGameStatusCall(gameStatus: GameStatus, gameId: string, nextSlideId: string = ''): Promise<void> {
        const docInstance = doc(this.firestore, collectionNames.status, gameId);
        const newStatus: Partial<GameTimeAndStatus> = { status: gameStatus };
        let status = { ...newStatus, timeStamp: serverTimestamp(), currentSlideId: nextSlideId };
        if (gameStatus === GameStatus.finished) {
            status.currentSlideId = '';
        }
        return updateDoc(docInstance, status);

    }

    public getNextSlideId(currentSlideId: string, slides: SlidesToPlay[]): string {
        let order = 0
        if (currentSlideId) {
            order = slides.find(slide => slide.id === currentSlideId)?.order ?? 0;
            order = order + 1;
        }
        return slides.find(slide => slide.order === order)?.id ?? '';
    }

    public setCurrentSlide(gameId: string, slideId: string): Promise<void> {
        const statusInstance = doc(this.firestore, collectionNames.status, gameId);
        const currentSlideUpdate: Partial<GameTimeAndStatus> = slideId === '' ? { currentSlideId: slideId, status: GameStatus.finished}: { currentSlideId: slideId };
        const status = { timeStamp: serverTimestamp(), ...currentSlideUpdate };
        return updateDoc(statusInstance, status);
    }

    public setUserAnswer(answerId: string, points: number, slideId: string): Promise<void> {
        const answerDocInstance = doc(this.firestore, collectionNames.answers, answerId);
        return updateDoc(answerDocInstance, { totalPoints: increment(points), previousTotalPoints: increment(points), slideId })
    }

    public async gameIdExists(gameId: string): Promise<{exists: boolean, game: Game}> {
        const gameDocInstance = doc(this.firestore, collectionNames.games, gameId);
        const game = await getDoc(gameDocInstance);
        return { exists: game.exists(), game: game.data() as Game};
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