import { Injectable } from '@angular/core';
import { DocumentData, DocumentReference, Firestore, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, onSnapshot, query, setDoc, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionNames } from 'src/app/utils/helpers/collection-names';
import { FireStoreOperators } from 'src/app/utils/helpers/firestore.operators';
import { SlideType, SlidesToCreate, SlidesToPlay } from '../store/create-game/create-game.state';
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
        debugger
        if (exists) {
            return exists;
        }
        throw new Error('No Id found.');
    }

    public initiateAnswers(gameId: string, userId: AuthUser['id']): Promise<DocumentReference<DocumentData>> {
        const collectionInstance = collection(this.firestore, collectionNames.answers);
        const participant = {
            totalPoints: 0,
            previousTotalPoints: 0,
            gameId,
            userId
        }
        return addDoc(collectionInstance, participant); 
    }
}