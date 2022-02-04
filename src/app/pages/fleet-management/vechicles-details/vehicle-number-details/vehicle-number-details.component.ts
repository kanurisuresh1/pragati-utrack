import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Location, DatePipe } from '@angular/common';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import {  VehicleImageList } from '../../../../@theme/components/Model/GetAllVechiclesDetails';
import { NbToastrService } from '@nebular/theme';
import { GetVehicleDetailsData } from '../../../../@theme/components/Model/GetVehicleNumberDetails';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { ShowvehicleImageComponent } from '../showvehicle-image/showvehicle-image.component';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { HubManagementResponseData } from '../../../../@theme/components/Model/HubManagementResponse';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import Swal from 'sweetalert2';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};


@Component({
  selector: 'ngx-vehicle-number-details',
  templateUrl: './vehicle-number-details.component.html',
  styleUrls: ['./vehicle-number-details.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ],
})
export class VehicleNumberDetailsComponent implements OnInit {

  todayDate: Date = new Date();
  pipe = new DatePipe('en-US');

  profileImageUpload: File;
  ProfileImageChangedEvent: any = '';
  croppedProfileImage: any = '';
  vehicle_image: any;

  fileToUpload: File;
  FileimageChangedEvent: any = '';
  croppedFileImage: any = '';
  fileType: any;
  vehicleImageItem:any;

  deviceLinkId: any;
  vehicleDetailsData: GetVehicleDetailsData;
  vehicleImages: VehicleImageList[]
  registrationImages: VehicleImageList[]
  insuranceImages: VehicleImageList[]
  pollutionImages: VehicleImageList[]
  nationalPermitImages: VehicleImageList[]
  statePermitImages: VehicleImageList[]
  taxInvoiceImages: VehicleImageList[]
  fitnessImages: VehicleImageList[]
  otherImages: VehicleImageList[]

  isVehicleImagesAvailable: boolean;
  isRegistraionImagesAvailable: boolean;
  isInsuranceImagesAvailable: boolean;
  isPollutionImagesAvailable: boolean;
  isNationalPermitImagesAvailable: boolean;
  isStatePermitImagesAvailable: boolean;
  isFitnessPermitImagesAvailable: boolean;
  isTaxInvoiceImagesAvailable: boolean;
  isOtherImagesAvailable: boolean;

  // Binding input Values : 
  vehicle_user_id: string
  Imei_Number: string
  hub_name: string
  driver_name: string
  engine_number: string
  chassis_number: string
  make: string
  model: string
  minTemp: string
  maxTemp: string
  over_speed: string
  vechicleName: string
  fuel_type: string
  fuel_tank_size: string
  mileage_per_litre: string
  mileage_per_litre_empty_truck: string
  registered_owner_name: string
  insurance_vender_name: string
  insurance_number: string
  insurance_cost: string
  pollution_check_cost: string
  national_permit_id: string
  buy_date: Date
  vehicle_registration_date: Date
  insurance_date: Date
  insurance_renewal_date: Date
  pollution_check_date: Date
  pollution_renewal_date: Date
  national_permit_issue_date: Date
  national_permit_renewal_date: Date

  state_name: any;
  state_permit_id: any;
  state_permit_issue_date: Date
  state_permit_renewal_date: Date

  fitness_permit_id: any;
  fitness_permit_issue_date: Date
  fitness_permit_renewal_date: Date

  tax_invoice_id: string;
  tax_invoice_permit_issue_date: Date
  tax_invoice_permit_renewal_date: Date

  hubListNames: HubManagementResponseData[]

  vehicle_number: any;

  constructor(private location: Location,
    private uTrackService: UtrackService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private toasterNotification: NbToastrService,
    private headerService: HeaderInteractorService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
    private toasterService: NbToastrService,
   ) {

    this.activatedRoute.params.subscribe(params => {
      this.deviceLinkId = params.device_link_id;
      this.vehicle_number = params.vehicle_number;
    })

  }

  vechicleNumDetailsForm = new FormGroup({
    fctrl_image: new FormControl(''),
    fctrl_deviceImei: new FormControl(''),
    fctrl_vehiclenumber: new FormControl(''),
    fctrl_hub_name: new FormControl(''),
    fctrl_driver_name: new FormControl(''),
    fctrl_engine_number: new FormControl(''),
    fctrl_chassis_number: new FormControl(''),
    fctrl_make: new FormControl(''),
    fctrl_model: new FormControl(''),
    fctrl_min_temp: new FormControl(''),
    fctrl_max_temp: new FormControl(''),
    fctrl_over_speed: new FormControl(''),
    fctrl_vechicleName: new FormControl(''),
    fctrl_fuel_tank_size: new FormControl(''),
    fctrl_mileage_per_litre: new FormControl(''),
    fctrl_mileage_per_litre_empty_truck: new FormControl(''),
    fctrl_registered_owner_name: new FormControl(''),
    fctrl_insurance_vender_name: new FormControl(''),
    fctrl_insurance_number: new FormControl(''),
    fctrl_insurance_cost: new FormControl(''),
    fctrl_pollution_check_cost: new FormControl(''),
    fctrl_national_permit_id: new FormControl(''),
    fctrl_buyDate: new FormControl(''),
    fctrl_insuranceDate: new FormControl(''),
    fctrl_insuranceRenewalDate: new FormControl(''),
    fctrl_pollutionCheckDate: new FormControl(''),
    fctrl_pollutionRenewalDate: new FormControl(''),
    fctrl_nationalPermitDate: new FormControl(''),
    fctrl_nationalPermitRenewalDate: new FormControl(''),
    fctrl_vehicleRegistrationDate: new FormControl(''),
    fctrl_state_name: new FormControl(''),
    fctrl_state_permit_id: new FormControl(''),
    fctrl_state_permit_Issue_Date: new FormControl(''),
    fctrl_state_permit_RenewalDate: new FormControl(''),
    fctrl_fitness_certificate_id: new FormControl(''),
    fctrl_fitness_certificate_IssueDate: new FormControl(''),
    fctrl_fitness_certificate_RenewalDate: new FormControl(''),
    fctrl_tax_invoice_id: new FormControl(''),
    fctrl_taxInvoiceIssueDate: new FormControl(''),
    fctrl_taxInvoiceRenewalDate: new FormControl(''),
  });



  ngOnInit(): void {
    this.uTrackService.isUserValid();
 
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Vehicle Details')
    this.showVehicleDetailsData()
    this.getHubList();
    this.getStateList();
  }


  getHubList() {
    const formData = new FormData()
    formData.append("user_id", localStorage.getItem("USER_ID"))
    formData.append("user_type", localStorage.getItem("USER_TYPE"))
    formData.append("device_token", "Web")

    this.uTrackService.hub_list(formData).subscribe(response => {
      if (response.data != undefined && response.data != null && response.data.length > 0) {
        this.hubListNames = response.data
      }
    })
  }

  states = [];

  getStateList() {
    this.uTrackService.getStates().subscribe(response => {
      if (response.status) {
        this.states = response.data;
        // this.state_name = response.data[0].state;
      }
    })
  }

  handleProfileImage(event: any, cropperModal): void {
    this.modalService.open(cropperModal);
    this.ProfileImageChangedEvent = event;
  }

  ProfileImageCropped(event: ImageCroppedEvent) {
    this.croppedProfileImage = event.base64;
    this.profileImageUpload = this.profileImagebase64ToFile(
      event.base64,
      this.ProfileImageChangedEvent.target.files[0].name,
    )
    return this.profileImageUpload;
  }

  profileImagebase64ToFile(data, filename) {
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

  UploadProfileCroperImage() {
    this.vehicle_image = this.croppedProfileImage;
    this.modalService.dismissAll('Closed');
  }


  handleFileInput(event: any, FileUploadcropperModal, type: string): void {
    this.fileType = type;
    this.modalService.open(FileUploadcropperModal);
    this.FileimageChangedEvent = event;
  }

  imageFileCropped(event: ImageCroppedEvent) {
    this.croppedFileImage = event.base64;
    this.fileToUpload = this.base64ToFileConvert(
      event.base64,
      this.FileimageChangedEvent.target.files[0].name,
    )
    return this.fileToUpload;
  }

  base64ToFileConvert(data, filename) {
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

  uploadcroperImage() {
    if (this.fileToUpload != null && this.fileToUpload != undefined) {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('device_token', localStorage.getItem("USER_TYPE"));
      formData.append('device_link_id', this.deviceLinkId);
      formData.append('image_type', this.fileType);
      formData.append('image_file', this.fileToUpload, this.fileToUpload.name);

      this.uTrackService.vehicle_image_add(formData).subscribe(response => {
        this.toasterNotification.success('',response.message)
        this.showVehicleDetailsData();
      })
    }
    this.modalService.dismissAll('Closed');
  }

  onImageOpen(item) {
    let rowData = JSON.stringify(item)
    let dialogReference = this.dialog.open(ShowvehicleImageComponent, {
      position: <DialogPosition>{
        top: '1%'
      },
      data: { image_file: rowData }
    })
  }

  deleteModel(item){
    this.vehicleImageItem=item
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ce1212',
      cancelButtonColor: '#81b214',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.delete();
      } else {
        result.dismiss === Swal.DismissReason.cancel
      }
    })
   }

   delete(){
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('user_type', localStorage.getItem('USER_TYPE'));
    formData.append('device_token', localStorage.getItem("USER_TYPE"));
    formData.append('device_link_id', this.deviceLinkId);
    formData.append('vehicle_image_id', this.vehicleImageItem.vehicle_image_id);
    this.uTrackService.vehicle_image_delete(formData).subscribe(response => {
      this.toasterNotification.success('',response.message);
      this.showVehicleDetailsData();
    })
   }

  showVehicleDetailsData() {
    this.uTrackService.getVehiclesDetails(this.deviceLinkId).subscribe(response => {
      this.vehicleDetailsData = response.data;
      // binding all the data
      this.vehicle_user_id = this.vehicleDetailsData.user_id
      this.Imei_Number = this.vehicleDetailsData.imei;
      this.hub_name = this.vehicleDetailsData.hub_id;
      this.driver_name = this.vehicleDetailsData.driver_name;
      this.engine_number = this.vehicleDetailsData.engine_number;
      this.chassis_number = this.vehicleDetailsData.chassis_number;
      this.make = this.vehicleDetailsData.make;
      this.model = this.vehicleDetailsData.model;
      this.minTemp = this.vehicleDetailsData.min_temp;
      this.maxTemp = this.vehicleDetailsData.max_temp;
      this.over_speed = String(Number(this.vehicleDetailsData.over_speed) * 2);
      this.fuel_type = this.vehicleDetailsData.fuel_type;
      this.fuel_tank_size = this.vehicleDetailsData.fuel_tank_size;
      this.mileage_per_litre = this.vehicleDetailsData.mileage_per_litre;
      this.mileage_per_litre_empty_truck = this.vehicleDetailsData.empty_truck_avg_mileage;
      this.registered_owner_name = this.vehicleDetailsData.registered_owner_name;
      this.insurance_vender_name = this.vehicleDetailsData.insurance_vender_name;
      this.insurance_number = this.vehicleDetailsData.insurance_number;
      this.insurance_cost = this.vehicleDetailsData.insurance_cost;
      this.pollution_check_cost = this.vehicleDetailsData.pollution_check_cost;
      this.national_permit_id = this.vehicleDetailsData.national_permit_id;
      this.vehicle_image = this.vehicleDetailsData.vehicle_image;

      this.state_name = this.vehicleDetailsData.state_permit_name;
      this.state_permit_id = this.vehicleDetailsData.state_permit_id;
      this.fitness_permit_id = this.vehicleDetailsData.fitness_certificate_id;
      this.tax_invoice_id = this.vehicleDetailsData.tax_invoice_id;

      if (this.vehicleDetailsData.buy_date != "0000-00-00" &&
        this.vehicleDetailsData.buy_date != undefined &&
        this.vehicleDetailsData.buy_date != null) {
        this.buy_date = new Date(this.vehicleDetailsData.buy_date);
      }

      if (this.vehicleDetailsData.vehicle_registration_date != "0000-00-00" &&
        this.vehicleDetailsData.vehicle_registration_date != undefined &&
        this.vehicleDetailsData.vehicle_registration_date != null) {
        this.vehicle_registration_date = new Date(this.vehicleDetailsData.vehicle_registration_date);
      }

      if (this.vehicleDetailsData.insurance_buy_date != "0000-00-00" &&
        this.vehicleDetailsData.insurance_buy_date != undefined &&
        this.vehicleDetailsData.insurance_buy_date != null) {
        this.insurance_date = new Date(this.vehicleDetailsData.insurance_buy_date);
      }

      if (this.vehicleDetailsData.insurance_renewal_date != "0000-00-00" &&
        this.vehicleDetailsData.insurance_renewal_date != undefined &&
        this.vehicleDetailsData.insurance_renewal_date != null) {
        this.insurance_renewal_date = new Date(this.vehicleDetailsData.insurance_renewal_date);
      }

      if (this.vehicleDetailsData.pollution_check_date != "0000-00-00" &&
        this.vehicleDetailsData.pollution_check_date != undefined &&
        this.vehicleDetailsData.pollution_check_date != null) {
        this.pollution_check_date = new Date(this.vehicleDetailsData.pollution_check_date);
      }

      if (this.vehicleDetailsData.pollution_check_renewal_date != "0000-00-00" &&
        this.vehicleDetailsData.pollution_check_renewal_date != undefined &&
        this.vehicleDetailsData.pollution_check_renewal_date != null) {
        this.pollution_renewal_date = new Date(this.vehicleDetailsData.pollution_check_renewal_date);
      }

      if (this.vehicleDetailsData.national_permit_date != "0000-00-00" &&
        this.vehicleDetailsData.national_permit_date != undefined &&
        this.vehicleDetailsData.national_permit_date != null) {
        this.national_permit_issue_date = new Date(this.vehicleDetailsData.national_permit_date);
      }

      if (this.vehicleDetailsData.national_permit_renewal_date != "0000-00-00" &&
        this.vehicleDetailsData.national_permit_renewal_date != undefined &&
        this.vehicleDetailsData.national_permit_renewal_date != null) {
        this.national_permit_renewal_date = new Date(this.vehicleDetailsData.national_permit_renewal_date);
      }


      if (this.vehicleDetailsData.state_permit_date != "0000-00-00" &&
        this.vehicleDetailsData.state_permit_date != undefined &&
        this.vehicleDetailsData.state_permit_date != null) {
        this.state_permit_issue_date = new Date(this.vehicleDetailsData.state_permit_date);
      }

      if (this.vehicleDetailsData.state_permit_renewal_date != "0000-00-00" &&
        this.vehicleDetailsData.state_permit_renewal_date != undefined &&
        this.vehicleDetailsData.state_permit_renewal_date != null) {
        this.state_permit_renewal_date = new Date(this.vehicleDetailsData.state_permit_renewal_date);
      }


      if (this.vehicleDetailsData.fitness_certificate_date != "0000-00-00" &&
        this.vehicleDetailsData.fitness_certificate_date != undefined &&
        this.vehicleDetailsData.fitness_certificate_date != null) {
        this.fitness_permit_issue_date = new Date(this.vehicleDetailsData.fitness_certificate_date);
      }

      if (this.vehicleDetailsData.fitness_certificate_renewal_date != "0000-00-00" &&
        this.vehicleDetailsData.fitness_certificate_renewal_date != undefined &&
        this.vehicleDetailsData.fitness_certificate_renewal_date != null) {
        this.fitness_permit_renewal_date = new Date(this.vehicleDetailsData.fitness_certificate_renewal_date);
      }


      if (this.vehicleDetailsData.tax_invoice_date != "0000-00-00" &&
        this.vehicleDetailsData.tax_invoice_date != undefined &&
        this.vehicleDetailsData.tax_invoice_date != null) {
        this.tax_invoice_permit_issue_date = new Date(this.vehicleDetailsData.tax_invoice_date)
      }

      if (this.vehicleDetailsData.tax_invoice_renewal_date != "0000-00-00" &&
        this.vehicleDetailsData.tax_invoice_renewal_date != undefined &&
        this.vehicleDetailsData.tax_invoice_renewal_date != null) {
        this.tax_invoice_permit_renewal_date = new Date(this.vehicleDetailsData.tax_invoice_renewal_date);
      }



      this.vehicleImages = this.vehicleDetailsData.vehicle_image_list.filter(f => f.image_type == 'VEHICLE');
      if (Array.isArray(this.vehicleImages) && this.vehicleImages.length > 0) {
        this.isVehicleImagesAvailable = true;
      } else {
        this.isVehicleImagesAvailable = false;
      }

      this.registrationImages = this.vehicleDetailsData.vehicle_image_list.filter(f => f.image_type == 'REGISTRATION');
      if (Array.isArray(this.registrationImages) && this.registrationImages.length > 0) {
        this.isRegistraionImagesAvailable = true;
      } else {
        this.isRegistraionImagesAvailable = false;
      }

      this.insuranceImages = this.vehicleDetailsData.vehicle_image_list.filter(f => f.image_type == 'INSURANCE');
      if (Array.isArray(this.insuranceImages) && this.insuranceImages.length > 0) {
        this.isInsuranceImagesAvailable = true;
      } else {
        this.isInsuranceImagesAvailable = false;
      }

      this.pollutionImages = this.vehicleDetailsData.vehicle_image_list.filter(f => f.image_type == 'POLLUTION');
      if (Array.isArray(this.pollutionImages) && this.pollutionImages.length > 0) {
        this.isPollutionImagesAvailable = true;
      } else {
        this.isPollutionImagesAvailable = false;
      }

      this.nationalPermitImages = this.vehicleDetailsData.vehicle_image_list.filter(f => f.image_type == 'NATIONAL_PERMIT');
      if (Array.isArray(this.nationalPermitImages) && this.nationalPermitImages.length > 0) {
        this.isNationalPermitImagesAvailable = true;
      } else {
        this.isNationalPermitImagesAvailable = false;
      }

      this.statePermitImages = this.vehicleDetailsData.vehicle_image_list.filter(f => f.image_type == 'STATE_PERMIT_CERTIFICATE');
      if (Array.isArray(this.statePermitImages) && this.statePermitImages.length > 0) {
        this.isStatePermitImagesAvailable = true;
      } else {
        this.isStatePermitImagesAvailable = false;
      }

      this.fitnessImages = this.vehicleDetailsData.vehicle_image_list.filter(f => f.image_type == 'FITNESS_CERTIFICATE');
      if (Array.isArray(this.fitnessImages) && this.fitnessImages.length > 0) {
        this.isFitnessPermitImagesAvailable = true;
      } else {
        this.isFitnessPermitImagesAvailable = false;
      }

      this.taxInvoiceImages = this.vehicleDetailsData.vehicle_image_list.filter(f => f.image_type == 'TAX_DETAILS');
      if (Array.isArray(this.taxInvoiceImages) && this.taxInvoiceImages.length > 0) {
        this.isTaxInvoiceImagesAvailable = true;
      } else {
        this.isTaxInvoiceImagesAvailable = false;
      }


      this.otherImages = this.vehicleDetailsData.vehicle_image_list.filter(f => f.image_type == 'OTHER');
      if (Array.isArray(this.otherImages) && this.otherImages.length > 0) {
        this.isOtherImagesAvailable = true;
      } else {
        this.isOtherImagesAvailable = false;
      }
    })
  }

  back() {
    this.location.back();
  }

  vehicleDetailSubmit() {
    var buy_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_buyDate, 'yyyy-MM-dd')
    if (buy_date == null || buy_date == undefined) {
      buy_date = ""
    }

    var vehicleRegistrationDate = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_vehicleRegistrationDate, 'yyyy-MM-dd')
    if (vehicleRegistrationDate == null || vehicleRegistrationDate == undefined) {
      vehicleRegistrationDate = ""
    }

    var insurance_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_insuranceDate, 'yyyy-MM-dd')
    if (insurance_date == null || insurance_date == undefined) {
      insurance_date = ""
    }

    var insurance__renewal_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_insuranceRenewalDate, 'yyyy-MM-dd')
    if (insurance__renewal_date == null || insurance__renewal_date == undefined) {
      insurance__renewal_date = ""
    }

    var pollution_check_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_pollutionCheckDate, 'yyyy-MM-dd')
    if (pollution_check_date == null || pollution_check_date == undefined) {
      pollution_check_date = ""
    }

    var pollution_check_renewal_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_pollutionRenewalDate, 'yyyy-MM-dd')
    if (pollution_check_renewal_date == null || pollution_check_renewal_date == undefined) {
      pollution_check_renewal_date = ""
    }

    var national_permit_issue_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_nationalPermitDate, 'yyyy-MM-dd')
    if (national_permit_issue_date == null || national_permit_issue_date == undefined) {
      national_permit_issue_date = ""
    }

    var national_permit_renewal_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_nationalPermitRenewalDate, 'yyyy-MM-dd')
    if (national_permit_renewal_date == null || national_permit_renewal_date == undefined) {
      national_permit_renewal_date = ""
    }


    var state_permit_issue_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_state_permit_Issue_Date, 'yyyy-MM-dd')
    if (state_permit_issue_date == null || state_permit_issue_date == undefined) {
      state_permit_issue_date = ""
    }

    var state_permit_renewal_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_state_permit_RenewalDate, 'yyyy-MM-dd')
    if (state_permit_renewal_date == null || state_permit_renewal_date == undefined) {
      state_permit_renewal_date = ""
    }

    var fitness_certificate_issue_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_fitness_certificate_IssueDate, 'yyyy-MM-dd')
    if (fitness_certificate_issue_date == null || fitness_certificate_issue_date == undefined) {
      fitness_certificate_issue_date = ""
    }

    var fitness_certificate_renewal_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_fitness_certificate_RenewalDate, 'yyyy-MM-dd')
    if (fitness_certificate_renewal_date == null || fitness_certificate_renewal_date == undefined) {
      fitness_certificate_renewal_date = ""
    }


    var tax_invoice_issue_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_taxInvoiceIssueDate, 'yyyy-MM-dd')
    if (tax_invoice_issue_date == null || tax_invoice_issue_date == undefined) {
      tax_invoice_issue_date = ""
    }

    var tax_invoice_issue_renewal_date = this.pipe.transform(this.vechicleNumDetailsForm.value.fctrl_taxInvoiceRenewalDate, 'yyyy-MM-dd')
    if (tax_invoice_issue_renewal_date == null || tax_invoice_issue_renewal_date == undefined) {
      tax_invoice_issue_renewal_date = ""
    }

    var state_permit_name = this.vechicleNumDetailsForm.value.fctrl_state_name
    if (state_permit_name == null || state_permit_name == undefined) {
      state_permit_name = ""
    }

    var state_permit_id = this.vechicleNumDetailsForm.value.fctrl_state_permit_id
    if (state_permit_id == null || state_permit_id == undefined) {
      state_permit_id = ""
    }

    var fitness_certificate_id = this.vechicleNumDetailsForm.value.fctrl_fitness_certificate_id
    if (fitness_certificate_id == null || fitness_certificate_id == undefined) {
      fitness_certificate_id = ""
    }

    var tax_invoice_id = this.vechicleNumDetailsForm.value.fctrl_tax_invoice_id
    if (tax_invoice_id == null || tax_invoice_id == undefined) {
      tax_invoice_id = ""
    }
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      if (this.deviceLinkId != null) {
        const formData = new FormData();
        formData.append('user_id', this.vehicle_user_id);
        formData.append('user_type', localStorage.getItem('USER_TYPE'));
        formData.append('device_token', "Web");
        formData.append('vehicle_detail_id', this.vehicleDetailsData.vehicle_detail_id);
        formData.append('device_link_id', this.deviceLinkId);

        formData.append('engine_number', this.vechicleNumDetailsForm.value.fctrl_engine_number);
        formData.append('chassis_number', this.vechicleNumDetailsForm.value.fctrl_chassis_number);
        formData.append('make', this.vechicleNumDetailsForm.value.fctrl_make);
        formData.append('model', this.vechicleNumDetailsForm.value.fctrl_model);
        formData.append('min_temp', this.vechicleNumDetailsForm.value.fctrl_min_temp);
        formData.append('max_temp', this.vechicleNumDetailsForm.value.fctrl_max_temp);
        formData.append('over_speed', String(Number(this.vechicleNumDetailsForm.value.fctrl_over_speed) / 2));
        formData.append('buy_date', buy_date);
        formData.append('fuel_tank_size', this.vechicleNumDetailsForm.value.fctrl_fuel_tank_size);
        formData.append('fuel_type', this.vechicleNumDetailsForm.value.fctrl_vechicleName);
        formData.append('mileage_per_litre', this.vechicleNumDetailsForm.value.fctrl_mileage_per_litre);
        formData.append('empty_truck_avg_mileage', this.vechicleNumDetailsForm.value.fctrl_mileage_per_litre_empty_truck);
        formData.append('vehicle_registration_date', vehicleRegistrationDate);
        formData.append('registered_owner_name', this.vechicleNumDetailsForm.value.fctrl_registered_owner_name);
        formData.append('insurance_vender_name', this.vechicleNumDetailsForm.value.fctrl_insurance_vender_name);
        formData.append('insurance_cost', this.vechicleNumDetailsForm.value.fctrl_insurance_cost);
        formData.append('insurance_number', this.vechicleNumDetailsForm.value.fctrl_insurance_number);
        formData.append('insurance_buy_date', insurance_date);
        formData.append('insurance_renewal_date', insurance__renewal_date);
        formData.append('pollution_check_cost', this.vechicleNumDetailsForm.value.fctrl_pollution_check_cost);
        formData.append('pollution_check_date', pollution_check_date);
        formData.append('pollution_check_renewal_date', pollution_check_renewal_date);
        formData.append('national_permit_id', this.vechicleNumDetailsForm.value.fctrl_national_permit_id);
        formData.append('national_permit_date', national_permit_issue_date);
        formData.append('national_permit_renewal_date', national_permit_renewal_date);
        formData.append('state_permit_name', state_permit_name);
        formData.append('state_permit_id', state_permit_id);
        formData.append('state_permit_date', state_permit_issue_date);
        formData.append('state_permit_renewal_date', state_permit_renewal_date);
        formData.append('fitness_certificate_id', fitness_certificate_id);
        formData.append('fitness_certificate_date', fitness_certificate_issue_date);
        formData.append('fitness_certificate_renewal_date', fitness_certificate_renewal_date);
        formData.append('tax_invoice_id', tax_invoice_id);
        formData.append('tax_invoice_date', tax_invoice_issue_date);
        formData.append('tax_invoice_renewal_date', tax_invoice_issue_renewal_date);
        formData.append('driver_id', this.vehicleDetailsData.driver_id);
        formData.append('hub_id', this.vechicleNumDetailsForm.value.fctrl_hub_name);

        if (this.profileImageUpload != null && this.profileImageUpload != undefined) {
          formData.append('vehicle_image', this.profileImageUpload, this.profileImageUpload.name);
        }

        this.uTrackService.vehicle_detail_edit(formData).subscribe(response => {
          if (response.status) {
            this.toasterNotification.success('', response.message)
            this.location.back();
          } else {
            this.toasterNotification.danger('', response.message)
          }
        })
      }
    }
  }

}

