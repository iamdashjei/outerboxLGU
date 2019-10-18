import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

declare const Pusher: any;
@Injectable({
  providedIn: 'root'
})
export class ResponderService {
  channel_responder: any;
  constructor(public http: HttpClient) {
   
    var pusher = new Pusher("d280273f5b9950d7af2b", { 
      cluster: 'ap1',
      encrypted: true,
      forceTLS: true
      });
      this.channel_responder = pusher.subscribe('responder');
  }

  public init(){
    return this.channel_responder;
   }
}
