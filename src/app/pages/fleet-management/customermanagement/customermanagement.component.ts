import { Component, OnInit, ViewChild } from '@angular/core';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { CustomerManagementDetails } from '../../../@theme/components/Model/CustomerManagementDetails';
import { MatTableDataSource } from '@angular/material/table';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import {  Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, DialogPosition } from '@angular/material/dialog';
import { AddCustomerManagementComponent } from './add-customer-management/add-customer-management.component';
import { MatSort } from '@angular/material/sort';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';

@Component({
  selector: 'ngx-customermanagement',
  templateUrl: './customermanagement.component.html',
  styleUrls: ['./customermanagement.component.scss']
})
export class CustomermanagementComponent implements OnInit {

  TableDataNotshow:boolean

  ELEMENT_DATA: CustomerManagementDetails[] = [];
  displayedColumns: string[] = ['customer_id', 'full_name', 'mobile', 'email', 'company_name', 'gst_number', 'state', 'added_date', 'address1', 'address2', 'edit'];
  dataSource = new MatTableDataSource<CustomerManagementDetails>(this.ELEMENT_DATA)

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private location: Location,
    private routes: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Customer Management')
    this.dataSource.sort = this.sort;
    this.fetchDataFromApi()
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

  downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Customer Management Details  \n  Report Generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let customerTableColumn: string[] = ['ID', 'Full Name', 'Mobile', 'Email', 'Company Name', 'Gst Number', 'State', 'Added Date', 'Address 1', 'Address 2',];
    let data: String[][] = [];
    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.full_name);
      row.push(value.mobile);
      row.push(value.email);
      row.push(value.company_name);
      row.push(value.gst_number);
      row.push(value.state);
      row.push(DateUtils.getDisplayDate(value.added_date));
      row.push(value.address1);
      row.push(value.address2);
      data.push(row);
      i++;
    }),
    PdfUtils.downloadPdf(pdf_heading_text, customerTableColumn, data, 'Customers');
  }

  Exportexcle() {
     let columns =  ['ID', 'Full Name', 'Mobile', 'Email', 'Company Name', 'Gst Number', 'State', 'Added Date', 'Address 1', 'Address 2',];
    const converted_reportdate =DateUtils.getDisplayTodayDateTime();
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
    worksheet.mergeCells('G1:G3');
    worksheet.addImage(ramkiLogo, 'G1:G3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'F2');

    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Customer Management Details '
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }
    worksheet.mergeCells('C3', 'F3');
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
    for (let mydata of this.ELEMENT_DATA){
      let row: String[] = [];
      row.push(i.toString());
      row.push(mydata.full_name);
      row.push(mydata.mobile);
      row.push(mydata.email);
      row.push(mydata.company_name);
      row.push(mydata.gst_number);
      row.push(mydata.state);
      row.push(DateUtils.getDisplayDate(mydata.added_date));
      row.push(mydata.address1);
      row.push(mydata.address2);
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 11;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 22;
    worksheet.getColumn(6).width = 23;
    worksheet.getColumn(7).width = 27;
    worksheet.getColumn(8).width = 14;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 30;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Customers' + '.xlsx');
    })
  }

  fetchDataFromApi() {
    this.uTrackService.getCustomerManagementDetails().subscribe(response => {
      this.ELEMENT_DATA=[];
      if (response.status && response.data != undefined && response.data != null && response.data.length > 0) {
        this.TableDataNotshow=false
        this.ELEMENT_DATA = response.data
      }else{
        this.TableDataNotshow=true
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }
  
  back() {
    this.location.back()
  }
  add() {
    let dialogReference = this.dialog.open(AddCustomerManagementComponent, {
      height: '95%',
      width: '69%',
      disableClose: true
    })
    dialogReference.afterClosed().subscribe(result => {
      this.fetchDataFromApi();
    })
  }
  edit(model_data: CustomerManagementDetails) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(AddCustomerManagementComponent, {
      height: '95%',
      width: '69%',
      disableClose: true,
      position: <DialogPosition>{
        top: '1%'
      },
      data: { customer_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.fetchDataFromApi();
    })
  }

  editCustomer(customer_id) {
    this.routes.navigate([`../customer-details`, customer_id],
      { relativeTo: this.activatedRoute })
  }
}
