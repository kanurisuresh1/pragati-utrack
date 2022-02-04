import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderInteractorService {

  constructor() { }
  invokeHeaderFunction = new EventEmitter();    
  invokeShowBackButton = new EventEmitter();   
  invokeShowAddButton = new EventEmitter();    
  subsVar: Subscription;
  addButtonSubs:Subscription;
  backButtonSubs:Subscription;
  updateHeaderTitle(headerName : any) { 
    setTimeout(() => {
      this.invokeHeaderFunction.emit(headerName);  
    }, 500); 
  
  } 
  

  showBackButton(val : boolean){
this.invokeShowBackButton.emit(val);
  }
  showAddButton(val : boolean){
    this.invokeShowAddButton.emit(val);
  }
}
