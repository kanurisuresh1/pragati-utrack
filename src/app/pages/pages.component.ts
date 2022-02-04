import { Component } from '@angular/core';

import { BN_MENU_ITEMS, GU_MENU_ITEMS, HI_MENU_ITEMS, KN_MENU_ITEMS, MENU_ITEMS, ML_MENU_ITEMS, MR_MENU_ITEMS, OR_MENU_ITEMS, TA_MENU_ITEMS, TE_MENU_ITEMS } from './pages-menu';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../@core/mock/users.service';
import { Router } from '@angular/router';
import { Spinkit } from 'ng-http-loader';
import { UtrackService } from '../@theme/components/Services/Utrack.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
    <!--  <ng-http-loader [backdrop]="false"
[backgroundColor]="'black'"
[debounceDelay]="100"
[extraDuration]="300"
[minDuration]="300"
[opacity]=".6"
[spinner]="spinnerStyle.skWave "></ng-http-loader>

spinner Styles : 
Different style are skChasingDots, skCubeGrid, skDoubleBounce, skRotatingPlane, skSpinnerPulse, skThreeBounce, skWanderingCubes and skWave -->

  `,
})
export class PagesComponent {

  menu = MENU_ITEMS;
  spinnerStyle = Spinkit;

  user: any;
  userMenu = [{ title: 'My Profile' }, { title: 'Logout' }];

  constructor(private menuService: NbMenuService,
    private userService: UserService,
    private uTrackService: UtrackService,
    private routes: Router,
    private translate: TranslateService,) {
  }

  ngOnInit() {
    this.uTrackService.isUserValid();
    let language_code = localStorage.getItem('LANGUAGE');
    if (language_code === null || language_code === undefined || language_code === '') {
      language_code = 'en';
    }
    this.langChange(language_code);
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.langChange(event.lang);
    })
    this.userService.getUsers()
      .subscribe((users: any) => this.user = users.nick);
    this.menuService.onItemClick().subscribe((event) => {
      this.onItemSelection(event.item.title);
    })
  }

  langChange(lang) {
    switch (lang) {
      case 'te': this.menu = TE_MENU_ITEMS;
        break;
      case 'bn': this.menu = BN_MENU_ITEMS;
        break;
      case 'gu': this.menu = GU_MENU_ITEMS;
        break;
      case 'hi': this.menu = HI_MENU_ITEMS;
        break;
      case 'kn': this.menu = KN_MENU_ITEMS;
        break;
      case 'ml': this.menu = ML_MENU_ITEMS;
        break;
      case 'mr': this.menu = MR_MENU_ITEMS;
        break;
      case 'or': this.menu = OR_MENU_ITEMS;
        break;
      case 'ta': this.menu = TA_MENU_ITEMS;
        break;
      case 'en': this.menu = MENU_ITEMS;
        break;
      default: this.menu = MENU_ITEMS;
    }
  }

  onItemSelection(title) {
    if (title === 'Logout') {
      localStorage.setItem("USER_ID", "");
      localStorage.setItem("FIRST_NAME", "");
      localStorage.setItem("LAST_NAME", "");
      localStorage.setItem("MOBILE_CODE", "");
      localStorage.setItem("MOBILE", "");
      localStorage.setItem("PROFILE_IMAGE", "");
      localStorage.setItem("COMPNAY_LOGO", "");
      localStorage.setItem("COMPANY_NAME", "");
      localStorage.setItem("REFERRAL_CODE", "");
      localStorage.setItem("REGISTERED_ID", "");
      localStorage.setItem("USER_TYPE", "");
      localStorage.removeItem("DASHBOARD_DISPLAY_TAB");
      localStorage.removeItem("LANGUAGE");
      localStorage.removeItem("EMAIL")


      // Do something on Log out
      this.routes.navigate(["login"]);
    } else if (title === 'My Profile') {
      // Do something on Profile
      this.routes.navigate(["web/myaccount/myprofile"]);
    } else if (title === 'Settings') {
      // Do something on Profile
      this.routes.navigate(["web/others/settings"]);
    }
    else if (title === 'Help') {
      // Do something on Profile
      this.routes.navigate(["web/others/help"]);
    }

  }


}

