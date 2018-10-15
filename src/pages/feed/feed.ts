import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import moment, { duration } from 'moment';
import { LoginPage } from '../login/login';
import {Camera, CameraOptions, EncodingType} from '@ionic-native/camera';

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
  pageSize: number = 10;
  cursor: any;
  infiniteEvent: any;
  image: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    private loadingCtrl: LoadingController, private toastCtrl: ToastController,
    private camera: Camera) {
    this.getPosts();
  }

  getPosts(){
    this.posts = [];
    let loading = this.loadingCtrl.create({
      content: "Cargando Noticias.."
    });

    loading.present();

    let query = firebase.firestore().collection("posts").orderBy("created","desc")
    .limit(this.pageSize);
    
/*    query.onSnapshot((snapshot)=>{
      let changeDocs = snapshot.docChanges();
      
      changeDocs.forEach((change)=>{

            if(change.type == "added"){
              //TODO 
            }

            if(change.type == "modified"){
              
            }

            if(change.type == "removed"){
              
            }

        });
        
      });
  */
      query.get().then((docs)=>{
        docs.forEach((doc)=>{
          this.posts.push(doc);
      })    

      loading.dismiss();

      this.cursor = this.posts[this.posts.length-1];

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
    }).then(async (doc) =>{
      console.log('Doc', doc);

      if(this.image){
        await this.upload(doc.id);
      }

      this.text = "";
      this.image = undefined;
      
      let toast =  this.toastCtrl.create({
        message: "Su mensaje fue publicado correctamente!",
        duration: 3000
      });

      this.getPosts();

    }).catch((err)=>{
      console.log('Error', err)
    })
  }

  ago(time){
    let difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  loadMorePosts(event){
   
    firebase.firestore().collection("posts").orderBy("created","desc").startAfter(this.cursor)
    .limit(this.pageSize).get().then((docs)=>{
      docs.forEach((doc)=>{
        this.posts.push(doc);
      })    

      console.log('Posts', this.posts)

      if(docs.size < this.pageSize){
        //all documents have been loaded
        event.enable(false);
        this.infiniteEvent = event;
      }
      else{
        event.complete();
        this.cursor = this.posts[this.posts.length-1];
      }

    }).catch((err)=>{
      console.log('Error', err);
    })
  }

  refresh(event){
    this.posts = [];
    this.getPosts();
    if(this.infiniteEvent){
      this.infiniteEvent.enable(true);
    }

    event.complete();

  }

  logOut(){
    firebase.auth().signOut().then(()=>{
      let toast = this.toastCtrl.create({
        message: "Su sesión ha sido cerrada",
        duration:3000
      });

      this.navCtrl.setRoot(LoginPage);

    });
  }

  addPhoto(){
    this.launchCamera();
  }

  launchCamera(){
    let options: CameraOptions = {
      quality:100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
      allowEdit: true
    }

    this.camera.getPicture(options).then((base64Image)=>{
      console.log(base64Image);

      this.image = "data:image/png;base64," + base64Image;

    }).catch((err)=>{
      console.log(err);
    })
  }

  upload(name: string){

    return new Promise((resolve, reject)=>{

      let ref = firebase.storage().ref("postImages/" + name);

      let uploadTask = ref.putString(this.image.split(',')[1],"base64");
  
      uploadTask.on("state_changed", (taskSnapshot)=>{
          console.log(taskSnapshot);
      }, (error)=>{
          console.log(error);
      }, ()=>{
          console.log("The upload is complete!");
          uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
              console.log(url);
  
              firebase.firestore().collection("posts").doc(name).update({
                image: url
              }).then(()=>{
                resolve();
              }).catch((err)=>{
                 reject(); 
              })
              
          }).catch((err)=>{
             reject(); 
          })
      })

    })
   
  }

}
