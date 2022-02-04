import { Component, OnInit, ViewChild} from '@angular/core';
import { HubManagementResponseData } from '../../../@theme/components/Model/HubManagementResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import {  Router, ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-hub-management',
  templateUrl: './hub-management.component.html',
  styleUrls: ['./hub-management.component.scss']
})
export class HubManagementComponent implements OnInit {
  ELEMENT_DATA: HubManagementResponseData[] = [];
  displayedColumns: string[] = ['id', 'hub_name', 'added_date', 'hub_location', 'state', 'district_name', 'manager_name', 'manager_number', 'vehicles_count', 'Actions'];
  dataSource = new MatTableDataSource<HubManagementResponseData>(this.ELEMENT_DATA)

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  TableDataNotshow: boolean;
  Hub_Id: string;
  Hub_Name: string;

  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private location: Location,
    private routes: Router,
    private modalService: NgbModal,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Hub Management')
    this.dataSource.sort = this.sort;
    this.fetchDataFromApi()
  }

  back() {
    this.location.back();
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

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.fetchDataFromApi();
  }

  refresh() {
    this.fetchDataFromApi()
  }

  downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Hub Management Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['ID', 'Hub Name', 'Added Date', 'Hub Location', 'State', 'District', 'Manager Name', 'Manager Number', 'Vehicles Count'];
    let data: String[][] = [];

    let i = 1;
    for (let mydata of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.hub_name)
      row.push(DateUtils.getDisplayDate(mydata.added_date));
      row.push(mydata.hub_location)
      row.push(mydata.state)
      row.push(mydata.district_name)
      row.push(mydata.manager_name)
      row.push(mydata.manager_number)
      row.push(mydata.vehicle_list.length.toString())
      data.push(row)
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, 'HubList');
  }

  Exportexcle() {
    let columns = ['ID', 'Hub Name', 'Added Date', 'Hub Location', 'State', 'District', 'Manager Name', 'Manager Number', 'Vehicles Count'];
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
    titleRow.value = 'UTrack Hub Management Details'
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
    startToendData.value = 'Report generated on' + '  ' + converted_reportdate
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
    for (let mydata of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.hub_name)
      row.push(DateUtils.getDisplayDate(mydata.added_date));
      row.push(mydata.hub_location)
      row.push(mydata.state)
      row.push(mydata.district_name)
      row.push(mydata.manager_name)
      row.push(mydata.manager_number)
      row.push(mydata.vehicle_list.length.toString())
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 80;
    worksheet.getColumn(5).width = 27;
    worksheet.getColumn(6).width = 23;
    worksheet.getColumn(7).width = 23;
    worksheet.getColumn(8).width = 23;
    worksheet.getColumn(9).width = 23;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'HubList' + '.xlsx');
    })
  }

  fetchDataFromApi() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('user_type', localStorage.getItem('USER_TYPE'));
    formData.append('device_token', localStorage.getItem('Web'));
    this.uTrackService.hub_list(formData).subscribe(response => {
      this.ELEMENT_DATA = [];
      if (response.status && response.data != undefined && response.data != null && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.ELEMENT_DATA = response.data
      } else {
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  add() {
    this.routes.navigate(["web/fleet-management/hub-management/add-hub"])
  }

  edit(hub_id) {
    this.routes.navigate([`./edit-hub`, hub_id],
      { relativeTo: this.activatedRoute })
  }

  viewHubDetails(hub_id) {
    this.routes.navigate([`./hub-details`, hub_id],
      { relativeTo: this.activatedRoute })
  }

  deleteModel(hubId, hubName) {
    this.Hub_Id = hubId;
    this.Hub_Name = hubName;
    //delete dialog code
    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to remove ' + this.Hub_Name + ' from your Hub List',
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
    formData.append('hub_id', this.Hub_Id);
    this.uTrackService.hub_delete(formData).subscribe(response => {
      this.toasterService.success('Pragati Utrack', response.message);
      this.modalService.dismissAll('Closed');
      this.fetchDataFromApi();
    })
  }

}
