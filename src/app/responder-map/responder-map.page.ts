import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Subscription } from 'rxjs';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
declare var google;
@Component({
  selector: 'app-responder-map',
  templateUrl: './responder-map.page.html',
  styleUrls: ['./responder-map.page.scss'],
})
export class ResponderMapPage implements OnInit {
 
  @ViewChild('map') mapElement: ElementRef;
  
  map: any;
  currentMapTrack = null;

  isTracking = false;
  trackedRoute = [];
  previousRoutes = [];
  previousTracks = [];

  isWatching:boolean;
  watchLocationUpdates:any; 
  geoAddress: string;
  //Geocoder configuration
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  geoLatitude: any;
  geoLongitude: any;

  postionSubscription: Subscription;

  constructor(public navCtrl: NavController,
    private plt: Platform,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private storage: Storage,
    private alertCtrl: AlertController) {
  
  }

  ngOnInit() {
    console.log("On init");
    this.watchLocation();
    this.loadMap();
    // this.plt.ready().then(() => {
    //   this.loadHistoricRoutes();

    //   let mapOptions = {
    //     zoom: 13,
    //     mapTypeId: google.maps.MapTypeId.ROADMAP,
    //     mapTypeControl: false,
    //     streetViewControl: false,
    //     fullscreenControl: false

    //   };

    //   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //   this.geolocation.getCurrentPosition().then(pos => {
    //     let latLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
    //     this.map.setCenter(latLng);
    //     this.map.setZoom(15);
    //   })
    // });
  }

  
  loadHistoricRoutes(){
    // this.storage.get('routes').then(data => {
    //   if(data){
    //     this.previousTracks = data;
    //   }
    // });
  }

  loadMap(){

    let latLng = new google.maps.LatLng(15.180139, 120.586123);

    let mapOptions = {
      center: latLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      fullscreenControl: false
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    
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

    addMarker(){

      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: this.map.getCenter()
      });
    
      let content = "<h4>Information!</h4>";          
    
      this.addInfoWindow(marker, content);
    
    }

    addInfoWindow(marker, content){

      let infoWindow = new google.maps.InfoWindow({
        content: content
      });
  
      google.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(this.map, marker);
      });
  
    }
}
