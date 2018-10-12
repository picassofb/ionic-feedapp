import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import firebase from 'firebase';



@Component({
  selector: 'page-singup',
  templateUrl: 'singup.html',
})
export class SingupPage {

  name: string = "";
  email: string = "";
  password: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public altCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingupPage');
  }

  singUp(){
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
    .then((data) => {

      console.log('Usuario:', data)

      let newUser: firebase.User = data.user;
      newUser.updateProfile({
        displayName: this.name,
        photoURL: ""
      }).then(() =>{
        console.log('Actualización completa!')

        this.altCtrl.create({
          title: "Cuenta creada",
          message: "Su cuenta ha sido creada.",
          buttons: [{
              text: "OK",
              handler: () => {
                //Ir hacia la ventana principal
              }
            }
          ]
        }).present();
       

      })


    }).catch((err) => {
      console.log('Error', err)
      
      this.toastCtrl.create({
        message: err.message,
        duration: 3000
      }).present();
    })
  }

  goBack(){
    this.navCtrl.pop();
  }

}
