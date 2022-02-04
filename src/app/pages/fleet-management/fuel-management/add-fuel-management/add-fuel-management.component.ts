import { Component, OnInit, Inject} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { BasicResponse } from '../../../../@theme/components/Model/Basic';
import { HttpClient } from '@angular/common/http';
import { FuelManagementDetails } from '../../../../@theme/components/Model/FuelManagementResponse';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { NbToastrService } from '@nebular/theme';
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
  selector: 'ngx-add-fuel-management',
  templateUrl: './add-fuel-management.component.html',
  styleUrls: ['./add-fuel-management.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ],
})
export class AddFuelManagementComponent implements OnInit {
  todayDate: Date = new Date();
  isAddFuel: boolean = true;
  private fuelData: FuelManagementDetails;
  //Edit Fuel Data Binding Values
  public deviceLinkId: string;
  public filling_date: Date
  public odometer_reading: string
  public total_price: string
  public price_per_liter: string
  public fuel_quantity_in_ltr: string
  public filling_station_name: string
  public filling_station_notes: string

  serviceReceiptImage: File;
  fuelReceiptImageChangedEvent: any = '';
  croppedFuelReceiptImage: any = '';
  fuel_image: any = 'assets/Default_Document.png';

  constructor(@Inject(MAT_DIALOG_DATA) fuelManagementDetails: FuelManagementDetails,
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private http: HttpClient,
    private modalService: NgbModal,
    private dialogRef: MatDialog,
  ) {
    if (fuelManagementDetails != null)
      this.fuelData = JSON.parse(fuelManagementDetails.vehicle_fuel_id);
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    if (this.fuelData != null && this.fuelData != undefined) {
      this.isAddFuel = false;
      this.deviceLinkId = this.fuelData.device_link_id;
      this.filling_date = new Date(this.fuelData.filling_date)
      this.odometer_reading = this.fuelData.odometer_reading
      this.total_price = this.fuelData.total_cost
      this.price_per_liter = this.fuelData.price_per_liter
      this.fuel_quantity_in_ltr = this.fuelData.quantity
      this.filling_station_name = this.fuelData.filling_station
      this.filling_station_notes = this.fuelData.filling_notes
      if (this.fuelData.bill_image == null || this.fuelData.bill_image == undefined || this.fuelData.bill_image == "") {
        this.fuel_image = 'assets/Default_Document.png'
      } else {
        this.fuel_image = this.fuelData.bill_image
      }
      if (this.filling_station_name == null) {
        this.filling_station_name = ""
      }
      if (this.filling_station_notes == null) {
        this.filling_station_notes = ""
      }
    } else {
      this.isAddFuel = true;
      this.filling_station_name = ""
      this.filling_station_notes = ""
      this.filling_date = new Date()
    }
    this.getVehicles()
  }

  createFuelReportForm = new FormGroup({
    fillingDate: new FormControl('', [Validators.required]),
    odometerReading: new FormControl('', [Validators.required, Validators.minLength(3)]),
    totalPrice: new FormControl('', [Validators.required, Validators.minLength(3)]),
    pricePerLiter: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fuelQuantity: new FormControl('', [Validators.required, Validators.minLength(3)]),
    fillingStationName: new FormControl(''),
    fillingStationNote: new FormControl(''),
    vechicleName: new FormControl(''),
    fileData: new FormControl(''),
  })
  vehicles: HomeLiteV1Data[] = []

  handleFuelReceiptImage(event: any, cropperModal): void {
    this.modalService.open(cropperModal);
    this.fuelReceiptImageChangedEvent = event;
  }

  FuelReceiptImageCropped(event: ImageCroppedEvent) {
    this.croppedFuelReceiptImage = event.base64;
    this.serviceReceiptImage = this.FuelReceiptbase64ToFile(
      event.base64,
      this.fuelReceiptImageChangedEvent.target.files[0].name,
    )
    return this.serviceReceiptImage;
  }

  FuelReceiptbase64ToFile(data, filename) {
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

  UploadFuelReceiptcroperimage() {
    this.fuel_image = this.croppedFuelReceiptImage;
    this.modalService.dismissAll('Closed');
  }

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      this.vehicles = response.data
      if (this.isAddFuel) {
        this.deviceLinkId = this.vehicles[0].device_link_id;
      }
    })
  }

  submit() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      if (
        this.createFuelReportForm.value.fillingDate != undefined && this.createFuelReportForm.value.fillingDate != ""
        && this.createFuelReportForm.value.odometerReading != undefined && this.createFuelReportForm.value.odometerReading != ""
        && this.createFuelReportForm.value.totalPrice != undefined && this.createFuelReportForm.value.totalPrice != ""
        && this.createFuelReportForm.value.pricePerLiter != undefined && this.createFuelReportForm.value.pricePerLiter != ""
        && this.createFuelReportForm.value.fuelQuantity != undefined && this.createFuelReportForm.value.fuelQuantity != ""
      ) {
        const headers = {
          'X-Api-Key': environment.X_API_KEY,
        }
        if (this.isAddFuel) {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('device_link_id', this.createFuelReportForm.value.vechicleName);
          formData.append('device_token', "Web");
          formData.append('filling_date', DateUtils.getServerDate(this.createFuelReportForm.value.fillingDate));
          formData.append('quantity', this.createFuelReportForm.value.fuelQuantity);
          formData.append('price_per_liter', this.createFuelReportForm.value.pricePerLiter);
          formData.append('total_cost', this.createFuelReportForm.value.totalPrice);
          formData.append('bill_image', "");
          formData.append('odometer_reading', this.createFuelReportForm.value.odometerReading);
          formData.append('trip_id', "0");
          formData.append('filling_station', this.filling_station_name);
          formData.append('filling_notes', this.filling_station_notes);

          if (this.serviceReceiptImage != null && this.serviceReceiptImage != undefined) {
            formData.append('bill_image', this.serviceReceiptImage, this.serviceReceiptImage.name);
          }
          this.uTrackService.vehicle_fuel_add(formData).subscribe(response => {
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
          formData.append('device_link_id', this.createFuelReportForm.value.vechicleName);
          formData.append('device_token', "Web");
          formData.append('filling_date', DateUtils.getServerDate(this.createFuelReportForm.value.fillingDate));
          formData.append('quantity', this.createFuelReportForm.value.fuelQuantity);
          formData.append('price_per_liter', this.createFuelReportForm.value.pricePerLiter);
          formData.append('total_cost', this.createFuelReportForm.value.totalPrice);
          formData.append('odometer_reading', this.createFuelReportForm.value.odometerReading);
          formData.append('trip_id', "0");
          formData.append('filling_station', this.filling_station_name);
          formData.append('filling_notes', this.filling_station_notes);
          formData.append('vehicle_fuel_id', this.fuelData.vehicle_fuel_id);
          formData.append('bill_image', this.serviceReceiptImage, this.serviceReceiptImage.name);
          this.http.post<BasicResponse>(environment.apiBaseUrl + 'vehicle_fuel_edit', formData, { headers }).subscribe(response => {
            if (response.status) {
              this.toasterService.success('', response.message)
              this.dialogRef.closeAll();
            } else {
              this.toasterService.danger('', response.message)
            }
          })
        }
      } else {
        this.toasterService.danger('',"Please fill all mandatory Information.");
      }
    }
  }
}
