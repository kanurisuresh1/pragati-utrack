import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TempAlertListResponseData } from '../../../../@theme/components/Model/TempAlertListResponse';
import { HomeLiteV1Data } from '../../../../@theme/components/Model/HomeLiteV1Response';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';
// drop down search
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-add-temperature-alerts',
  templateUrl: './add-temperature-alerts.component.html',
  styleUrls: ['./add-temperature-alerts.component.scss']
})
export class AddTemperatureAlertsComponent implements OnInit {

  vehicles: HomeLiteV1Data[] = [];
  
  deviceLinkId: string = '0';

  StartDateTime: Date;
  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  todayDate: Date = new Date();
  endDate = new Date();

  tempAlertData: any;
  isAddService: boolean = true;

  tripName: string;
  driveName: string;
  driveNumber: string;
  email: string;
  mobileNumber: string;
  minTemp: string;
  maxTemp: string;
  status: string = 'Active';
  tempAlertId: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) tempAlertDetails: TempAlertListResponseData,
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private dialogRef: MatDialog,
    private translate: TranslateService
  ) {
    if (tempAlertDetails != null)
      this.tempAlertData = JSON.parse(tempAlertDetails.device_link_id);
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    if (this.tempAlertData != null && this.tempAlertData != undefined) {
      this.isAddService = false;
      this.deviceLinkId = this.tempAlertData.device_link_id;
      this.StartDateTime = new Date(this.tempAlertData.start_date_time)
      this.endDate = new Date(this.tempAlertData.end_date_time)
      this.minTemp = this.tempAlertData.min_temp
      this.maxTemp = this.tempAlertData.max_temp
      this.status = this.tempAlertData.status
      this.tempAlertId = this.tempAlertData.temp_alert_id
      this.tripName = this.tempAlertData.trip_name;
      this.driveName = this.tempAlertData.driver_name;
      this.driveNumber = this.tempAlertData.driver_number;
      this.email = this.tempAlertData.email;
      this.mobileNumber = this.tempAlertData.mobile_number;

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
      this.minTemp = ""
      this.maxTemp = ""
      this.status = 'Active'
      this.StartDateTime = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000))
      this.endDate = new Date();
      this.tripName = "";
      this.driveName = "";
      this.driveNumber = "";
    }
    this.getVehicles();
  }

  selectedVehicles: string[] = [];
  items = [];
  email_ids = [];

  public bankMultiCtrl: FormControl = new FormControl();
  public bankMultiFilterCtrl: FormControl = new FormControl();
  public filteredBanksMulti: ReplaySubject<HomeLiteV1Data[]> = new ReplaySubject<HomeLiteV1Data[]>(1);
  @ViewChild('multiSelect') multiSelect: MatSelect;

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

  createtempfrom = new FormGroup({
    selectvehicle: new FormControl([0], [Validators.required]),
    startdate: new FormControl(this.startDate, [Validators.required]),
    enddate: new FormControl(this.todayDate, [Validators.required]),
    minitemp: new FormControl('', [Validators.required]),
    maxtemp: new FormControl('', [Validators.required]),
    tempstatus: new FormControl('', [Validators.required]),
    tripName: new FormControl(''),
    driverName: new FormControl(''),
    driverNumber: new FormControl(''),
    email: new FormControl(''),
  })

  chipForm = new FormGroup({
    mobile_num: new FormControl(''),
  });

  emailChipForm = new FormGroup({
    chipEmail: new FormControl(''),
  })

  private _onDestroy = new Subject<void>();

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      this.vehicles = [];
      response.data.forEach(element => {
        if (element.product_type == "Temperature" || element.product_type == "FuelTemp") {
          this.vehicles.push(element);
        }
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
      && this.createtempfrom.value.minitemp != undefined && this.createtempfrom.value.minitemp != ""
      && this.createtempfrom.value.maxtemp != undefined && this.createtempfrom.value.maxtemp != ""
      && this.createtempfrom.value.startdate != undefined && this.createtempfrom.value.startdate != ""
      && this.createtempfrom.value.enddate != undefined && this.createtempfrom.value.enddate != ""
      && this.createtempfrom.value.tempstatus != undefined && this.createtempfrom.value.tempstatus != ""
    ) {
      const start_date = DateUtils.getServerDateTime(this.createtempfrom.value.startdate);
      const end_date = DateUtils.getServerDateTime(this.createtempfrom.value.enddate);
      const minTemperature = this.createtempfrom.value.miniTemp
      const maxTemperature = this.createtempfrom.value.maxtemp

      if (start_date > end_date) {
        this.toasterService.danger('', 'Start date should be less than End date.');
      } else if (minTemperature >= maxTemperature) {
        this.toasterService.danger('', "Max Temperature should be grater that Min Temperature.")
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

        let str_driver_name = this.createtempfrom.value.driverName;
        if (str_driver_name == undefined || str_driver_name == null) {
          str_driver_name = '';
        }

        let str_trip_name = this.createtempfrom.value.tripName;
        if (str_trip_name == undefined || str_trip_name == null) {
          str_trip_name = '';
        }

        let str_driver_number = this.createtempfrom.value.driverNumber;
        if (str_driver_number == undefined || str_driver_number == null) {
          str_driver_number = '';
        }

        if (this.isAddService) {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('device_token', "web");
          formData.append('device_link_id', this.bankMultiCtrl.value);
          formData.append('min_temp', this.createtempfrom.value.minitemp);
          formData.append('max_temp', this.createtempfrom.value.maxtemp);
          formData.append('start_date_time', DateUtils.getServerDateTimeHoursMins(this.createtempfrom.value.startdate));
          formData.append('end_date_time', DateUtils.getServerDateTimeHoursMins(this.createtempfrom.value.enddate));
          formData.append('status', this.createtempfrom.value.tempstatus);
          formData.append('trip_name', str_trip_name);
          formData.append('driver_name', str_driver_name);
          formData.append('driver_number', str_driver_number);
          formData.append('email', chip_email);
          formData.append('mobile_number', chip_mobile);

          this.uTrackService.temp_alert_create(formData).subscribe(response => {
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
          formData.append('device_link_id', this.bankMultiCtrl.value);
          formData.append('min_temp', this.createtempfrom.value.minitemp);
          formData.append('max_temp', this.createtempfrom.value.maxtemp);
          formData.append('start_date_time', DateUtils.getServerDateTimeHoursMins(this.createtempfrom.value.startdate));
          formData.append('end_date_time', DateUtils.getServerDateTimeHoursMins(this.createtempfrom.value.enddate));
          formData.append('status', this.createtempfrom.value.tempstatus);
          formData.append('temp_alert_id', this.tempAlertId);
          formData.append('trip_name', str_trip_name);
          formData.append('driver_name', str_driver_name);
          formData.append('driver_number', str_driver_number);
          formData.append('email', chip_email);
          formData.append('mobile_number', chip_mobile);

          this.uTrackService.temp_alert_edit(formData).subscribe(response => {
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
