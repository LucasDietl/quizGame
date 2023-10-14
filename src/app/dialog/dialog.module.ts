import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DialogEffects } from '../store/dialog/dialog.effects';
import { dialogReducer, dialogStateConfig, dialogStateKey } from '../store/dialog/dialog.reducer';
import { DialogComponent } from './dialog.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialogTitle } from '@angular/material/dialog';

@NgModule({
    declarations: [
        DialogComponent, 
    ],
    imports: [
        CommonModule,
        StoreModule.forFeature(dialogStateKey, dialogReducer, dialogStateConfig),
        EffectsModule.forFeature([DialogEffects]),
        FontAwesomeModule,
    ],
    exports: [
        DialogComponent, 
    ],
    providers: [
        MatDialogTitle,
    ]
})
export class DialogModule { }