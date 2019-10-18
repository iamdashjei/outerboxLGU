import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { LoginPage } from '../login/login.page';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/services/alert.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  constructor(private modalController: ModalController,
    private authService: AuthService,
    private storage: NativeStorage,
    private navCtrl: NavController,
    private alertService: AlertService
  ) { }
  ngOnInit() {
  }
  // Dismiss Register Modal
  dismissRegister() {
    this.modalController.dismiss();
  }
  // On Login button tap, dismiss Register modal and open login Modal
  async loginModal() {
    this.dismissRegister();
    const loginModal = await this.modalController.create({
      component: LoginPage,
    });
    return await loginModal.present();
  }
  register(form: NgForm) {
    this.authService.register(form.value.fName, form.value.lName, form.value.uname, form.value.mnumber, form.value.cperson, form.value.cnumber, form.value.email, form.value.password).subscribe(
      data => {
        this.authService.login(form.value.email, form.value.password).subscribe(
          data => {
          },
          error => {
            console.log(error);
          },
          () => {
            this.storage.setItem("cperson", form.value.cperson);
            this.storage.setItem("cnumber", form.value.cnumber);
            this.storage.setItem("mnumber", form.value.mnumber);
            this.dismissRegister();
            this.navCtrl.navigateRoot('/home');
          }
        );
        this.alertService.presentToast(data['message']);
      },
      error => {
        console.log(error);
      },
      () => {
        
      }
    );
  }
}