import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { BusOrganisationsListResponseData } from '../../../@theme/components/Model/BusOrganisationsListResponse';
import { CustomerManagementDetails } from '../../../@theme/components/Model/CustomerManagementDetails';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { BusOrganisationBranchListResponseData } from '../../../@theme/components/Model/BusOrganisationBranchListResponse';
import { CreateBranchComponent } from './create-branch/create-branch.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss']
})
export class BranchesComponent implements OnInit {

  constructor(
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private dialog: MatDialog,
    private routes: Router,
    private activatedRoute: ActivatedRoute,

  ) {
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('Branches');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.bus_organisation_branch_list();
  }

  ELEMENT_DATA: BusOrganisationBranchListResponseData[] = [];
  displayedColumns: string[] = ['id', 'org_name', 'branch_name', 'branch_location', 'google_location', 'latitude', 'longitude', 'added_date_time', 'updated_date_time', 'status', 'edit'];
  dataSource = new MatTableDataSource<BusOrganisationBranchListResponseData>(this.ELEMENT_DATA)
  TableDataNotshow: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("content") content: ElementRef;

  bus_organisation_branch_list() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.bus_organisation_branch_list(formData).subscribe(response => {
      if (response.status) {
        this.ELEMENT_DATA = [];
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.ELEMENT_DATA = response.data;
          this.TableDataNotshow = false;
          this.dataSource.data = this.ELEMENT_DATA;
        } else {
          this.TableDataNotshow = true;
        }
      } else {
        this.TableDataNotshow = true;
      }
    })
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

  refresh() {
    this.bus_organisation_branch_list()
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;
  }

  createBranch() {
    localStorage.setItem("BUS_ORGANISATION_BRACH_ID", '')
    this.routes.navigate(["web/bus_management/branches/create_branch"])

  }

  editBranch(element) {
    // localStorage.setItem("BUS_ORGANISATION_BRANCH_DATA", JSON.stringify(element))
    this.routes.navigate([`web/bus_management/branches/edit_branch`, element.bus_organisation_branch_id]);
    // this.routes.navigate(["web/bus_management/branches/edit_branch", element.bus_organisation_branch_id])
  }

  branch_details(element) {
    this.routes.navigate([`web/bus_management/branches/branch_details`, element.bus_organisation_branch_id]);
  }

  downloadPDF() {
    const title1 = 'UTrack Branch Report\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayTodayDateTime()
    const pdf_heading_date = title1.concat(title2);
    let dashboardColumns: string[] = ['ID', 'Organisation Name', 'Branch Name', 'Branch Location', 'Google Location', 'Latitude', 'Longitude', 'Added Date & time', 'Updated Date & Time', 'Status'];
    let data: String[][] = [];

    let i = 1;
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.org_name)
      row.push(value.branch_name)
      row.push(value.branch_location)
      row.push(value.google_location)
      row.push(value.latitude)
      row.push(value.longitude)
      row.push(DateUtils.getDisplayDateTime(value.added_date_time))
      row.push(DateUtils.getDisplayDateTime(value.updated_date_time))
      row.push(value.status)
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, dashboardColumns, data, 'BranchList');
  }

  Exportexcle() {
    const columns = ['ID', 'Organisation Name', 'Branch Name', 'Branch Location', 'Google Location', 'Latitude', 'Longitude', 'Added Date & time', 'Updated Date & Time', 'Status'];
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
    titleRow.value = 'UTrack Branch Report'
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
    startToendData.value = 'Report generated on' + ' ' + DateUtils.getDisplayTodayDateTime();
    startToendData.font = {
      name: 'Calibri',
      size: 14,
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
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.org_name)
      row.push(value.branch_name)
      row.push(value.branch_location)
      row.push(value.google_location)
      row.push(value.latitude)
      row.push(value.longitude)
      row.push(DateUtils.getDisplayDateTime(value.added_date_time))
      row.push(DateUtils.getDisplayDateTime(value.updated_date_time))
      row.push(value.status)
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 25;
    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(4).width = 30;
    worksheet.getColumn(5).width = 30;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 15;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'BranchList' + '.xlsx');
    })
  }
}
