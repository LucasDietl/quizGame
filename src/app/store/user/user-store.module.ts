import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { userStateKey, userReducer, userStateConfig } from './user.reducer';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        StoreModule.forFeature(userStateKey, userReducer, userStateConfig),
        EffectsModule.forFeature([]),
    ],
    exports: [ ],
    providers: [ ]
})
export class UserModule { }