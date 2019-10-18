import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'https://crm.devouterbox.com/api/';
  
  constructor() { }
}