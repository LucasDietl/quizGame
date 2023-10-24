

import { Injectable } from '@angular/core';
import { Firestore, addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, onSnapshot, query, setDoc, updateDoc, where, writeBatch } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionNames } from 'src/app/utils/helpers/collection-names';
import { FireStoreOperators } from 'src/app/utils/helpers/firestore.operators';
import { SlideType, SlidesToCreate, SlidesToPlay } from '../store/create-game/create-game.state';


@Injectable({
  providedIn: 'root',
})
export class SlidesService {
  constructor(private firestore: Firestore) {
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
            const { options, imageUrl, points, seconds } = doc.data();
            slide = { ...slide, options, imageUrl, points, seconds};
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