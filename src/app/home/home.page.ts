import { Component, OnInit } from '@angular/core';
import { PusherService } from '../pusher.service';
import { NativeGeocoderOptions, NativeGeocoderResult, NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { MenuController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  requests = [];
  url: string = 'https://74cb843d.ngrok.io/requests'; 

  geoLatitude: any;
  geoLongitude: any;

  isWatching:boolean;
  watchLocationUpdates:any; 
  geoAddress: string;
  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  
  constructor(private pusher: PusherService,
    private geolocation: Geolocation,
    private menu: MenuController,
    private nativeGeocoder: NativeGeocoder) {

      this.menu.enable(true);
  }

  ngOnInit(){
    //this.watchLocation();
    
    const channel = this.pusher.init();
    channel.bind('message', (data) => {
      this.requests.push(data);

    });

  }

  ngAfterViewInit(){
    // this.geolocation.getCurrentPosition().then((resp) => {
    //   // resp.coords.latitude
    //   // resp.coords.longitude
    //   console.log(resp.coords.latitude + "," + resp.coords.longitude);
    //  }).catch((error) => {
    //    console.log('Error getting location', error);
    //  });

    //  let watch = this.geolocation.watchPosition();
    //   watch.subscribe((data) => {
    //     // data can be a set of coordinates, or an error (if an error occurred).
    //     // data.coords.latitude
    //     // data.coords.longitude
    //     console.log("Data Latitude: " + data.coords.latitude);
    //     console.log("Data Longitude: " + data.coords.longitude);
    //  });

  }

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude,longitude){
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.geoAddress = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location'+ JSON.stringify(error));
      });
  }

    //Return Comma saperated address
    generateAddress(addressObj){
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        if(obj[val].length)
         address += obj[val]+', ';
      }
        return address.slice(0, -2);
     }

    //Start location update watch
    watchLocation(){
      this.isWatching = true;
      this.watchLocationUpdates = this.geolocation.watchPosition();
      this.watchLocationUpdates.subscribe((resp) => {
        this.geoLatitude = resp.coords.latitude;
        this.geoLongitude = resp.coords.longitude; 
        console.log(this.geoLatitude+ "," + this.geoLongitude);
        this.getGeoencoder(this.geoLatitude,this.geoLongitude);
      });
    }
}
