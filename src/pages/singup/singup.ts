import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-singup',
  templateUrl: 'singup.html',
})
export class SingupPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingupPage');
  }

  goBack(){
    this.navCtrl.pop();
  }

}
