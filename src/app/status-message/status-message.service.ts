import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class StatusMessageService {

  constructor(private _snackBar:MatSnackBar) { }

  error(message:string):void{
    this._operSnackBar(message, "Dismiss", "error");
  }

  warn(message:string):void{
    this._operSnackBar(message, "Got it!", "warn");
  }

  success(message:string):void{
    this._operSnackBar(message, "Ok", "success");
  }
  
  info(message:string):void{
    this._operSnackBar(message, "Ok", "info");
  }

  private _operSnackBar(message:string, action:string, panelClass:string):void{
    this._snackBar.open(message, action, {panelClass:panelClass, verticalPosition:"top", duration:5000});
  }

}
