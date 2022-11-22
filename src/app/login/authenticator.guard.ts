import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatorGuard implements CanActivate {
  private _isAuthorized:boolean  = false;

  constructor(
    private _authenticationService:AuthenticationService,
    private _router:Router
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      this._isAuthorized = this._authenticationService.isAuthorized();

      if(!this._isAuthorized)
        this._router.navigate([""]);

    return this._isAuthorized;
  }
  
}
