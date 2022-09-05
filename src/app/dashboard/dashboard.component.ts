import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Language } from '../language/language.service';

export class Account{
  private static _instance:Account;
  private _language:Language = Language.MARATHI;

  private constructor(){}

  get language():Language{
    return this._language;
  }

  static get instance():Account{
    if(!(Account._instance instanceof Account))
      Account._instance = new Account();

    return Account._instance;
  }
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Web])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {
  }

}
