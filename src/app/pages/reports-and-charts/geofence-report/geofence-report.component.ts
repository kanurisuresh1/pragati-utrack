import { Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { GeofenceReportDetails } from '../../../@theme/components/Model/GeofenceReport';
import { MatOption } from '@angular/material/core';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { MatDialog } from '@angular/material/dialog';
import { OpenDetailsComponent } from '../../dashboard/open-details/open-details.component';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-geofence-report',
  templateUrl: './geofence-report.component.html',
  styleUrls: ['./geofence-report.component.scss']
})
export class GeofenceReportComponent implements OnInit {

  TableDataNotshow: boolean;
  ELEMENT_DATA: GeofenceReportDetails[] = [];
  displayedColumns: string[] = ['id', 'geofenceName', 'vehicleNumber', 'enterTime', 'exitTime', 'duration'];
  dataSource = new MatTableDataSource<GeofenceReportDetails>(this.ELEMENT_DATA)
  vehicles: HomeLiteV1Data[] = [];
  geofenceList = [];

  public yesterDay = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  public todayDate: Date = new Date();
  minStartDate = new Date(new Date().getTime() - (365 * 24 * 60 * 60 * 1000));

  public geofence_name: string;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('GeofenceSelected') private geofenceSelected: MatOption;

  constructor(private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private location: Location,
    private dialog: MatDialog,
    private toasterService: NbToastrService,
  ) {

  }

  geofenceSearchForm = new FormGroup({
    vechicleName: new FormControl([0]),
    geofenceName: new FormControl([0]),
    startDate: new FormControl(this.yesterDay),
    endDate: new FormControl(this.todayDate)
  })

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Geofence Report')
    this.dataSource.sort = this.sort;
    this.getVehicles();
  }

  back() {
    this.location.back();
  }

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.vehicles = response.data;
        this.selectAllVehicles();
        this.getGeofenceList();
      } else {
        this.TableDataNotshow = true;
      }
    })
  }

  getGeofenceList() {
    this.uTrackService.geofence_list().subscribe(res => {
      if (res.status && res.data != null && res.data != undefined && res.data.length > 0) {
        this.TableDataNotshow = false;
        this.geofenceList = res.data;
        this.selectAllGeofences();
        this.fetchDataFromApi();
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

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;
  }

  refresh() {
    this.fetchDataFromApi()
  }

  fetchDataFromApi() {
    this.uTrackService.geofence_report(this.geofenceSearchForm.value.vechicleName, this.geofenceSearchForm.value.geofenceName, DateUtils.getServerDateTimeFromDate(this.geofenceSearchForm.value.startDate), DateUtils.getServerDateTimeFromDate(this.geofenceSearchForm.value.endDate)).subscribe(response => {
      this.ELEMENT_DATA = []
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.ELEMENT_DATA = response.data;
      } else {
        this.TableDataNotshow = true;
      }
      this.dataSource.data = this.ELEMENT_DATA;
    })
  }

  selectAllVehicles() {
    if (this.allSelected.selected) {
      this.geofenceSearchForm.controls.vechicleName
        .patchValue([...this.vehicles.map(item => item.device_id), 0]);
    }
    else {
      this.geofenceSearchForm.controls.vechicleName.patchValue([]);
    }
  }

  selectAllGeofences() {
    if (this.geofenceSelected.selected) {
      this.geofenceSearchForm.controls.geofenceName
        .patchValue([...this.geofenceList.map(item => item.geofence_id), 0]);
    }
    else {
      this.geofenceSearchForm.controls.geofenceName.patchValue([]);
    }
  }

  openDetails(model_data: GeofenceReportDetails) {
    const rowData = JSON.stringify(model_data);
    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
  }

  downloadPDF() {
    const title1 = 'UTrack Geofence Report  \n';
    const title3 = 'Report Date ' + DateUtils.getDisplayDate(this.geofenceSearchForm.value.startDate) + ' To '
      + DateUtils.getDisplayDate(this.geofenceSearchForm.value.endDate);
    const pdf_heading_date = title1.concat(title3);
    let customerTableColumn: string[] = ['ID', 'Geofence Name', 'Vehicle Number', 'Enter Time', 'Exit Time', 'Duration (HH:MM:SS)'];
    let data: String[][] = [];
    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.geofence_name);
      row.push(value.vehicle_number);
      row.push(value.enter_time);
      row.push(value.exit_time);
      row.push(value.duration);
      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, customerTableColumn, data, 'GeofenceReport');
  }

  epxportexcle() {
    let columns = ['ID', 'Geofence Name', 'Vehicle Number', 'Enter Time', 'Exit Time', 'Duration (HH:MM:SS)', ''];
    const converted_date = 'Report Date ' + DateUtils.getDisplayDate(this.geofenceSearchForm.value.startDate) + ' To '
      + DateUtils.getDisplayDate(this.geofenceSearchForm.value.endDate);
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
    titleRow.value = 'Utrack  Geofence Report'
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
    startToendData.value = converted_date
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
      row.push(value.geofence_name);
      row.push(value.vehicle_number);
      row.push(value.enter_time);
      row.push(value.exit_time);
      row.push(value.duration);
      worksheet.addRow(row);
      i++;
    }),
      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 27;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 23;
    worksheet.getColumn(5).width = 23;
    worksheet.getColumn(6).width = 12;
    worksheet.getColumn(7).width = 27;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'GeofenceReport' + '.xlsx');
    })
  }

  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.geofenceSearchForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.geofenceSearchForm.value.endDate);
    const start_sec = DateUtils.getDateDifference(this.geofenceSearchForm.value.startDate);
    const end_sec = DateUtils.getDateDifference(this.geofenceSearchForm.value.endDate);

    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_sec - start_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days.');
    } else {
      this.fetchDataFromApi();
    }
  }
}
