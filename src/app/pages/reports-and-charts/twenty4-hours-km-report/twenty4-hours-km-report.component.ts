import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { AllDeviceReportStatus24HoursData } from '../../../@theme/components/Model/All_device_Status_24_HoursKMReportResponse';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { OpenDetailsComponent } from '../../dashboard/open-details/open-details.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'ngx-twenty4-hours-km-report',
  templateUrl: './twenty4-hours-km-report.component.html',
  styleUrls: ['./twenty4-hours-km-report.component.scss']
})

export class Twenty4HoursKmReportComponent implements OnInit {

  public from_date: string ;
  public to_date: string
  TableDataNotshow: boolean;

  ELEMENT_DATA: AllDeviceReportStatus24HoursData[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'total_distance', 'total_travelled_time', 'max_speed', 'avg_speed','free_wheeling_distance'];
  dataSource = new MatTableDataSource<AllDeviceReportStatus24HoursData>(this.ELEMENT_DATA)

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private headerService: HeaderInteractorService,
    private location: Location,
    private uTrackService: UtrackService,
    private dialog: MatDialog,
   ) {
 
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.24 Hours KM Report');
    this.to_date = DateUtils.getDisplayTodayDateTime()
    this.from_date = DateUtils.getDisplayDateTimeFromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000))
    this.dataSource.sort = this.sort;
    this.get24HoursReportsData();
  }

  back() {
    this.location.back()
  }

  get24HoursReportsData() {
    this.uTrackService.all_device_report_stats_24_hours().subscribe(respose => {
      this.ELEMENT_DATA = [];
      if (respose.status && respose.data != null && respose.data != undefined && respose.data.length > 0) {
        this.TableDataNotshow = false;
        this.ELEMENT_DATA = respose.data;
      } else {
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  openDetails(model_data: AllDeviceReportStatus24HoursData) {
    const rowData = JSON.stringify(model_data);
    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
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
    this.dataSource.data = this.ELEMENT_DATA;
  }

  refresh() {
    this.get24HoursReportsData();
    this.to_date = DateUtils.getDisplayTodayDateTime();
    this.from_date = DateUtils.getDisplayDateTimeFromDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000));
  }

  downloadPDF() {
    const title1 = 'UTrack Last 24 Hours KM Report  \n From ';
    const title3 = DateUtils.getDisplayDateTime(this.from_date) + ' To '
      + DateUtils.getDisplayDateTime(this.to_date);
    const pdf_heading_date = title1.concat(title3);
    let dashboardColumns: string[] = ['ID', 'Vehicle Number', 'Total Distance (KM)', 'Total Travel Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)','Free Wheeling (KM)'];
    let data: String[][] = [];

    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.today.total_distance);
      row.push(value.today.total_travelled_time);
      row.push(value.today.max_speed);
      row.push(value.today.avg_speed);
      row.push(value.today.free_wheeling_distance);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, dashboardColumns, data, '24HoursKMReport');
  }

  epxportexcle() {
    let columns = ['ID', 'Vehicle Number', 'Total Distance (KM)', 'Total Travelled Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)','Free Wheeling (KM)'];
    const converted_startdate = DateUtils.getDisplayDateTime(this.from_date);
    const converted_todate = DateUtils.getDisplayDateTime(this.to_date);
    //Create a workbook with a worksheet
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Utrack');
    //Add Image
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
    titleRow.value = 'UTrack Last 24 Hours KM Report'
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
    startToendData.value = 'From' + ' ' + converted_startdate + ' TO ' + converted_todate + ' (Last 24 Hours)'
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
      row.push(value.vehicle_number);
      row.push(value.today.total_distance);
      row.push(value.today.total_travelled_time);
      row.push(value.today.max_speed);
      row.push(value.today.avg_speed);
      row.push(value.today.free_wheeling_distance);
      worksheet.addRow(row)
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 22;
    worksheet.getColumn(3).width = 24;
    worksheet.getColumn(4).width = 39;
    worksheet.getColumn(5).width = 24;
    worksheet.getColumn(6).width = 24;
    worksheet.getColumn(7).width = 27;
    worksheet.getColumn(8).width = 27;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, '24HoursKMReport' + '.xlsx');
    })
  }
}
