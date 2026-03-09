import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Router } from '@angular/router'
 
@Injectable({
  providedIn: 'root'
})

export class EventService {

  constructor(private readonly _http: HttpClient, private readonly _router: Router) { }
 

 

}
