import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BasicResponse } from '../../../../@theme/components/Model/Basic';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'ngx-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

  GroupId: string;
  GroupName: string;
  // GroupImageName:string;
  DeviceLinkListId: string;
  selectedImageName = "ic_group_boy";

  constructor(private headerService: HeaderInteractorService,
    private http: HttpClient,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private uTrackService: UtrackService,
    private routes: Router,
    private toasterService: NbToastrService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Edit Group');
    this.GroupId = localStorage.getItem("GroupId");
    this.GroupName = localStorage.getItem("GroupName");
    // this.GroupImageName = ;
    this.DeviceLinkListId = localStorage.getItem("DeviceLinkListId");

    switch (localStorage.getItem("GroupImageName")) {

      case "ic_group_boy":
        $('#ic_group_boy').addClass('active');
        break;

      case "ic_group_cab":
        $('#ic_group_cab').addClass('active');
        break;

      case "ic_group_delivery":
        $('#ic_group_delivery').addClass('active');
        break;

      case "ic_group_family":
        $('#ic_group_family').addClass('active');
        break;

      case "ic_group_girl":
        $('#ic_group_girl').addClass('active');
        break;

      case "ic_group_home":
        $('#ic_group_home').addClass('active');
        break;

      case "ic_group_school":
        $('#ic_group_school').addClass('active');
        break;

      case "ic_group_self":
        $('#ic_group_self').addClass('active');
        break;

      case "ic_group_teacher":
        $('#ic_group_teacher').addClass('active');
        break;

      case "ic_group_traveller":
        $('#ic_group_traveller').addClass('active');
        break;

      case "ic_group_truck":
        $('#ic_group_truck').addClass('active');
        break;

      case "ic_group_other":
        $('#ic_group_other').addClass('active');
        break;

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

  editGroupForm = new FormGroup({
    editGroupName: new FormControl('', [Validators.required]),
  })

  submit() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {

      var favorite = [];
      $.each($("input[name='getcheckboxvalues']:checked"), function () {
        favorite.push($(this).val());
      });
      var selectedDeviceLinkIds = favorite.join(",");

      const headers = {
        'X-Api-Key': environment.X_API_KEY,
      }
      const formData = new FormData();
      formData.append('group_name', this.editGroupForm.value.editGroupName);
      formData.append('group_icon_name', this.selectedImageName);
      formData.append('device_link_ids', selectedDeviceLinkIds);
      formData.append('group_id', localStorage.getItem("GroupId"));
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('device_token', "Web");

      this.http.post<BasicResponse>(environment.apiBaseUrl + 'group_edit', formData, { headers }).subscribe(response => {
        if (response.status) {

          this.toasterService.success("Pragati Utrack", response.message,);
          // this.routes.navigate([`web/myaccoumygroup`],
          // { relativeTo: this.activatedRoute })

          this.location.back();

        } else {

          this.toasterService.danger("Pragati Utrack", response.message,)
        }
      })

    }
  }

}
