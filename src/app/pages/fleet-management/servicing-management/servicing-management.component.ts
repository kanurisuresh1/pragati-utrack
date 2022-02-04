import { Component, OnInit, ViewChild } from '@angular/core';
import { ServiceVehicleServiceDetails } from '../../../@theme/components/Model/VechicleServiceManagementDetails';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { AddServiceManagementComponent } from './add-service-management/add-service-management.component';
import { environment } from '../../../../environments/environment';
import { ServiceManagementData } from '../../../@theme/components/Model/ServiceManagementResponse';
import { ViewServiceImageComponent } from './view-service-image/view-service-image.component';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { OpenDetailsComponent } from '../../dashboard/open-details/open-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NbToastrService } from '@nebular/theme';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-servicing-management',
  templateUrl: './servicing-management.component.html',
  styleUrls: ['./servicing-management.component.scss']
})

export class ServicingManagementComponent implements OnInit {
  TableDataNotshow: boolean;

  ELEMENT_DATA: ServiceVehicleServiceDetails[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'added_date', 'weekDayName', 'service_cost', 'odometre_reading', 'service_center_name', 'service_name', 'service_notes', 'Actions'];
  dataSource = new MatTableDataSource<ServiceVehicleServiceDetails>(this.ELEMENT_DATA)

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  service_Id: string;
  Device_Link_Id: string;

  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private location: Location,
    private dialog: MatDialog,
    private modalService: NgbModal,
    private toasterService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Service Management')
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
    const converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Service Management Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['ID', 'Vehicle Number', 'Date', 'Day', 'Amount', 'Odometer', 'Service Center Name', 'Services', 'Servicing Notes',];
    let data: String[][] = [];

    let i = 1;
    for (let mydata of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number)
      row.push(DateUtils.getDisplayDateTime(mydata.added_date));
      row.push(mydata.report_day);
      row.push(mydata.service_cost)
      row.push(mydata.odometre_reading)
      row.push(mydata.service_center_name)
      mydata.service_list.forEach(function (newVal) {
        row.push(newVal.service_name)
      })
      row.push(mydata.service_notes)
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, 'VechicleServiceDetails');
  }

  exportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Date', 'Day', 'Amount', 'Odometer', 'Service Center Name', 'Services', 'Servicing Notes',];
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

    worksheet.mergeCells('I1:I3');
    worksheet.addImage(ramkiLogo, 'I1:I3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'G2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Service Management Details '
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    worksheet.mergeCells('C3', 'G3');
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
      row.push(mydata.vehicle_number)
      row.push(DateUtils.getDisplayDateTime(mydata.added_date));
      row.push(mydata.report_day);
      row.push(mydata.service_cost)
      row.push(mydata.odometre_reading)
      row.push(mydata.service_center_name)
      mydata.service_list.forEach(function (newVal) {
        row.push(newVal.service_name)
      })
      row.push(mydata.service_notes)
      worksheet.addRow(row);
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 23;
    worksheet.getColumn(4).width = 23;
    worksheet.getColumn(5).width = 11;
    worksheet.getColumn(6).width = 14;
    worksheet.getColumn(7).width = 25;
    worksheet.getColumn(8).width = 16;
    worksheet.getColumn(9).width = 19;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'VechicleServiceDetails' + '.xlsx');
    })
  }

  fetchDataFromApi() {
    this.uTrackService.getAllVehicleServiceDetails().subscribe(response => {
      this.ELEMENT_DATA = [];
      if (response.status && response.data != undefined && response.data != null && response.data.length > 0) {
        this.TableDataNotshow = false
        this.ELEMENT_DATA = response.data
        this.ELEMENT_DATA.forEach(val => {
          if (val.report_file == "" || val.report_file == undefined || val.report_file == null) {
            val.haveImage = false
          } else {
            val.haveImage = true;
          }
        });
      } else {
        this.TableDataNotshow = true
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  add() {
    let dialogReference = this.dialog.open(AddServiceManagementComponent, {
      height: '95%',
      width: '69%',
      disableClose: true
    })
    dialogReference.afterClosed().subscribe(result => {
      this.fetchDataFromApi();
    })
  }


  edit(model_data: ServiceManagementData) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(AddServiceManagementComponent, {
      height: '95%',
      width: '69%',
      position: <DialogPosition>{
        top: '1%'
      },
      disableClose: true,
      data: { vehicle_service_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.fetchDataFromApi();
    })
  }

  openImage(model_data: ServiceManagementData) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(ViewServiceImageComponent, {
      height: '95%',
      width: '69%',
      position: <DialogPosition>{
        top: '1%'
      },
      data: { vehicle_service_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.fetchDataFromApi();
    })
  }

  deleteModel(serviceId, deviceLinkId) {
    this.service_Id = serviceId;
    this.Device_Link_Id = deviceLinkId;
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

  delete() {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    }
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('user_type', localStorage.getItem('USER_TYPE'));
    formData.append('device_token', "Web");
    formData.append('vehicle_service_id', this.service_Id);
    formData.append('device_link_id', this.Device_Link_Id);
    this.uTrackService.vehicle_service_delete(formData).subscribe(response => {
      this.toasterService.success('', response.message);
      this.modalService.dismissAll('Closed');
      this.fetchDataFromApi();
    })
  }

  openDetails(model_data: ServiceVehicleServiceDetails) {
    const rowData = JSON.stringify(model_data);
    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
  }

}
