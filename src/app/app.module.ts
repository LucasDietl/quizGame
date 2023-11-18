import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DialogModule } from './dialog/dialog.module';
import { RegisterModule } from './register/register.module';
import { rootReducers } from './store/reducers';
import { UserModule } from './store/user/user-store.module';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';

@NgModule({
  declarations: [
    AppComponent,
    NoPageFoundComponent,
    ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    StoreModule.forRoot(rootReducers, 
      {
      runtimeChecks: {
        strictActionImmutability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictStateImmutability: true,
        strictActionTypeUniqueness: true,
        strictStateSerializability: true,
      }
    }),
    EffectsModule.forRoot([]), // Register your effects here
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Specify a limit for the number of actions to store
      logOnly: environment.production, // Set to true for production
    }),
    RegisterModule,
    MatDialogModule,
    DialogModule,
    UserModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
