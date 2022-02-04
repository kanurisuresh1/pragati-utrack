import { Component, OnInit, ViewChild } from '@angular/core';
import { DriverManagementListData } from '../../../../@theme/components/Model/DriverManagementList';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NbToastrService } from '@nebular/theme';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Base64ImageConstants } from '../../../../@theme/components/Services/image_constants';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../../@theme/components/Services/pdf_utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-driver-list',
  templateUrl: './driver-list.component.html',
  styleUrls: ['./driver-list.component.scss']
})
export class DriverListComponent implements OnInit {
  TableDataNotshow: boolean;
  vehicles = [];
  ELEMENT_DATA: DriverManagementListData[] = [];
  displayedColumns: string[] = ['user_id', 'nick_name', 'mobile', 'trip_count', 'driver_vehicle_list', 'action',];
  dataSource = new MatTableDataSource<DriverManagementListData>(this.ELEMENT_DATA)

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  sharedUserid: string;
  Nick_Name: string;

  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private location: Location,
    private routes: Router,
    private toasterService: NbToastrService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Drivers List');
    this.dataSource.sort = this.sort;
    this.fetchDataFromApi();
    this.getVehicles();
  }

  getVehicles() {
    this.uTrackService.getHomeLite().subscribe(response => {
      if (response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.vehicles = response.data
      } else {
        this.TableDataNotshow = true;
      }
    })
  }

  addDriver() {
    this.routes.navigate(["web/fleet-management/driver-management/add-driver"])
  }

  fetchDataFromApi() {
    this.uTrackService.my_users_list().subscribe(response => {
      this.ELEMENT_DATA = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.ELEMENT_DATA = response.data
      } else {
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
    this.routes.navigate([`../edit-driver`, user_id],
      { relativeTo: this.activatedRoute })
  }

  driverDetail(user_id) {
    this.routes.navigate([`../driver-details`, user_id],
      { relativeTo: this.activatedRoute })
  }

  deleteModel(userId, nickName) {
    this.sharedUserid = userId;
    this.Nick_Name = nickName;
    //delete dialog code
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to remove ' + this.Nick_Name + ' from your Driver List',
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
      this.toasterService.success('', response.message);
      this.fetchDataFromApi();
    })
  }

  downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack My Drivers List Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['ID', 'Nick Name', 'Mobile Number', 'Trip Count', 'Driving Vehicle',];
    let data: String[][] = [];
    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.nick_name);
      row.push(value.mobile);
      row.push(String(value.trip_count));
      row.push("");
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, 'DriversList');
  }

  exportexcle() {
    let columns = ['ID', 'Nick Name', 'Mobile Number', 'Trip Count', 'Driving Vehicle', ''];
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
    worksheet.mergeCells('F1:F3');
    worksheet.addImage(ramkiLogo, 'F1:F3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'E2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack My Drivers List Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.mergeCells('C3', 'E3');
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
      row.push("");
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 21;
    worksheet.getColumn(4).width = 23;
    worksheet.getColumn(5).width = 23;
    worksheet.getColumn(6).width = 27;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'DriversList' + '.xlsx');
    })
  }
}
