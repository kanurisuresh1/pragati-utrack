import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangeNumberComponent } from './change-number/change-number.component';
import { ChangeEmailComponent } from './change-email/change-email.component';
import { NbToastrService } from '@nebular/theme';
import { ChangeLanguageComponent } from './change-language/change-language.component';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngx-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  Dashboard_Report:string= 'Dashboard Report'
 
  constructor(private headerService: HeaderInteractorService,
    private toasterService: NbToastrService,
    private dialog: MatDialog, 
    private modalService: NgbModal,
    private translate: TranslateService,
    private uTrackService: UtrackService,
    ) {

  }

  selectedTabName = localStorage.getItem('DASHBOARD_DISPLAY_TAB');

  ngOnInit(): void {
    this.headerService.updateHeaderTitle('HEADER_NAMES.Settings');
    if (this.selectedTabName == null || this.selectedTabName == undefined || this.selectedTabName == '') {
      this.selectedTabName = 'Dashboard Report';
    }

    this.uTrackService.translateLanguage();

  }


  ChangePassword() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      let dialogReference = this.dialog.open(ChangePasswordComponent, {
        // height: '70%',
        width: '35%',
      })
      dialogReference.afterClosed().subscribe(result => {
      })
    }
  }

  ChangeNumber(OpenChangeNumModal) {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      this.modalService.open(OpenChangeNumModal);
    }
  }


  ChangeNumberOpenPopUp(){
    this.modalService.dismissAll('Closed');
    let dialogReference = this.dialog.open(ChangeNumberComponent, {
      // height: '35%',
      width: '35%',
    })
    dialogReference.afterClosed().subscribe(result => {
    })
  }


  ChangeEmail(OpenChangeEmailModal) {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      this.modalService.open(OpenChangeEmailModal);
    }
  }

  ChangeEmailOpenPopUp(){
    this.modalService.dismissAll('Closed');
    let dialogReference = this.dialog.open(ChangeEmailComponent, {
      // height: '35%',
      width: '35%',
    })
    dialogReference.afterClosed().subscribe(result => {
    })
  }

  ChangeLang() {
    let dialogReference = this.dialog.open(ChangeLanguageComponent, {
      // height: '35%',
      // width: '35%',
    })
    dialogReference.afterClosed().subscribe(result => {
    })
  }


  subProperties = [
    {
      key: 1, value: 'Dashboard Report',
    },
    {
      key: 2, value: 'List View',
    },
    {
      key: 3, value: 'Map View',
    },
    {
      key: 4, value: 'Trip Dashboard',
    },
    {
      key: 5, value: 'Products & Assets',
    },
    {
      key: 6, value: 'Live Track', 
    }, 
    {
      key: 7, value: 'Track History',
    },
    {
      key: 8, value: 'Summary Report',
    },
    {
      key: 9, value: 'Fuel Dashboard',
    },
    {
      key: 10, value: 'Temperature Dashboard',
    },
    {
      key: 11, value: 'Reports & Charts',
    },
    {
      key: 12, value: 'Fleet Management',
    }
  ];

  dashboardViewForm = new FormGroup({
    dashboardName: new FormControl()
  })

  dashBoardDropDown() {
    localStorage.setItem("DASHBOARD_DISPLAY_TAB", this.dashboardViewForm.value.dashboardName);
    this.toasterService.success('Default selected landing page is ' + this.dashboardViewForm.value.dashboardName);
    const formData = new FormData();
    formData.append('screen_name',this.dashboardViewForm.value.dashboardName);
    formData.append('user_id', localStorage.getItem("USER_ID"));
    formData.append('user_type', "Customer");
    formData.append('device_token', "Web");
    this.uTrackService.update_landing_page(formData).subscribe(response => {
    });
  }

}


