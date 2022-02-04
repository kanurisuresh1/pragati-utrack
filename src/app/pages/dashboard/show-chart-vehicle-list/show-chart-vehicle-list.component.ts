import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HomeData } from '../../../@theme/components/Model/Home';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { OpenDetailsComponent } from '../open-details/open-details.component';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';

// excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-show-chart-vehicle-list',
  templateUrl: './show-chart-vehicle-list.component.html',
  styleUrls: ['./show-chart-vehicle-list.component.scss'],
})
export class ShowChartVehicleListComponent implements OnInit {

  ELEMENT_DATA: HomeData[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'vehicle_type', 'speed', 'last_location', 'last_state', 'last_district', 'fixtime', 'last_running_time', 'driver_name', 'driver_number', 'fuel_point', 'temp1'];
  dataSource = new MatTableDataSource<HomeData>(this.ELEMENT_DATA);
  vehicle_motion_status_name: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) rowData,
    private uTrackService: UtrackService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ShowChartVehicleListComponent>,
 
  ) {

    this.ELEMENT_DATA = JSON.parse(rowData.rowData);
    this.dataSource.data = this.ELEMENT_DATA;
 
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
  
    this.uTrackService.translateLanguage();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.vehicle_motion_status_name = localStorage.getItem('VEHICLE_STATUS_NAME');

    switch (this.vehicle_motion_status_name) {
      case 'Moving': this.vehicle_motion_status_name = 'Moving Vehicles';
        break;

      case 'Stopped': this.vehicle_motion_status_name = 'Stopped Vehicles';
        break;

      case 'Ideal': this.vehicle_motion_status_name = 'Data Not Found Vehicles';
        break;

      default: this.vehicle_motion_status_name = 'Vehicles in ' + this.vehicle_motion_status_name + ' State';
        break;

    }
  }

  openDetails(model_data: HomeData) {
    const rowData = JSON.stringify(model_data);

    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
    this.dialogRef.close();
  }

  private filterValue = '';

  applyFilter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim();
      this.dataSource.filter = this.filterValue;
      this.dataSource.data = this.ELEMENT_DATA;
    }
  }

  search() {
    this.filterValue = (document.getElementById('asset_list_search') as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim();
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;
  }

  downloadPDF() {

    const title1 = 'Pragati UTrack Dashboard Report \n Report generated on';
    const title2 = DateUtils.getDisplayDateTimeFromDate(new Date());
    const pdf_heading_date = title1.concat(title2);

    const Columns: string[] = ['ID', 'Vehicle Name', 'Vehicle Type', 'Speed(KMPH)', 'Location', 'State', 'District', 'Last Record(D&T)', 'Driver Name', 'Driver Number', 'Stopped Duration (HH:MM:SS)', 'Fuel', 'Temperature'];
    const data: String[][] = [];

    let i = 1;
    this.ELEMENT_DATA.forEach(value => {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.speed_formatted);
      row.push(value.location_formatted);
      row.push(value.last_state);
      row.push(value.last_district);
      row.push(DateUtils.getDisplayDateTime(value.fixtime));
      row.push(value.driver_name);
      row.push(value.driver_mobile);
      row.push(value.stopped_time_formatted);
      row.push(value.fuel_point);
      row.push(value.temp1);

      data.push(row);
      i++;
    }),

      PdfUtils.downloadPdf(pdf_heading_date, Columns, data, 'DashboardReport');
  }

  exportexcleDashBoard() {

    const columns = ['ID', 'Vehicle Name', 'Vehicle Type', 'Speed(KMPH)', 'Location', 'State', 'District', 'Last Record(D&T)', 'Driver Name', 'Driver Number', 'Stopped Duration (HH:MM:SS)', 'Fuel', 'Temperature'];

    const mainTitle = 'Pragati UTrack Dashboard Report';
    const title_dates = DateUtils.getDisplayDateTimeFromDate(new Date());


    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Utrack');

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

    worksheet.mergeCells('G1:H3');
    worksheet.addImage(ramkiLogo, 'G1:H3');

    worksheet.mergeCells('C1', 'E2');

    const titleRow = worksheet.getCell('C1');
    titleRow.value = mainTitle,
      titleRow.font = {
        name: 'Calibri',
        size: 18,
        underline: 'single',
        bold: true,
        color: { argb: '0085A3' },
      };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.mergeCells('C3', 'E3');
    const startToendData = worksheet.getCell('C3');
    startToendData.value = title_dates;
    startToendData.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    startToendData.alignment = { vertical: 'middle', horizontal: 'center' };


    worksheet.addRow([]);

    const headerRow = worksheet.addRow(columns);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 14,
      };
      cell.border = {
        top: { style: 'thin' }, left: { style: 'thin' },
        bottom: { style: 'thin' }, right: { style: 'thin' },
      };
    });

    // Adding Data with Conditional Formatting
    let i = 1;
    this.ELEMENT_DATA.forEach(value => {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.speed_formatted);
      row.push(value.location_formatted);
      row.push(value.last_state);
      row.push(value.last_district);
      row.push(DateUtils.getDisplayDateTime(value.fixtime));
      row.push(value.driver_name);
      row.push(value.driver_mobile);
      row.push(value.stopped_time_formatted);
      row.push(value.fuel_point);
      row.push(value.temp1);
      worksheet.addRow(row);
      i++;
    }),

      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 23;
    worksheet.getColumn(3).width = 17;
    worksheet.getColumn(4).width = 17;
    worksheet.getColumn(5).width = 100;
    worksheet.getColumn(6).width = 23;
    worksheet.getColumn(7).width = 23;
    worksheet.getColumn(8).width = 23;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 18;
    worksheet.getColumn(11).width = 35;
    worksheet.getColumn(12).width = 10;
    worksheet.getColumn(13).width = 16;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'TrackRawDataReport' + '.xlsx');
    });
  }


}
