import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the FeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-feed',
  templateUrl: 'feed.html',
})
export class FeedPage {

  text: string = "";
  posts: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.getPosts();
  }

  getPosts(){
    this.posts = [];
    
    firebase.firestore().collection("posts").get()
    .then((docs)=>{
      docs.forEach((doc)=>{
        this.posts.push(doc);
      })    

      console.log('Posts', this.posts)
    }).catch((err)=>{
      console.log('Error', err);
    })
  }

  post(){
    firebase.firestore().collection("posts").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    }).then((doc) =>{
      console.log('Doc', doc);

      this.getPosts();

    }).catch((err)=>{
      console.log('Error', err)
    })
  }

}
