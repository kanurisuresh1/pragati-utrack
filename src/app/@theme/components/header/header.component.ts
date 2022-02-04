import { Component, OnDestroy, OnInit, ElementRef, ViewChild } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbAuthService } from '@nebular/auth';
import { Router } from '@angular/router';
import { HeaderInteractorService } from '../Services/header-interactor.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    // {
    //   value: 'cosmic',
    //   name: 'Cosmic',
    // },
    // {
    //   value: 'corporate',
    //   name: 'Corporate',
    // },
  ];

  langs = [
    {
      value: 'en',
      name: 'English',
    },
    {
      value: 'bn',
      name: 'Bengali',
    },
    {
      value: 'gu',
      name: 'Gujarat',
    },
    {
      value: 'hi',
      name: 'Hindi',
    },
    {
      value: 'kn',
      name: 'Kannada',
    },
    {
      value: 'ml',
      name: 'Malayalam',
    },
    {
      value: 'mr',
      name: 'Marathi',
    },
    {
      value: 'or',
      name: 'odisha',
    },
    {
      value: 'ta',
      name: 'Tamil',
    },
    {
      value: 'te',
      name: 'Telugu',
    },
  ];

  currentTheme = 'default';

  headerName: String;
  userName = localStorage.getItem("FIRST_NAME") + ' ' + localStorage.getItem("LAST_NAME")
  userPicture = localStorage.getItem("PROFILE_IMAGE")

  userMenu = [{ title: 'My Profile', link: '', icon: 'person' }, { title: 'Settings', icon: 'settings-2' }, { title: 'Help', icon: 'question-mark-circle' }, { title: 'Logout', icon: 'log-out' }];
  language_code: string;



  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private authService: NbAuthService,
    private userService: UserData,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private routes: Router,
    private headerService: HeaderInteractorService,
    private translate: TranslateService
  ) {
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {

    this.language_code = localStorage.getItem('LANGUAGE');
    if (this.language_code === null ||this.language_code === '' || this.language_code === undefined) {
      this.language_code = 'en';
    }

    this.translate.addLangs(['en','bn','gu','hi','kn','ml','mr','or','ta','te']);
    this.translate.setDefaultLang(this.language_code);

      this.headerService.subsVar = this.headerService.invokeHeaderFunction.subscribe((name: string) => {
        this.headerName = name;
      });
    

    this.currentTheme = this.themeService.currentTheme;

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.jack);


    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }



  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  changeSelectedLanguale(languageCode:string){
    localStorage.setItem('LANGUAGE',languageCode);
    this.translate.use(languageCode);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }
  navigateToNotifications() {
    this.routes.navigate(["web/alert_notifications"])
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
