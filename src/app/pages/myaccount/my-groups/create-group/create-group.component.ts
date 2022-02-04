import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import * as $ from 'jquery';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { NbToastrService } from '@nebular/theme';
import { BasicResponse } from '../../../../@theme/components/Model/Basic';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.scss']
})
export class CreateGroupComponent implements OnInit {
  getvehicle_image: string;
  selectedImageName = "ic_group_boy";
  groupId: any;
  isGroup: boolean;
  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private location: Location,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,
   ) {
    this.activatedRoute.params.subscribe(params => {
      this.groupId = params.group_id;
    });
   
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();

    if (this.groupId === undefined) {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Create Group')
      this.isGroup = true;
    } else {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Edit Group')
      this.isGroup = false;
      this.editGroupDetails();
    }

    $('.classname').click(function () {
      $('.classname.active').removeClass('active');
      $(this).addClass('active');
    })
    this.getVehicles();
  }

  back() {
    this.location.back();
  }

  getVehicles() {
    this.uTrackService.getHomeLite().subscribe(response => {
      this.vehicles = response.data
      this.vehicles.forEach((row) => {

        row.getvehicle_image = row.vehicle_image;

        if (row.vehicle_image.includes("no-image")) {
          row.getvehicle_image = "assets/images/MyWallet/defaultpic.png";
        }

      })
    })
  }

  vehicles = []

  create_image(name) {
    this.selectedImageName = name;
  }

  checks = false

  selectAllcheckBox(e) {
    if (e.target.checked == true) {
      this.checks = true;
    }
    else {
      this.checks = false;
    }
  }

  createGroupForm = new FormGroup({
    createGroupName: new FormControl('', [Validators.required]),
  })

  editGroupName: string

  editGroupDetails() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem("USER_ID"));
    formData.append('user_type', localStorage.getItem("USER_TYPE"));
    formData.append('group_id', this.groupId);
    formData.append('device_token', "Web");

    this.uTrackService.group_detail(this.groupId).subscribe(response => {
      this.editGroupName = response.data[0].group_name
    })
  }

  submit() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      var favorite = [];
      $.each($("input[name='getcheckboxvalues']:checked"), function () {
        favorite.push($(this).val());
      });
      var selectedDeviceLinkIds = favorite.join(",");

      if (this.createGroupForm.value.createGroupName != "" && this.createGroupForm.value.createGroupName !== undefined) {

        if (this.groupId == undefined) {
          const formData = new FormData();
          formData.append('group_name', this.createGroupForm.value.createGroupName);
          formData.append('group_icon_name', this.selectedImageName);
          formData.append('device_link_ids', selectedDeviceLinkIds);
          formData.append('user_id', localStorage.getItem("USER_ID"));
          formData.append('user_type', localStorage.getItem("USER_TYPE"));
          formData.append('device_token', "Web");

          this.uTrackService.group_create(formData).subscribe(response => {
            if (response.status) {

              this.toasterService.success("Pragati Utarack", response.message,);
              this.location.back();

            } else {

              this.toasterService.danger("Pragati Utarcak", response.message,)
            }
          })
        } else {
          const formData = new FormData();
          formData.append('group_name', this.createGroupForm.value.createGroupName);
          formData.append('group_icon_name', this.selectedImageName);
          formData.append('device_link_ids', selectedDeviceLinkIds);
          formData.append('group_id', this.groupId);
          formData.append('user_type', localStorage.getItem("USER_TYPE"));
          formData.append('user_id', localStorage.getItem("USER_ID"));
          formData.append('device_token', "Web");
          this.uTrackService.group_edit(formData).subscribe(response => {
            if (response.status) {
              this.toasterService.success("Pragati Utrack", response.message,);
              this.location.back();

            } else {
              this.toasterService.danger("Pragati Utrack", response.message,)
            }
          })
        }
      } else {
        alert("Please fill all mandatory Information.");
      }
    }
  }

}
