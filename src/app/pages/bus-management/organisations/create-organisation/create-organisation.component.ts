import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbToastrService } from '@nebular/theme';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { BusOrganisationsListResponseData } from '../../../../@theme/components/Model/BusOrganisationsListResponse';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-create-organisation',
  templateUrl: './create-organisation.component.html',
  styleUrls: ['./create-organisation.component.scss']
})
export class CreateOrganisationComponent implements OnInit {

  private organisationData: BusOrganisationsListResponseData
  bus_organisation_id: string;
  orgName: string;
  orgType: string = 'School';
  busVisibility: string = 'Only_Assigned';
  trackHistVisibility: string = 'All_Time';
  statusType: string = 'Active';
  isCreateOrganisation: boolean = true;

  org_logo_Image_file: File;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  org_logo_image: any = 'assets/Default_Document.png';

  constructor(@Inject(MAT_DIALOG_DATA) busOrganisationData: BusOrganisationsListResponseData,
    private uTrackService: UtrackService,
    private modalService: NgbModal,
    private toasterService: NbToastrService,
    public dialogRef: MatDialogRef<CreateOrganisationComponent>,


  ) {
    if (busOrganisationData != null)
      this.organisationData = JSON.parse(busOrganisationData.bus_organisation_id);
  }

  ngOnInit(): void {

    if (this.organisationData != undefined && this.organisationData != null) {
      this.isCreateOrganisation = false;
      this.bus_organisation_id = this.organisationData.bus_organisation_id;
      this.orgName = this.organisationData.org_name;
      this.orgType = this.organisationData.org_type;
      this.busVisibility = this.organisationData.bus_visibility;
      this.trackHistVisibility = this.organisationData.track_history_visibility;
      this.statusType = this.organisationData.status;
      this.org_logo_image = this.organisationData.logo_image;

    } else {
      this.isCreateOrganisation = true;
      this.orgName = '';
      this.orgType = 'School';
      this.busVisibility = 'Only_Assigned';
      this.trackHistVisibility = 'All_Time';
      this.statusType = 'Active';
      this.org_logo_image = 'assets/Default_Document.png';
    }

  }

  organisationForm = new FormGroup({
    org_name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    org_type: new FormControl('', [Validators.required]),
    bus_visibility: new FormControl('', [Validators.required]),
    trh_visibility: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    fileData: new FormControl('', [Validators.required]),
  })


  uploadServiceImage(event: any, cropperModal): void {
    this.modalService.open(cropperModal);
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.org_logo_Image_file = this.Userbase64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name,
    )
    return this.org_logo_Image_file;
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
    this.org_logo_image = this.croppedImage;
    this.modalService.dismissAll('Closed');
  }


  createOrg() {
    let org_name = this.organisationForm.value.org_name;
    let org_type = this.organisationForm.value.org_type;
    let bus_visibility = this.organisationForm.value.bus_visibility;
    let track_history_visibility = this.organisationForm.value.trh_visibility;
    let status = this.organisationForm.value.status;

    if (org_name != null && org_name != undefined && org_name != ''
      && org_type != null && org_type != undefined && org_type != ''
      && bus_visibility != null && bus_visibility != undefined && bus_visibility != ''
      && track_history_visibility != null && track_history_visibility != undefined && track_history_visibility != ''
      && status != null && status != undefined && status != '') {

      if (this.isCreateOrganisation) {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('device_token', "Web");
        formData.append('user_type', localStorage.getItem('USER_TYPE'));
        formData.append('org_name', org_name);
        formData.append('org_type', org_type);
        formData.append('bus_visibility', bus_visibility);
        formData.append('track_history_visibility', track_history_visibility);
        formData.append('status', status);

        if (this.org_logo_Image_file != null && this.org_logo_Image_file != undefined) {
          formData.append('logo_image', this.org_logo_Image_file, this.org_logo_Image_file.name);
        }

        this.uTrackService.bus_organisation_create(formData).subscribe(response => {
          if (response.status) {
            this.toasterService.success('Pragati Utrack', response.message)
            this.dialogRef.close();
          } else {
            this.toasterService.danger('Pragati Utrack', response.message);
            this.dialogRef.close();

          }
        })
      } else {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('device_token', "Web");
        formData.append('user_type', localStorage.getItem('USER_TYPE'));
        formData.append('org_name', org_name);
        formData.append('org_type', org_type);
        formData.append('bus_visibility', bus_visibility);
        formData.append('track_history_visibility', track_history_visibility);
        formData.append('status', status);
        formData.append('bus_organisation_id', this.bus_organisation_id);

        if (this.org_logo_Image_file != null && this.org_logo_Image_file != undefined) {
          formData.append('logo_image', this.org_logo_Image_file, this.org_logo_Image_file.name);
        }

        this.uTrackService.bus_organisation_update(formData).subscribe(response => {
          if (response.status) {
            this.toasterService.success('Pragati Utrack', response.message);
            this.dialogRef.close();

          } else {
            this.toasterService.danger('Pragati Utrack', response.message);
            this.dialogRef.close();

          }
        })
      }

    } else {
      this.toasterService.danger('Pragati Utrack', 'Please Fill All Mandatory Fields')
    }

  }
}