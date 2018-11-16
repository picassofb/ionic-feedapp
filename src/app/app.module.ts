import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import {HttpClientModule} from '@angular/common/http';


import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SingupPage } from '../pages/singup/singup';
import {FeedPage} from '../pages/feed/feed';
import {CommentsPage} from '../pages/comments/comments';

import {Camera} from '@ionic-native/camera';
import {Firebase} from '@ionic-native/firebase';

import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyCGjKgq0K_kLCu5BI_C7vDy7uvat-yrEVI",
  authDomain: "feedlyapp-b26c2.firebaseapp.com",
  databaseURL: "https://feedlyapp-b26c2.firebaseio.com",
  projectId: "feedlyapp-b26c2",
  storageBucket: "feedlyapp-b26c2.appspot.com",
  messagingSenderId: "1079982883561"
};
firebase.initializeApp(config);
firebase.firestore().settings({
  timestampsInSnapshots: true
})

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SingupPage,
    FeedPage,
    CommentsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SingupPage,
    FeedPage,
    CommentsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    Firebase,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
