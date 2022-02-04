import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { DriverPerformanceReportDetails } from '../../../@theme/components/Model/DriverPerformanceReport';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
// drop down search 
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MyUsersListDetails } from '../../../@theme/components/Model/MyUsersList';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { OpenDetailsComponent } from '../../dashboard/open-details/open-details.component';
import { MatDialog } from '@angular/material/dialog';
import { NbToastrService } from '@nebular/theme';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'ngx-driver-performance',
  templateUrl: './driver-performance.component.html',
  styleUrls: ['./driver-performance.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class DriverPerformanceComponent implements OnInit {

  TableDataNotshow: boolean;

  ELEMENT_DATA: DriverPerformanceReportDetails[] = [];
  dataSource = new MatTableDataSource<DriverPerformanceReportDetails>(this.ELEMENT_DATA)

  displayedColumnsObj = [
    { "value": 'driverId', "show": true },
    { "value": 'vehicle Number', "show": true },
    { "value": 'date', "show": true },
    { "value": 'weekDayName', "show": true },
    { "value": 'kms', "show": true },
    { "value": 'dayKMS', "show": true },
    { "value": 'nightKMS', "show": true },
    { "value": 'free wheeling distance', "show": true },
    { "value": 'travelTime', "show": true },
    { "value": 'totalStoppedTime', "show": true },
    { "value": 'free wheeling time', "show": true },
    { "value": 'maxspeed', "show": true },
    { "value": 'avgSpeed', "show": true },
    { "value": 'suddenAccerlation', "show": true },
    { "value": 'suddenDeccelater', "show": true },
    { "value": 'utilization', "show": true },
  ]

  get displayedColumns(): string[] {
    return this.displayedColumnsObj.filter((element) => { return element.show == true }).map((element) => { return element.value });
  }

  toggle(column: string) {
    let index = this.displayedColumnsObj.map(element => element.value).indexOf(column);
    if (index >= 0) {
      this.displayedColumnsObj[index].show = !this.displayedColumnsObj[index].show;
    }
  }

  private driverDetails: MyUsersListDetails[] = [];

  public startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  public endDate = new Date();
  public changedStartDate = new Date();
  public currentDate = new Date();
  public endMaxDate = new Date()

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public selectedRow: MyUsersListDetails;
  public driverId: string = '';
  public driver_number: string;
  public driver_name: string;
  public driver_firstname: string;
  public driver_lasttname: string;

  constructor(
    private headerService: HeaderInteractorService,
    private location: Location,
    private dialog: MatDialog,
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
  ) {

  }

  myDriverPerformanceForm = new FormGroup({
    driverName: new FormControl(''),
    startDate: new FormControl(this.startDate),
    endDate: new FormControl(this.endDate)
  })

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Driver Performance');
    this.dataSource.sort = this.sort;
    this.my_users_list();
    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  onDateChange(event): void {
    this.changedStartDate = new Date(event.value);
    this.endDate = new Date(this.changedStartDate.getTime() + (1000 * 60 * 60 * 24));
    if (this.endDate > new Date) {
      this.endDate = new Date();
    }
    this.endMaxDate = new Date(this.changedStartDate.getTime() + (1000 * 60 * 60 * 24 * 10));
    if (this.endMaxDate > new Date()) {
      this.endMaxDate = new Date();
    }
  }

  back() {
    this.location.back();
  }

  public searchvehiclenumber: FormControl = new FormControl();
  public filteredVehicleNumber: ReplaySubject<MyUsersListDetails[]> = new ReplaySubject<MyUsersListDetails[]>(1);

  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;

  private filterVehicles() {
    if (!this.driverDetails) {
      return;
    }
    // get the search keyword
    let search = this.searchvehiclenumber.value;
    if (!search) {
      this.filteredVehicleNumber.next(this.driverDetails);
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the 
    this.filteredVehicleNumber.next(
      this.driverDetails.filter(searchData => searchData.first_name.toLowerCase().indexOf(search) > -1)
    );
  }

  my_users_list() {
    this.uTrackService.my_users_list().subscribe(response => {
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.driverDetails = response.data;
        this.filteredVehicleNumber.next(this.driverDetails);
        this.selectedRow = this.driverDetails[0];
        this.driverId = this.driverDetails[0].user_id
        this.driver_number = this.driverDetails[0].mobile;
        this.driver_firstname = this.driverDetails[0].first_name;
        this.driver_lasttname = this.driverDetails[0].last_name;
        this.fetchDataFromApi();
      } else {
        this.TableDataNotshow = true;
      }
    })
  }

  openDetails(model_data: DriverPerformanceReportDetails) {
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
      this.dataSource.data = this.ELEMENT_DATA
    }
  }

  search() {
    this.filterValue = this.filterValue.trim(); // Remove whitespace
    this.filterValue = (document.getElementById('search_element') as HTMLInputElement).value;
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA
  }

  refresh() {
    this.viewReport()
  }

  updateSelectedValue(row) {
    this.selectedRow = row;
  }

  downloadPdf() {
    const title1 = 'UTrack Driver Performance Report \n ';
    const title2 = this.selectedRow.first_name + ' ' + this.selectedRow.last_name + ' ' + '(' + this.selectedRow.mobile + ')' + '\n';
    const title3 = DateUtils.getDisplayDateTime(this.myDriverPerformanceForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.myDriverPerformanceForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);

    let columns: string[] = ['ID','Vehicle Number', 'Date', 'Day','KM', 'Day KM', 'Night KM','Free Wheeling KM','Travel Time (HH:MM:SS)', 'Total Stopped Time (HH:MM:SS)',' Free Wheeling Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)', 'Sudden Accerlation', 'Sudden Deccelater', 'Utilization'];
    let data: String[][] = [];

    let i = 1;
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(DateUtils.getServerDate(value.report_date));
      row.push(value.report_day);
      row.push(value.total_distance);
      row.push(value.total_day_distance);
      row.push(value.total_night_distance);
      row.push(value.free_wheeling_distance);
      row.push(value.total_travelled_time);
      row.push(value.total_stopped_time);
      row.push(value.free_wheeling_time);
      row.push(value.max_speed);
      row.push(value.avg_speed);
      row.push(value.sudden_accerlation);
      row.push(value.sudden_deceleration);
      row.push(value.utilization);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, columns, data, 'Driver_Performance_Report');
  }

  epxportexcle() {
    let columns = ['ID','Vehicle Number', 'Date', 'Day','KM', 'Day KM', 'Night KM','Free Wheeling KM','Travel Time (HH:MM:SS)', 'Total Stopped Time (HH:MM:SS)',' Free Wheeling Time (HH:MM:SS)', 'Max Speed (KMPH)', 'Avg Speed (KMPH)', 'Sudden Accerlation', 'Sudden Deccelater', 'Utilization'];
    const title = 'Utrack Driver Performance report ' + this.selectedRow.first_name + ' ' + this.selectedRow.last_name + ' ' + '(' + this.selectedRow.mobile + ')';
    const converted_date = DateUtils.getDisplayDateTime(this.myDriverPerformanceForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.myDriverPerformanceForm.value.endDate);
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
    worksheet.mergeCells('I1:J3');
    worksheet.addImage(ramkiLogo, 'I1:J3');
    //Add Row and formatting
    worksheet.mergeCells('C1', 'H2');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title
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
    for (let value of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(DateUtils.getServerDate(value.report_date));
      row.push(value.report_day);
      row.push(value.total_distance);
      row.push(value.total_day_distance);
      row.push(value.total_night_distance);
      row.push(value.free_wheeling_distance);
      row.push(value.total_travelled_time);
      row.push(value.total_stopped_time);
      row.push(value.free_wheeling_time);
      row.push(value.max_speed);
      row.push(value.avg_speed);
      row.push(value.sudden_accerlation);
      row.push(value.sudden_deceleration);
      row.push(value.utilization);
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 6;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 16;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 7;
    worksheet.getColumn(6).width = 12;
    worksheet.getColumn(7).width = 13;
    worksheet.getColumn(8).width = 23;
    worksheet.getColumn(9).width = 28;
    worksheet.getColumn(10).width = 36;
    worksheet.getColumn(11).width = 25;
    worksheet.getColumn(12).width = 23;
    worksheet.getColumn(13).width = 22;
    worksheet.getColumn(14).width = 23;
    worksheet.getColumn(15).width = 23;
    worksheet.getColumn(16).width = 13;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Driver_Performance_Report' + '.xlsx');
    })
  }

  fetchDataFromApi() {
    this.uTrackService.driver_performance_report(this.driverId, DateUtils.getServerDate(this.myDriverPerformanceForm.value.startDate), DateUtils.getServerDate(this.myDriverPerformanceForm.value.endDate)).subscribe(response => {
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

  viewReport() {
    if (this.driverId == '') {
      this.toasterService.danger('', 'Please Select Driver');
    } else {
      this.fetchDataFromApi();
    }
  }

}
