import { Component, OnInit, ViewChild } from '@angular/core';
import { FuelManagementDetails } from '../../../@theme/components/Model/FuelManagementResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { AddFuelManagementComponent } from './add-fuel-management/add-fuel-management.component';
import { environment } from '../../../../environments/environment';
import { ViewFuelImageComponent } from './view-fuel-image/view-fuel-image.component';
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
  selector: 'ngx-fuel-management',
  templateUrl: './fuel-management.component.html',
  styleUrls: ['./fuel-management.component.scss']
})
export class FuelManagementComponent implements OnInit {

  TableDataNotshow:boolean;
  ELEMENT_DATA: FuelManagementDetails[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'added_date','weekDayName', 'odometer_reading', 'quantity', 'price_per_liter', 'total_cost', 'filling_station', 'filling_notes', 'Actions'];
  dataSource = new MatTableDataSource<FuelManagementDetails>(this.ELEMENT_DATA)

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  Fule_Id: string;
  Device_Link_Id: string;
 
  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private dialog: MatDialog,
    private location: Location,
    private modalService: NgbModal,
    private toasterService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Fuel Management')
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
    var myText = 'UTrack Fuel Management Details  \n  Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['ID', 'Vehicle Number', 'Date','Day', 'Odometer Reading', 'Quantity', 'Price Per Litre', 'Total Price', 'Filling Station', 'Filling Notes',];
    let data: String[][] = [];
    let i = 1;
    for (let mydata of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number)
      row.push(DateUtils.getDisplayDate(mydata.added_date));
      row.push(mydata.report_day);
      row.push(mydata.odometer_reading)
      row.push(mydata.quantity)
      row.push(mydata.price_per_liter)
      row.push(mydata.total_cost)
      row.push(mydata.filling_station)
      row.push(mydata.filling_notes)
       data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, 'FuelDetails');
  }

  fetchDataFromApi() {
    this.uTrackService.getFuelDetails().subscribe(response => {
      this.ELEMENT_DATA=[];
      if (response.status && response.data != undefined && response.data != null && response.data.length > 0) {
        this.TableDataNotshow=false;
        this.ELEMENT_DATA = response.data
        this.ELEMENT_DATA.forEach(val => {
          if (val.bill_image == "" || val.bill_image == undefined || val.bill_image == null) {
            val.haveImage = false
          } else {
            val.haveImage = true;
          }
        });
      }else{
        this.TableDataNotshow=true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  exportexcle() {
     let columns =['ID', 'Vehicle Number', 'Date', 'Day', 'Odometer Reading', 'Quantity', 'Price Per Litre', 'Total Price', 'Filling Station', 'Filling Notes',];
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
    worksheet.mergeCells('J1:J3');
    worksheet.addImage(ramkiLogo, 'J1:J3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'H2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Fuel Management Details'
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.mergeCells('C3', 'H3');
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
      row.push(DateUtils.getDisplayDate(mydata.added_date));
      row.push(mydata.report_day);
      row.push(mydata.odometer_reading)
      row.push(mydata.quantity)
      row.push(mydata.price_per_liter)
      row.push(mydata.total_cost)
      row.push(mydata.filling_station)
      row.push(mydata.filling_notes)
       worksheet.addRow(row);
      i++;
    }

    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(4).width = 12;
    worksheet.getColumn(5).width = 23;
    worksheet.getColumn(6).width = 14;
    worksheet.getColumn(7).width = 18;
    worksheet.getColumn(8).width = 16;
    worksheet.getColumn(9).width = 19;
    worksheet.getColumn(10).width = 19;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'FuelDetails' + '.xlsx');
    })
  }
  // Add Dialog Starts 
  add() {
    let dialogReference = this.dialog.open(AddFuelManagementComponent, {
      height: '95%',
      width: '69%',
      disableClose: true,
    })
    dialogReference.afterClosed().subscribe(result => {
      this.fetchDataFromApi();
    })
  }

  edit(model_data: FuelManagementDetails) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(AddFuelManagementComponent, {
      height: '95%',
      width: '69%',
      position: <DialogPosition>{
        top: '1%'
      },
      disableClose: true,
      data: { vehicle_fuel_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.fetchDataFromApi();
    })
  }

  openImage(model_data: FuelManagementDetails) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(ViewFuelImageComponent, {
      height: '95%',
      width: '69%',
      position: <DialogPosition>{
        top: '1%'
      },
      data: { vehicle_fuel_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.fetchDataFromApi();
    })
  }

  deleteModel(fuelId,deviceLinkId){
    this.Fule_Id= fuelId;
    this.Device_Link_Id= deviceLinkId;
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
      formData.append('vehicle_fuel_id', this.Fule_Id);
      formData.append('device_link_id', this.Device_Link_Id);
      this.uTrackService.vehicle_fuel_delete(formData).subscribe(response => {
        this.toasterService.success('', response.message);
        this.modalService.dismissAll('Closed');
        this.fetchDataFromApi();
      })
  }

  openDetails(model_data: FuelManagementDetails) {
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
