import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MygroupListResponse, MygroupListResponseData } from '../../../@theme/components/Model/MygroupListRespones';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'ngx-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss']
})
export class MyGroupsComponent implements OnInit {

  GroupDataNotshow:boolean;

  constructor(private headerService: HeaderInteractorService,
    private http: HttpClient, private routes: Router,
    private uTrackService: UtrackService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
   ) {
    
     }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.My Groups')
    this.getMyGroupList();
  }


  back() {
    this.location.back();
  }

  getMyGroupList() {
    this.uTrackService.group_list().subscribe(respone => {
      this.MyGroupList =[];
      if(respone.status){
        if (respone.data !=null && respone.data != undefined && respone.data.length > 0) {
          this.GroupDataNotshow=false;
          respone.data.forEach(row => {
            this.MyGroupList.push(row)
            row.groupImagePath = "assets/images/groups-icons_updated/" + row.group_icon_name + ".png";
            row.groupTotaldeviceListId = row.device_link_id_list.length
          })
        }else{
          this.GroupDataNotshow=true;
        }
      }else{
        this.GroupDataNotshow=true;
      }

    })
  }

  MyGroupList: MygroupListResponseData[]

  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.getMyGroupList();
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.getMyGroupList();
  }

  createGroup() {
    this.routes.navigate([`../create-group`],
      { relativeTo: this.activatedRoute })
  }

  // Use this method later
  // editGroupList(group_id) {
  //   this.routes.navigate([`../mygroups/edit-group`, group_id],
  //     { relativeTo: this.activatedRoute })
  // }

  editGroupList(GroupId, GroupName, GroupImageName, DeviceLinkListId) {
    localStorage.setItem("GroupId", GroupId);
    localStorage.setItem("GroupName", GroupName);
    localStorage.setItem("GroupImageName", GroupImageName);
    localStorage.setItem("DeviceLinkListId", DeviceLinkListId);
    this.routes.navigate([`../mygroups/edit-group`],
      { relativeTo: this.activatedRoute })
  } 




}
