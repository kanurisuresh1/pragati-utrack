import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HomeLiteV1Data } from '../../../../@theme/components/Model/HomeLiteV1Response';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { FuelAlertListResponseData } from '../../../../@theme/components/Model/FuelAlertListResponse';

@Component({
  selector: 'ngx-add-fuel-alert',
  templateUrl: './add-fuel-alert.component.html',
  styleUrls: ['./add-fuel-alert.component.scss']
})
export class AddFuelAlertComponent implements OnInit {

  vehicles: HomeLiteV1Data[] = [];
  endDate = new Date();
  deviceLinkId: string = '0';

  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  todayDate: Date = new Date();
  StartDateTime: Date;

  tripName: string;
  driveName: string;
  driveNumber: string;
  email: string;
  mobileNumber: string;
  alert_type: string;
  status: string = 'Active';

  tempAlertId: string;
  tempAlertData: FuelAlertListResponseData;
  isAddService: boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) tempAlertDetails: FuelAlertListResponseData,
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private dialogRef: MatDialog,
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
      this.status = this.tempAlertData.status
      this.tempAlertId = this.tempAlertData.temp_alert_id
      this.tripName = this.tempAlertData.trip_name;
      this.driveName = this.tempAlertData.driver_name;
      this.driveNumber = this.tempAlertData.driver_number;
      this.email = this.tempAlertData.email;
      this.mobileNumber = this.tempAlertData.mobile_number;
      this.alert_type = this.tempAlertData.alert_type;
      switch (this.alert_type) {
        case 'LESS_KM_TRAVEL':
          this.alert_type = 'HEADER_NAMES.Edit Less KM Travel'
          break;
        case 'STOPPED_MORE_THAN_3_HOURS':
          this.alert_type = 'HEADER_NAMES.Edit Stopped Time'
          break;
        case 'DATA_NOT_RECEIVED':
          this.alert_type = 'HEADER_NAMES.Edit Data Not Received'
          break;
        case 'Certificate_Renewal':
          this.alert_type = 'HEADER_NAMES.Edit Certificate Renewal'
          break;
        case 'Fuel':
          this.alert_type = 'HEADER_NAMES.Edit Fuel'
          break;
        case 'Ignition':
          this.alert_type = 'HEADER_NAMES.Edit Ignition'
          break;
        case 'Battery':
          this.alert_type = 'HEADER_NAMES.Edit Battery'
          break;
        default: this.alert_type = this.tempAlertData.alert_type;
      }
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
      this.StartDateTime = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000))
      this.endDate = new Date();
      this.tripName = "";
      this.driveName = "";
      this.driveNumber = "";
      this.alert_type = localStorage.getItem("ALERT_TYPE");

      switch (this.alert_type) {
        case 'LESS_KM_TRAVEL':
          this.alert_type = 'HEADER_NAMES.Add Less Travel KM'
          break;
        case 'STOPPED_MORE_THAN_3_HOURS':
          this.alert_type = 'HEADER_NAMES.Add Stopped Time'
          break;
        case 'DATA_NOT_RECEIVED':
          this.alert_type = 'HEADER_NAMES.Add Data Not Received'
          break;
        case 'Certificate_Renewal':
          this.alert_type = 'HEADER_NAMES.Add Certificate Renewal'
          break;
        case 'Fuel':
          this.alert_type = 'HEADER_NAMES.Fuel'
          break;
        case 'Ignition':
          this.alert_type = 'HEADER_NAMES.Ignition'
          break;
        case 'Battery':
          this.alert_type = 'HEADER_NAMES.Battery'
          break;
        default: this.alert_type = localStorage.getItem("ALERT_TYPE");
      }
    }
    this.getVehicles(this.alert_type);
  }

  selectedVehicles: string[] = [];
  items = [];
  email_ids = [];

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

  private _onDestroy = new Subject<void>();

  createFuelForm = new FormGroup({
    selectvehicle: new FormControl([0], [Validators.required]),
    startdate: new FormControl(this.startDate, [Validators.required]),
    enddate: new FormControl(this.todayDate, [Validators.required]),
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

  public bankMultiCtrl: FormControl = new FormControl();
  public bankMultiFilterCtrl: FormControl = new FormControl();
  public filteredBanksMulti: ReplaySubject<HomeLiteV1Data[]> = new ReplaySubject<HomeLiteV1Data[]>(1);
  @ViewChild('multiSelect') multiSelect: MatSelect;

  getVehicles(alert_type: string) {
    this.uTrackService.home_lite_v1().subscribe(response => {
      this.vehicles = [];
      if (alert_type === 'Fuel') {
        response.data.forEach(element => {
          if (element.product_type == "Fuel" || element.product_type == "FuelTemp") {
            this.vehicles.push(element);
          }
        })
      } else {
        this.vehicles = response.data;
      }

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
    switch (this.alert_type) {
      case 'Less KM Travel':
        this.alert_type = 'LESS_KM_TRAVEL'
        break;
      case 'Stopped Time':
        this.alert_type = 'STOPPED_MORE_THAN_3_HOURS'
        break;
      case 'Data Not Received':
        this.alert_type = 'DATA_NOT_RECEIVED'
        break;
      case 'Certificate Renewal':
        this.alert_type = 'Certificate_Renewal'
        break;
    }

    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger('', "Please login with your credentials to proceed, This is demo account.")
    } else if (
      this.createFuelForm.value.selectvehicle != undefined && this.createFuelForm.value.selectvehicle != ""
      && this.createFuelForm.value.startdate != undefined && this.createFuelForm.value.startdate != ""
      && this.createFuelForm.value.enddate != undefined && this.createFuelForm.value.enddate != ""
      && this.createFuelForm.value.tempstatus != undefined && this.createFuelForm.value.tempstatus != ""
    ) {

      const start_date = DateUtils.getServerDateTime(this.createFuelForm.value.startdate);
      const end_date = DateUtils.getServerDateTime(this.createFuelForm.value.enddate);

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

        let str_driver_name = this.createFuelForm.value.driverName;
        if (str_driver_name == undefined || str_driver_name == null) {
          str_driver_name = '';
        }

        let str_trip_name = this.createFuelForm.value.tripName;
        if (str_trip_name == undefined || str_trip_name == null) {
          str_trip_name = '';
        }

        let str_driver_number = this.createFuelForm.value.driverNumber;
        if (str_driver_number == undefined || str_driver_number == null) {
          str_driver_number = '';
        }

        if (this.isAddService) {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('device_token', "web");
          formData.append('device_link_id', this.bankMultiCtrl.value);
          formData.append('start_date_time', DateUtils.getServerDateTimeHoursMins(this.createFuelForm.value.startdate));
          formData.append('end_date_time', DateUtils.getServerDateTimeHoursMins(this.createFuelForm.value.enddate));
          formData.append('status', this.createFuelForm.value.tempstatus);
          formData.append('trip_name', str_trip_name);
          formData.append('driver_name', str_driver_name);
          formData.append('driver_number', str_driver_number);
          formData.append('email', chip_email);
          formData.append('mobile_number', chip_mobile);
          formData.append('alert_type', this.alert_type);
          this.uTrackService.alert_create(formData).subscribe(response => {
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
          formData.append('start_date_time', DateUtils.getServerDateTimeHoursMins(this.createFuelForm.value.startdate));
          formData.append('end_date_time', DateUtils.getServerDateTimeHoursMins(this.createFuelForm.value.enddate));
          formData.append('status', this.createFuelForm.value.tempstatus);
          formData.append('temp_alert_id', this.tempAlertId);
          formData.append('trip_name', str_trip_name);
          formData.append('driver_name', str_driver_name);
          formData.append('driver_number', str_driver_number);
          formData.append('email', chip_email);
          formData.append('mobile_number', chip_mobile);
          formData.append('alert_type', this.alert_type);
          this.uTrackService.alert_edit(formData).subscribe(response => {
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
