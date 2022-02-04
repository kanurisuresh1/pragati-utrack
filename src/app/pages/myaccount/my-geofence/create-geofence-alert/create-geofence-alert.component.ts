import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeLiteV1Data } from '../../../../@theme/components/Model/HomeLiteV1Response';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { NbToastrService } from '@nebular/theme';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeofenceListDetails } from '../../../../@theme/components/Model/GeofenceList';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';
import { GeofenceCustomAlertListDataEntity } from '../../../../@theme/components/Model/GeofenceCustomAlertListResponse';

@Component({
  selector: 'ngx-create-geofence-alert',
  templateUrl: './create-geofence-alert.component.html',
  styleUrls: ['./create-geofence-alert.component.scss']
})
export class CreateGeofenceAlertComponent implements OnInit {

  geofenceList: GeofenceListDetails[] = []
  vehicles: HomeLiteV1Data[] = [];
  endDate = new Date();
  deviceLinkId: string = '0';
  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  todayDate = new Date();

  isAddService: boolean = true;
  StartDateTime: Date;
  EndDateTime: Date;
  email: string;
  mobileNumber: string;
  status: string;

  selectedVehicles: string[] = [];

  items = [];
  email_ids = [];

  geofenceId: any;
  geofenceAlertData: any;
  geofenceCustomAlertId: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) geofenceAlertDetails: GeofenceCustomAlertListDataEntity,
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private dialogRef: MatDialog,
  ) {
    if (geofenceAlertDetails != null)
      this.geofenceAlertData = JSON.parse(geofenceAlertDetails.geofence_custom_alert_id);
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    if (this.geofenceAlertData != null && this.geofenceAlertData != undefined) {
      this.isAddService = false;
      this.deviceLinkId = this.geofenceAlertData.device_link_ids;
      this.geofenceId = this.geofenceAlertData.geofence_id;
      this.geofenceCustomAlertId = this.geofenceAlertData.geofence_custom_alert_id;
      this.StartDateTime = new Date(this.geofenceAlertData.from_date_time)
      this.endDate = new Date(this.geofenceAlertData.to_date_time)
      this.status = this.geofenceAlertData.status
      this.email = this.geofenceAlertData.email_ids;
      this.mobileNumber = this.geofenceAlertData.mobile_numbers;

      let split_device_link_id = this.deviceLinkId.split(/(?:,| )+/);
      this.selectedVehicles = [];
      this.selectedVehicles = split_device_link_id.slice();

      if (this.mobileNumber != undefined && this.mobileNumber != null && this.mobileNumber.length > 0) {
        let split_mobile_number = this.mobileNumber.split(/(?:,| )+/);
        split_mobile_number.forEach(mobile => {
          this.items.push({ value: mobile, display: mobile })
        })
      }

      if (this.email != undefined && this.email != null && this.email.length > 0) {
        let split_email_ids = this.email.split(/(?:,| )+/);
        split_email_ids.forEach(email => {
          this.email_ids.push({ value: email, display: email })
        })
      }
    } else {
      this.isAddService = true;
      this.status = 'Active'
      this.startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000))
      this.endDate = new Date();
    }
    this.getVehicles();
    this.getGeofenceList();
  }

  createtempfrom = new FormGroup({
    selectvehicle: new FormControl([0], [Validators.required]),
    geofenceName: new FormControl('', [Validators.required]),
    startdate: new FormControl(this.startDate, [Validators.required]),
    enddate: new FormControl(this.todayDate, [Validators.required]),
    geofencestatus: new FormControl('', [Validators.required]),
    email: new FormControl(''),
  })

  chipForm = new FormGroup({
    mobile_num: new FormControl(''),
  });

  emailChipForm = new FormGroup({
    chipEmail: new FormControl(''),
  })

  private _onDestroy = new Subject<void>();
  public bankMultiCtrl: FormControl = new FormControl();
  public bankMultiFilterCtrl: FormControl = new FormControl();
  public filteredBanksMulti: ReplaySubject<HomeLiteV1Data[]> = new ReplaySubject<HomeLiteV1Data[]>(1);

  @ViewChild('multiSelect') multiSelect: MatSelect;
  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      this.vehicles = [];
      response.data.forEach(element => {
        this.vehicles.push(element);
      })

      if (this.isAddService) {
        this.deviceLinkId = this.vehicles[0].device_link_id;
      }
      // load the initial bank list
      this.filteredBanksMulti.next(this.vehicles.slice());
      // listen for search field value changes
      this.bankMultiFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterBanksMulti();
      });
    })
  }

  protected filterBanksMulti() {
    if (!this.vehicles) {
      return;
    }
    let search = this.bankMultiFilterCtrl.value;
    if (!search) {
      this.filteredBanksMulti.next(this.vehicles.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanksMulti.next(
      this.vehicles.filter(bank => bank.vehicle_number.toLowerCase().indexOf(search) > -1)
    );
  }

  public geofenceMultiCtrl: FormControl = new FormControl();
  public geofenceMultiFilterCtrl: FormControl = new FormControl();
  public filteredGeofencMultiList: ReplaySubject<GeofenceListDetails[]> = new ReplaySubject<GeofenceListDetails[]>(1);

  getGeofenceList() {
    this.uTrackService.geofence_list().subscribe(response => {
      this.geofenceList = response.data
      this.filteredGeofencMultiList.next(this.geofenceList.slice());
      this.geofenceMultiFilterCtrl.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterGeofencListMulti();
      });
    })
  }

  protected filterGeofencListMulti() {
    if (!this.geofenceList) {
      return;
    }
    let search = this.geofenceMultiFilterCtrl.value;
    if (!search) {
      this.filteredGeofencMultiList.next(this.geofenceList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredGeofencMultiList.next(
      this.geofenceList.filter(geofence => geofence.geofence_name.toLowerCase().indexOf(search) > -1)
    );
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  validate(phone) {
    const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return regex.test(String(phone))
  }

  submit() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger('', "Please login with your credentials to proceed, This is demo account.")
    } else if (
      this.createtempfrom.value.selectvehicle != undefined && this.createtempfrom.value.selectvehicle != ""
      && this.createtempfrom.value.geofenceName != undefined && this.createtempfrom.value.geofenceName != ""
      && this.createtempfrom.value.startdate != undefined && this.createtempfrom.value.startdate != ""
      && this.createtempfrom.value.enddate != undefined && this.createtempfrom.value.enddate != ""
      && this.createtempfrom.value.geofencestatus != undefined && this.createtempfrom.value.geofencestatus != ""
    ) {
      const start_date = DateUtils.getServerDateTime(this.createtempfrom.value.startdate);
      const end_date = DateUtils.getServerDateTime(this.createtempfrom.value.enddate);

      if (start_date > end_date) {
        this.toasterService.danger('', 'Start date should be less than End date.');
      } else {

        let chip_mobile: string = '';
        let chip_email: string = '';

        for (let key of this.chipForm.value.mobile_num) {
          if (key.value.length == 10 && this.validate(key.value)) {
            chip_mobile = chip_mobile + key.value + ',';
          } else {
            // show toaster message and exit from execution of else statement
            this.toasterService.danger('', "Please check some of the mobile numbers are not valid.It must be numbers and length should be 10")
            return;
          }
        }

        if (chip_mobile.length > 0) {
          chip_mobile = chip_mobile.substring(0, chip_mobile.length - 1);
        }

        for (let key of this.emailChipForm.value.chipEmail) {
          if (this.validateEmail(key.value)) {
            chip_email = chip_email + key.value + ','
          } else {
            // show toaster message and exit from execution of else statement
            this.toasterService.danger('', "Please check some of the emails are not valid.")
            return;
          }
        }

        if (chip_email.length > 0) {
          chip_email = chip_email.substring(0, chip_email.length - 1);
        }

        if (this.isAddService) {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('device_token', "web");
          formData.append('device_link_ids', this.bankMultiCtrl.value);
          formData.append('geofence_id', this.createtempfrom.value.geofenceName);
          formData.append('from_date_time', DateUtils.getServerDateTimeHoursMins(this.createtempfrom.value.startdate));
          formData.append('to_date_time', DateUtils.getServerDateTimeHoursMins(this.createtempfrom.value.enddate));
          formData.append('status', this.createtempfrom.value.geofencestatus);
          formData.append('email_ids', chip_email);
          formData.append('mobile_numbers', chip_mobile);
          this.uTrackService.geofence_custom_alert_add(formData).subscribe(response => {
            if (response.status) {
              this.toasterService.success('', response.message)
              this.dialogRef.closeAll();
            } else {
              this.toasterService.danger('', response.message)
            }
          })
        } else {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('device_token', "web");
          formData.append('device_link_ids', this.bankMultiCtrl.value);
          formData.append('geofence_id', this.createtempfrom.value.geofenceName);
          formData.append('geofence_custom_alert_id', this.geofenceCustomAlertId);
          formData.append('from_date_time', DateUtils.getServerDateTimeHoursMins(this.createtempfrom.value.startdate));
          formData.append('to_date_time', DateUtils.getServerDateTimeHoursMins(this.createtempfrom.value.enddate));
          formData.append('status', this.createtempfrom.value.geofencestatus);
          formData.append('email_ids', chip_email);
          formData.append('mobile_numbers', chip_mobile);
          this.uTrackService.geofence_custom_alert_edit(formData).subscribe(response => {
            if (response.status) {
              this.toasterService.success('', response.message)
              this.dialogRef.closeAll();
            } else {
              this.toasterService.danger('', response.message)
            }
          })
        }
      }
    } else {
      this.toasterService.danger('', "Please Enter All Mandatory Fields");
    }
  }

}
