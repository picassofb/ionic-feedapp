import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { SingupPage } from '../singup/singup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {

  }

  gotoSingup(){
    this.navCtrl.push(SingupPage);
  }

}
