import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Routes, Router, ActivatedRoute } from '@angular/router';
import { DriverManagementListData } from '../../../@theme/components/Model/DriverManagementList';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatePipe, Location } from '@angular/common';
import { NbToastrService } from '@nebular/theme';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { TranslateService } from '@ngx-translate/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-my-shared-users',
  templateUrl: './my-shared-users.component.html',
  styleUrls: ['./my-shared-users.component.scss']
})
export class MySharedUsersComponent implements OnInit {

  TableDataNotshow: boolean;
  sharedUserid: any;
  Nick_Name: any;

  constructor(private headerService: HeaderInteractorService,
    private routes: Router, private location: Location,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,
    private uTrackService: UtrackService,
    private modalService: NgbModal,

  ) { 
  
  }

  ELEMENT_DATA: DriverManagementListData[] = [];

  displayedColumns: string[] = ['user_id', 'nick_name', 'mobile', 'trip_count', 'actions',];
  dataSource = new MatTableDataSource<DriverManagementListData>(this.ELEMENT_DATA)

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("content") content: ElementRef;

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.My Shared Users')
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchDataFromApi();
  }

  addSharedUser() {
    this.routes.navigate(["web/myaccount/mysharedusers/add-shared-user"])
  }

  fetchDataFromApi() {
    this.uTrackService.my_shared_users_list().subscribe(response => {
      if(response.status){
        if (response.data !=null && response.data !=undefined && response.data.length > 0) {
          this.TableDataNotshow = false;
          this.ELEMENT_DATA = response.data
        } else {
          this.TableDataNotshow = true;
        }
      }else{
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  back() {
    this.location.back()
  }

  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.fetchDataFromApi();
    }
  }

  refresh() {
    this.fetchDataFromApi()
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.fetchDataFromApi();
  }

  edit(user_id) {
    this.routes.navigate([`../edit-shared-user`, user_id],
      { relativeTo: this.activatedRoute })
  }

  sharedUserDetail(user_id) {
    this.routes.navigate([`../shared-user-details`, user_id],
      { relativeTo: this.activatedRoute })
  }

  deleteModel(userId,nickName){
    this.sharedUserid= userId;
    this.Nick_Name= nickName;
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to remove ' + this.Nick_Name + ' from your Shared User List',
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

  delete() {

      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('device_token', "Web");
      formData.append('friend_id', this.sharedUserid);
      this.uTrackService.remove_from_my_users(formData).subscribe(response => {
        this.toasterService.success('Pragati Utrack', response.message);
        this.modalService.dismissAll('Closed');
        this.fetchDataFromApi();
      })
    
  }

  downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack My Shared Users Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['Id', 'Nick Name', 'Mobile Number', 'Assigned Vehicle Count',];
    let data: String[][] = [];

    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.nick_name);
      row.push(value.mobile);
      row.push(String(value.trip_count));
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, 'SharedUsersList');
  }

  exportexcle() {
    let columns = ['Id', 'Nick Name', 'Mobile Number', 'Assigned Vehicle Count', ''];
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
    // Add Image
    const myLogoImage = workbook.addImage({
      base64: Base64ImageConstants.uTrackLogoWithBG,
      extension: 'png',
    });
    const ramkiLogo = workbook.addImage({
      base64: Base64ImageConstants.ramkiLogo,
      extension: 'png',
    });
    worksheet.mergeCells('A1:B3');
    worksheet.addImage(myLogoImage, 'A1:B3');
    worksheet.mergeCells('E1:E3');
    worksheet.addImage(ramkiLogo, 'E1:E3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'Df2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack My Shared Users Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.mergeCells('C3', 'D3');
    let startToendData = worksheet.getCell('C3');
    startToendData.value = 'Report generated on' + ' ' + converted_reportdate
    startToendData.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    startToendData.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.addRow([]);
    //Adding Header Row
    let headerRow = worksheet.addRow(columns);
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      }
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 14
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin', }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    })
    // Adding Data with Conditional Formatting
    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.nick_name);
      row.push(value.mobile);
      row.push(String(value.trip_count));
      worksheet.addRow(row);
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 29;
    worksheet.getColumn(3).width = 41;
    worksheet.getColumn(4).width = 41;
    worksheet.getColumn(5).width = 27;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'SharedUsersList' + '.xlsx');
    })
  }
}
