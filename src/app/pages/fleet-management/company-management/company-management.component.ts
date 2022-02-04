import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyManagementListData } from '../../../@theme/components/Model/CompanyManagementList';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';

@Component({
  selector: 'ngx-company-management',
  templateUrl: './company-management.component.html',
  styleUrls: ['./company-management.component.scss']
})
export class CompanyManagementComponent implements OnInit {
  TableDataNotshow: boolean;

  ELEMENT_DATA: CompanyManagementListData[] = [];
  displayedColumns: string[] = ['user_id', 'company_name', 'company_logo', 'company_url ', 'state', 'district', 'address1',
    'address2', 'landmark', 'pincode', 'google_address', 'company_email', 'company_phone', 'status', 'Actions'];
  dataSource = new MatTableDataSource<CompanyManagementListData>(this.ELEMENT_DATA)

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private routes: Router,
    private toasterService: NbToastrService,
  ) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Company Management');
    this.dataSource.sort = this.sort;
    this.my_company_list();
  }

  my_company_list() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem("USER_ID"))
    formData.append('device_token', 'Web')
    formData.append('user_type', localStorage.getItem("USER_TYPE"))
    this.uTrackService.my_company_list(formData).subscribe(response => {
      this.ELEMENT_DATA = [];
      if (response.status && response.data != undefined && response.data != null && response.data.length > 0) {
        this.TableDataNotshow = false;
        response.data.forEach(data => {
          console.log(data)
          if (data.company_logo == "" || data.company_logo == undefined || data.company_logo == null) {
            data.company_logo_formatted = 'assets/defaultpic.png'
          } else {
            data.company_logo_formatted = data.company_logo
          }
          if (data.company_website == "" || data.company_website == undefined || data.company_website == null) {
            data.company_website = "-"
          } else {
            data.company_website = data.company_website
          }
          if (data.company_latitude == "" || data.company_latitude == undefined || data.company_latitude == null) {
            data.company_latitude = "-"
          } else {
            data.company_latitude = data.company_latitude
          }
          if (data.company_longitude == "" || data.company_longitude == undefined || data.company_longitude == null) {
            data.company_longitude = "-"
          } else {
            data.company_longitude = data.company_longitude
          }
        })
        this.ELEMENT_DATA = response.data
      } else {
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  back() {
    this.location.back();
  }

  add() {
    this.routes.navigate(["web/fleet-management/company-management/add-company"])
  }

  edit(company_id) {
    this.routes.navigate([`./edit-company`, company_id],
      { relativeTo: this.activatedRoute })
  }

  delete(company_id, company_name) {
    var result = confirm('Are you sure? you want to remove ' + company_name + ' from your Company List?')
    if (result == true) {
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('device_token', "Web");
      formData.append('company_id', company_id);
      this.uTrackService.my_company_delete(formData).subscribe(response => {
        this.toasterService.success('Pragati Utrack', response.message)
        this.my_company_list();
      })
    }
  }

  editCompany(company_id) {
    this.routes.navigate([`./company-details`, company_id],
      { relativeTo: this.activatedRoute })
  }

  private filterValue = "";

  applyFilter(event: KeyboardEvent) {
    if (event.key == "Enter") {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim(); // Remove whitespace
      this.dataSource.filter = this.filterValue;
      this.dataSource.data = this.ELEMENT_DATA;
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA
  }

  refresh() {
    this.my_company_list()
  }

  downloadPDF() {
    var converted_reportdate = DateUtils.getDisplayTodayDateTime();
    var myText = 'UTrack Customer Management Report \n Report generated on '
    var pdf_heading_text = myText.concat(converted_reportdate)
    let Columns: string[] = ['ID', 'Company Name', 'Company Url ', 'State', 'District', 'Address1', 'Address2',
      'Nearest Location', 'Pincode', 'Google Address', 'Company Email', 'Company Phone', 'Status'];
    let data: String[][] = [];

    let i = 1;
    this.ELEMENT_DATA.forEach(value => {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.company_name);
      // row.push(value.company_logo_formatted);
      row.push(value.company_website);
      row.push(value.company_state);
      row.push(value.company_district_name);
      row.push(value.company_address1);
      row.push(value.company_address2);
      row.push(value.company_landmark);
      row.push(value.company_pincode);
      row.push(value.company_google_address);
      row.push(value.company_email);
      row.push(value.company_mobile);
      row.push(value.status);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_text, Columns, data, 'CompanyManagementReport');
  }

  exportexcle() {
    let columns = ['ID', 'Company Name', 'Company Url ', 'State', 'District', 'Address1', 'Address2',
      'Nearest Location', 'Pincode', 'Google Address', 'Company Email', 'Company Phone', 'Status'];
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
    worksheet.mergeCells('G1:G3');
    worksheet.addImage(ramkiLogo, 'G1:G3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'F2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = 'UTrack Customer Management Report'
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
    this.ELEMENT_DATA.forEach(value => {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.company_name);
      // row.push(value.company_logo_formatted);
      row.push(value.company_website);
      row.push(value.company_state);
      row.push(value.company_district_name);
      row.push(value.company_address1);
      row.push(value.company_address2);
      row.push(value.company_landmark);
      row.push(value.company_pincode);
      row.push(value.company_google_address);
      row.push(value.company_email);
      row.push(value.company_mobile);
      row.push(value.status);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 35;
    worksheet.getColumn(4).width = 25;
    worksheet.getColumn(5).width = 17;
    worksheet.getColumn(6).width = 27;
    worksheet.getColumn(7).width = 27;
    worksheet.getColumn(8).width = 27;
    worksheet.getColumn(9).width = 9;
    worksheet.getColumn(10).width = 80;
    worksheet.getColumn(11).width = 27;
    worksheet.getColumn(12).width = 19;
    worksheet.getColumn(13).width = 9;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'CompanyManagementReport' + '.xlsx');
    })
  }
}
