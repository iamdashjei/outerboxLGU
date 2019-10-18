import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { EnvService } from './env.service';
import { User } from '../models/users';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  token:any;
  userId: any;
  constructor(
    private ionicStorage: Storage,
    private http: HttpClient,
    private storage: NativeStorage,
    private env: EnvService,
  ) { }
  login(email: String, password: String) {
    return this.http.post(this.env.API_URL + 'auth/login',
      {email: email, password: password}
    ).pipe(
      tap(token => {
        this.storage.setItem('token', token)
        .then(
          () => {
            console.log('Token Stored');
          },
          error => console.error('Error storing item', error)
        );
        this.token = token;
        this.isLoggedIn = true;
        return token;
      }),
    );
  }
  register(fName: String, lName: String, uname: String, mnumber: String, cperson: String, cnumber: String, email: String, password: String) {
    return this.http.post(this.env.API_URL + 'auth/register',
      {fName: fName, lName: lName, uname: uname, mnumber: mnumber, cperson: cperson, cnumber: cnumber, email: email, password: password}
    )
  }
  logout() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get(this.env.API_URL + 'auth/logout', { headers: headers })
    .pipe(
      tap(data => {
        this.storage.remove("token");
        this.isLoggedIn = false;
        delete this.token;
        return data;
      })
    )
  }
  user() {
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });
    return this.http.get<User>(this.env.API_URL + 'auth/user', { headers: headers })
    .pipe(
      tap(user => {
        this.ionicStorage.set("userFname", user["firstname"]);
        this.ionicStorage.set("userLname", user["lastname"]);
        this.ionicStorage.set("userId", user.id);
        this.storage.setItem('userFname', user["firstname"]);
        this.storage.setItem('userLname', user["lastname"]);
        this.storage.setItem("cperson", user.cperson);
        this.storage.setItem("cnumber", user.cnumber);
        this.storage.setItem("mnumber", user.mnumber);
        this.storage.setItem('userId', user.id).then(
          () => {
            this.userId = user.id;
            console.log('User Stored');
          },
          error => console.error('Error storing item', error)
        );
        return user;
      })
    )
  }

  getToken() {
    return this.storage.getItem('token').then(
      data => {
        this.token = data;
        if(this.token != null) {
          this.isLoggedIn=true;
        } else {
          this.isLoggedIn=false;
        }
      },
      error => {
        this.token = null;
        this.isLoggedIn=false;
      }
    );
  }

  // test(getUserId: number){
  //   const headers = new HttpHeaders({
  //     'Authorization': this.token["token_type"]+" "+this.token["access_token"]
  //   });
  //   return this.http.post(this.env.API_URL + 'auth/request', {app_user_id: getUserId, app_response: 'request'}, {headers : headers})
  // }

  requestSend(getUserId: number, userRequest: any){
    const headers = new HttpHeaders({
      'Authorization': this.token["token_type"]+" "+this.token["access_token"]
    });

    return this.http.post(this.env.API_URL + 'auth/request', {app_user_id: getUserId, app_response:  userRequest}, {headers : headers})
  }

}
