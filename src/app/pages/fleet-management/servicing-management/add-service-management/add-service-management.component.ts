import { Component, OnInit, Inject } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { NbToastrService } from '@nebular/theme';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceManagementData } from '../../../../@theme/components/Model/ServiceManagementResponse';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { HomeLiteV1Data } from '../../../../@theme/components/Model/HomeLiteV1Response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'ngx-add-service-management',
  templateUrl: './add-service-management.component.html',
  styleUrls: ['./add-service-management.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ],
})
export class AddServiceManagementComponent implements OnInit {
  todayDate: Date = new Date();
  isAddService: boolean = true;
  private serviceData: ServiceManagementData;

  vehicles: HomeLiteV1Data[] = [];
  services_type_list = [];
  //Edit Fuel Data Binding Values
  public deviceLinkId: string;
  public servicing_date: Date
  public service_Cost: string;
  public odometer_reading: string;
  public service_station_name: string;
  public service_station_notes: string;

  serviceReceiptImage: File;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  service_image: any = 'assets/Default_Document.png';

  constructor(@Inject(MAT_DIALOG_DATA) serviceManagementDetails: ServiceManagementData,
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private modalService: NgbModal,
    private dialogRef: MatDialog,
  ) {
    if (serviceManagementDetails != null)
      this.serviceData = JSON.parse(serviceManagementDetails.vehicle_service_id);
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    if (this.serviceData != null && this.serviceData != undefined) {
      this.isAddService = false;
      this.deviceLinkId = this.serviceData.device_link_id;
      this.servicing_date = new Date(this.serviceData.service_date)
      this.odometer_reading = this.serviceData.odometre_reading
      this.service_Cost = this.serviceData.service_cost
      this.service_station_name = this.serviceData.service_center_name
      this.service_station_notes = this.serviceData.service_notes
      if (this.serviceData.report_file == null || this.serviceData.report_file == undefined || this.serviceData.report_file == "") {
        this.service_image = 'assets/Default_Document.png'
      } else {
        this.service_image = this.serviceData.report_file
      }
    } else {
      this.isAddService = true;
      this.service_station_name = ""
      this.service_station_notes = ""
      this.servicing_date = new Date()
    }
    this.getServicesList();
    this.getVehicles();
  }

  uploadServiceImage(event: any, cropperModal): void {
    this.modalService.open(cropperModal);
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.serviceReceiptImage = this.Userbase64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name,
    )
    return this.serviceReceiptImage;
  }

  Userbase64ToFile(data, filename) {
    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  croperimage() {
    this.service_image = this.croppedImage;
    this.modalService.dismissAll('Closed');
  }

  createServiceReportForm = new FormGroup({
    servicingDate: new FormControl(this.todayDate, [Validators.required]),
    serviceCost: new FormControl('', [Validators.required, Validators.minLength(3)]),
    odometerReading: new FormControl('', [Validators.required, Validators.minLength(3)]),
    serviceStationName: new FormControl(''),
    serviceStationNote: new FormControl(''),
    vechicleName: new FormControl(''),
    fileData: new FormControl(''),
    services_type: new FormControl(''),
  })

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      this.vehicles = response.data
      if (this.isAddService) {
        this.deviceLinkId = this.vehicles[0].device_link_id;
      }
    })
  }

  getServicesList() {
    this.uTrackService.service_master_list().subscribe(response => {
      this.services_type_list = response.data
      if (this.isAddService) {
        this.deviceLinkId = this.services_type_list[0].device_link_id;

      }
    })
  }

  submit() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      if (
        this.createServiceReportForm.value.servicingDate != undefined && this.createServiceReportForm.value.servicingDate != ""
        && this.createServiceReportForm.value.serviceCost != undefined && this.createServiceReportForm.value.serviceCost != ""
        && this.createServiceReportForm.value.odometerReading != undefined && this.createServiceReportForm.value.odometerReading != ""
      ) {
        const headers = {
          'X-Api-Key': environment.X_API_KEY,
        }
        if (this.isAddService) {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('device_link_id', this.createServiceReportForm.value.vechicleName);
          formData.append('device_token', "Web");
          formData.append('service_date', DateUtils.getServerDate(this.createServiceReportForm.value.servicingDate));
          formData.append('trip_id', "0");
          formData.append('odometre_reading', this.createServiceReportForm.value.odometerReading);
          formData.append('service_center_name', this.createServiceReportForm.value.serviceStationName);
          formData.append('service_cost', this.createServiceReportForm.value.serviceCost);
          formData.append('service_notes', this.createServiceReportForm.value.serviceStationNote);
          formData.append('service_ids', this.createServiceReportForm.value.services_type);
          if (this.serviceReceiptImage != null && this.serviceReceiptImage != undefined) {
            formData.append('report_file', this.serviceReceiptImage, this.serviceReceiptImage.name);
          }
          this.uTrackService.vehicle_service_add(formData).subscribe(response => {
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
          formData.append('device_link_id', this.createServiceReportForm.value.vechicleName);
          formData.append('device_token', "Web");
          formData.append('service_date', DateUtils.getServerDate(this.createServiceReportForm.value.servicingDate));
          formData.append('trip_id', "0");
          formData.append('odometre_reading', this.createServiceReportForm.value.odometerReading);
          formData.append('service_center_name', this.createServiceReportForm.value.serviceStationName);
          formData.append('service_cost', this.createServiceReportForm.value.serviceCost);
          formData.append('service_notes', this.createServiceReportForm.value.serviceStationNote);
          formData.append('report_file', this.serviceReceiptImage, this.serviceReceiptImage.name);
          formData.append('service_ids', this.createServiceReportForm.value.services_type);
          formData.append('vehicle_service_id', this.serviceData.vehicle_service_id);
          this.uTrackService.vehicle_service_edit(formData).subscribe(response => {
            if (response.status) {
              this.toasterService.success('', response.message);
              this.dialogRef.closeAll();
            } else {
              this.toasterService.danger('', response.message)
            }
          })
        }
      } else {
        this.toasterService.danger('', "Please fill all mandatory Information.");
      }
    }
  }
}
