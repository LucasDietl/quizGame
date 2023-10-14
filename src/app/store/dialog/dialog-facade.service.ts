import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as DialogActions from './dialog.actions'
import { AppState } from '../app.state';
import { selectIsDialogOpen, selectDialogTitle, selectDialogContent } from './dialog.selectors';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class DialogFacadeService {
  constructor(private store: Store<AppState>) {
  }

  public checkForOpenDialogs(open: boolean): void {
    this.store.dispatch(DialogActions.checkDialogsToOpen({open}));
  }

  public openDialog(title: string, content?: any): void {
    this.store.dispatch(DialogActions.openDialog({ title, content }));
  }

  public closeDialog(): void {
    this.store.dispatch(DialogActions.closeDialog());
  }

  public dialogIsOpen(): Observable<boolean> {
    return this.store.select(selectIsDialogOpen);
  }

  public title(): Observable<string> {
    return this.store.select(selectDialogTitle);
  }

  public content(): Observable<any> {
    return this.store.select(selectDialogContent);
  }
}