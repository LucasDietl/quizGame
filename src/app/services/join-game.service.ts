import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, addDoc, collection, doc, getDoc, getDocs, query, serverTimestamp, where } from '@angular/fire/firestore';
import { collectionNames } from 'src/app/utils/helpers/collection-names';
import { Answers } from '../store/game/game.state';
import { AuthUser } from '../store/user/user.interface';
import { FireStoreOperators } from '../utils/helpers/firestore.operators';


@Injectable({
    providedIn: 'root',
})
export class JoinGameService {
    constructor(private firestore: Firestore) {
    }

    public async gameIdExists(gameId: string): Promise<boolean> {
        const docInstance = doc(this.firestore, collectionNames.games, gameId);
        const data = await getDoc(docInstance);
        const exists = data.exists();
        if (exists) {
            return exists;
        }
        throw new Error('No Id found.');
    }

    public async userAnswerExists(gameId: string, userId: string): Promise<Answers | null> {
        const answersRef = collection(this.firestore, collectionNames.answers);
        const q = query(answersRef, where('userId', FireStoreOperators.EQ, userId), where('gameId', FireStoreOperators.EQ, gameId));
        const querySnapshot = await getDocs(q);
        let userAnswer: Answers | null = null;
        querySnapshot.forEach((doc) => {
            if(doc.exists()) {
                userAnswer = { id: doc.id, ...doc.data() as Answers};
            }
        });
        return userAnswer;
    }

    public async initiateAnswers(gameId: string, user: AuthUser): Promise<void> {
        const exists = await this.userAnswerExists(gameId, user.id);
        if (exists) {
            return;
        }
        const collectionInstance = collection(this.firestore, collectionNames.answers);
        const participant: Answers = {
            totalPoints: 0,
            previousTotalPoints: 0,
            gameId,
            userId: user.id,
            slideId: '',
            nickName: user.nickName,
            joinedTimeStamp: 0,
        };
        const newParticipant = { ...participant, joinedTimeStamp: serverTimestamp() }
        await addDoc(collectionInstance, newParticipant);
        return;
    }
}