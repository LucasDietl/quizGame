import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, tap, withLatestFrom, filter } from 'rxjs/operators';
import { DialogComponent } from 'src/app/dialog/dialog.component';
import * as DialogActions from './dialog.actions';
import { closeDialog } from './dialog.actions';
import { selectIsDialogOpen } from './dialog.selectors';

@Injectable()
export class DialogEffects {
    constructor(private actions$: Actions, private dialog: MatDialog) { }

    checkForOpenDialogs$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(DialogActions.checkDialogsToOpen),
                tap(({open}) => {
                    if(open) {
                        const { openDialogs } = this.dialog;
                        if (openDialogs.length === 0) {
                            this.dialog.open(DialogComponent);
                        }
                    }
                })
            ),
        { dispatch: false }
    );

    openDialog$ = createEffect(() =>
        this.actions$.pipe(
            ofType(DialogActions.openDialog),
            switchMap(() => {
                const dialogRef = this.dialog.open(DialogComponent);
                return dialogRef.afterClosed().pipe(
                    map(() => closeDialog())
                );
            })
        )
    );

    closeDialog$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(DialogActions.closeDialog),
                tap(() => {
                    this.dialog.closeAll();
                })
            ),
        { dispatch: false }
    );
}
