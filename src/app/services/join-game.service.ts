import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, addDoc, collection, doc, getDoc, serverTimestamp } from '@angular/fire/firestore';
import { collectionNames } from 'src/app/utils/helpers/collection-names';
import { Answers } from '../store/game/game.state';
import { AuthUser } from '../store/user/user.interface';


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

    public initiateAnswers(gameId: string, user: AuthUser): Promise<DocumentReference<DocumentData>> {
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
        const newParticipant = { ...participant, joinedTimeStamp: serverTimestamp()}
        return addDoc(collectionInstance, newParticipant); 
    }
}