import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { CustomerManagementDetails } from '../../../@theme/components/Model/CustomerManagementDetails';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { BusOrganisationsListResponseData } from '../../../@theme/components/Model/BusOrganisationsListResponse';
import { CreateOrganisationComponent } from './create-organisation/create-organisation.component';
import { DialogPosition, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ngx-organisations',
  templateUrl: './organisations.component.html',
  styleUrls: ['./organisations.component.scss']
})
export class OrganisationsComponent implements OnInit {

  constructor(
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.headerService.updateHeaderTitle('Organisations');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.bus_organisation_list();
  }

  ELEMENT_DATA: BusOrganisationsListResponseData[] = [];
  displayedColumns: string[] = ['id', 'name', 'logo_image', 'type', 'bus_visibility', 'track_history_visibility', 'added_date_time', 'updated_date_time', 'status', 'edit'];
  dataSource = new MatTableDataSource<BusOrganisationsListResponseData>(this.ELEMENT_DATA)
  TableDataNotshow: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild("content") content: ElementRef;

  bus_organisation_list() {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    this.uTrackService.bus_organisation_list(formData).subscribe(response => {
      if (response.status) {
        this.ELEMENT_DATA = [];
        if (response.data != null && response.data != undefined && response.data.length > 0) {
          this.ELEMENT_DATA = response.data;
          this.ELEMENT_DATA.forEach(val => {
            if (val.logo_image == undefined || val.logo_image === '' || val.logo_image === '') {
              val.logo_image = 'assets/Default_Document.png'
            } else {
              val.logo_image = val.logo_image;
            }
          })
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
    this.bus_organisation_list()
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;

  }


  createOrganisation() {
    let dialogReference = this.dialog.open(CreateOrganisationComponent, {
      width: '50%',
    })
    dialogReference.afterClosed().subscribe(result => {
      this.bus_organisation_list();
    })
  }

  editOrganisation(model_data: BusOrganisationsListResponseData) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(CreateOrganisationComponent, {
      width: '50%',
      data: { bus_organisation_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.bus_organisation_list();
    })
  }

  downloadPDF() {
    const title1 = 'UTrack Organisation Report\n';
    const title2 = 'Report generated on ' + DateUtils.getDisplayTodayDateTime()
    const pdf_heading_date = title1.concat(title2);
    let dashboardColumns: string[] = ['ID', 'Name', 'Type', 'Bus Visibility', 'Track History Visibility', 'Added Date & time', 'Updated Date & Time', 'Status'];
    let data: String[][] = [];

    let i = 1;
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.org_name)
      row.push(value.org_type)
      row.push(value.bus_visibility)
      row.push(value.track_history_visibility);
      row.push(DateUtils.getDisplayDateTime(value.added_date_time))
      row.push(DateUtils.getDisplayDateTime(value.updated_date_time))
      row.push(value.status)
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, dashboardColumns, data, 'OraganisationList');
  }

  Exportexcle() {
    const columns = ['ID', 'Name', 'Type', 'Bus Visibility', 'Track History Visibility', 'Added Date & time', 'Updated Date & Time', 'Status'];
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
    titleRow.value = 'UTrack Organisation Report'
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
      row.push(value.org_type)
      row.push(value.bus_visibility)
      row.push(value.track_history_visibility);
      row.push(DateUtils.getDisplayDateTime(value.added_date_time))
      row.push(DateUtils.getDisplayDateTime(value.updated_date_time))
      row.push(value.status)
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 12;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 35;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 30;
    worksheet.getColumn(8).width = 12;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'OraganisationList' + '.xlsx');
    })
  }
}
