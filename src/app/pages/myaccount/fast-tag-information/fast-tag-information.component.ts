import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import * as _moment from 'moment';
// excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
// drop down search
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { NbToastrService } from '@nebular/theme';
import { FastTagResponseData } from '../../../@theme/components/Model/FastTagResponse';
import { FastTagDetailsResponseData } from '../../../@theme/components/Model/FastTagDetailsResponse';
import { MatDialog } from '@angular/material/dialog';
import { AddFastTagDetailsComponent } from './add-fast-tag-details/add-fast-tag-details.component';
import { OpenDetailsComponent } from '../../dashboard/open-details/open-details.component';
export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};


@Component({
  selector: 'ngx-fast-tag-information',
  templateUrl: './fast-tag-information.component.html',
  styleUrls: ['./fast-tag-information.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class FastTagInformationComponent implements OnInit {

  FastTagDuplicateDetailsDataNotshow: boolean =true;
  FastTagTransactionsDataNotshow:boolean;
  FastTagDetailsDataNotshow:boolean;

  ELEMENT_DATA: FastTagResponseData[] = [];
  displayedColumns: string[] = ['id', 'vehicle_number', 'transaction date time',
    'transaction amount', 'transaction_id', 'processing date time', 'plaza_name', 'toll_plaza_id', 'plaza_code', 'lane_code', 'hex_tag_id', 'transaction_status',
    'transaction_reference_number', 'added_date'];
  dataSource = new MatTableDataSource<FastTagResponseData>(this.ELEMENT_DATA);

  FAST_TAG_DETAILS_ELEMENT_DATA: FastTagDetailsResponseData[] = [];
  fastTagDetailsdisplayedColumns: string[] = ['id', 'bank_name', 'fasttag_api_client_id',
    'fasttag_api_key', 'added_date', 'modified_date', 'status', 'Actions'];
  fastTagDetailsdataSource = new MatTableDataSource<FastTagDetailsResponseData>(this.FAST_TAG_DETAILS_ELEMENT_DATA);

  FAST_TAG_DETAILS_DUPLICATE_ELEMENT_DATA: FastTagResponseData[] = [];
  fastTagdDuplicateDetailsdisplayedColumns: string[] = ['id', 'vehicle_number', 'transaction date time',
    'transaction amount', 'transaction_id', 'processing date time', 'transaction date time2',
    'transaction amount2', 'transaction_id2', 'processing date time2', 'plaza_name', 'toll_plaza_id', 'plaza_code', 'lane_code', 'hex_tag_id', 'transaction_status',
    'transaction_reference_number', 'added_date'];
  fastTagDuplicateDetailsdataSource = new MatTableDataSource<FastTagResponseData>(this.FAST_TAG_DETAILS_DUPLICATE_ELEMENT_DATA);


  private vehicles: HomeLiteV1Data[] = [];

  private selectedRow: HomeLiteV1Data;

  public endDate = new Date();
  public endMaxDate = new Date();
  public currentDate = new Date();
  public startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  public changedStartDate = new Date();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('content') content: ElementRef;

  public deviceLinkId: string;
  selectall: string;

  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
    private dialog: MatDialog,
    private location: Location,
  ) {
 
  }

  fastTagInfoForm = new FormGroup({
    vechicleName: new FormControl(''),
    startDate: new FormControl(this.startDate),
    endDate: new FormControl(this.endDate),
  });

  ngOnInit(): void {
    this.uTrackService.isUserValid();

    this.uTrackService.translateLanguage();
    this.getVehicles();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Fasttag Transactions');
    this.dataSource.sort = this.sort;
    this.selectall = '';

    this.searchvehiclenumber.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterVehicles();
      });
  }

  public searchvehiclenumber: FormControl = new FormControl();
  public filteredVehicleNumber: ReplaySubject<HomeLiteV1Data[]> = new ReplaySubject<HomeLiteV1Data[]>(1);
  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();
  private filterVehicles() {
    if (!this.vehicles) {
      return;
    }
    let search = this.searchvehiclenumber.value;
    if (!search) {
      this.filteredVehicleNumber.next(this.vehicles);
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the
    this.filteredVehicleNumber.next(
      this.vehicles.filter(searchData => searchData.vehicle_number.toLowerCase().indexOf(search) > -1),
    );
  }

  back() {
    this.location.back()
  }

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {

      if (response.data != null && response.data != undefined && response.data.length > 0) {
        this.FastTagTransactionsDataNotshow = false;
        this.FastTagDetailsDataNotshow= false;
        this.vehicles = response.data;
        this.filteredVehicleNumber.next(this.vehicles);
        this.selectedRow = this.vehicles[0];
        this.deviceLinkId = this.selectedRow.device_link_id
        this.get_vehicle_fasttag_transactions('');
        this.get_fast_tag_account();

      } else {
        this.FastTagTransactionsDataNotshow = true;
        this.FastTagDetailsDataNotshow= true;
      }
    });
  }

  openDetails(model_data: FastTagResponseData) {
    const rowData = JSON.stringify(model_data);

    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
  }

  openFastTagDetails(model_data: FastTagResponseData) {
    const rowData = JSON.stringify(model_data);

    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      height: '95%',
      width: '69%',
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
  }


  refresh() {
    if ("selectall" === this.fastTagInfoForm.value.vechicleName) {
      this.get_vehicle_fasttag_transactions('');
    } else {
      this.get_vehicle_fasttag_transactions(this.fastTagInfoForm.value.vechicleName);
    }
  }

  updateSelectedValue(row) {
    this.selectedRow = row;
    this.viewReport();
    this.get_vehicle_fasttag_transactions(this.fastTagInfoForm.value.vechicleName)
  }

  homeApi() {
    this.get_vehicle_fasttag_transactions('');
  }


  get_vehicle_fasttag_transactions(device_link_id) {

    const formData = new FormData();
    formData.append('user_id', localStorage.getItem("USER_ID"));
    formData.append('user_type', localStorage.getItem("USER_TYPE"));
    formData.append('device_token', "Web");
    formData.append('start_date', DateUtils.getServerDate(this.fastTagInfoForm.value.startDate));
    formData.append('end_date', DateUtils.getServerDate(this.fastTagInfoForm.value.endDate));
    formData.append('device_link_id', device_link_id)
    this.uTrackService.get_vehicle_fasttag_transactions(formData)
      .subscribe(response => {
        this.ELEMENT_DATA = []
        if (response.status) {
          if (response.data != null && response.data != undefined && response.data.length > 0) {
            this.FastTagTransactionsDataNotshow = false;
            this.ELEMENT_DATA = response.data;
          } else {
            this.FastTagTransactionsDataNotshow = true;
          }
        } else {
          this.FastTagTransactionsDataNotshow = true;
        }
        this.dataSource.data = this.ELEMENT_DATA;
      });
  }

  get_fast_tag_account() {


    const formData = new FormData();
    formData.append('user_id', localStorage.getItem("USER_ID"));
    this.uTrackService.get_fast_tag_account(formData)
      .subscribe(response => {
        this.FAST_TAG_DETAILS_ELEMENT_DATA = [];
        if(response.status){
          if (response.data != null && response.data != undefined && response.data.length > 0) {
            this.FastTagDetailsDataNotshow = false;
            this.FAST_TAG_DETAILS_ELEMENT_DATA = response.data;
          } else {
            this.FastTagDetailsDataNotshow = true;
          }
        }else{
          this.FastTagDetailsDataNotshow = true;
        }
        this.fastTagDetailsdataSource.data = this.FAST_TAG_DETAILS_ELEMENT_DATA;
      });
  }

  viewReport() {
    const start_date = DateUtils.getServerDate(this.fastTagInfoForm.value.startDate);
    const end_date = DateUtils.getServerDate(this.fastTagInfoForm.value.endDate);

    const start_sec = DateUtils.getDateDifference(this.fastTagInfoForm.value.startDate);
    const end_sec = DateUtils.getDateDifference(this.fastTagInfoForm.value.endDate);

    if (start_date > end_date) {
      this.toasterService.danger('Pragati Utrack', 'Start date should be less than End date.');
    } else if ((end_sec - start_sec) > 5184000000) {
      this.toasterService.danger('Pragati Utrack', 'Difference between start and end date should be less than 2 Months.');
    } else {
      this.get_vehicle_fasttag_transactions('');
    }
  }

  downloadPDF() {
    const title1 = 'UTrack Fasttag Report\n';
    const title2 = this.selectedRow.vehicle_number + '(' + this.selectedRow.vehicle_type + ')' + '\n';
    const title3 = DateUtils.getDisplayDate(this.fastTagInfoForm.value.startDate) + ' To '
      + DateUtils.getDisplayDate(this.fastTagInfoForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);
    const columns: string[] = ['ID', 'Vehicle Number', 'Transaction Date & Time',
      'Transaction Amount', 'Transaction ID', 'Processing Date & Time', 'Plaza Name', 'Toll Plaza ID', 'Plaza Code', 'Lane Code', 'Hex Tag ID', 'Transaction Status',
      'Transaction Reference Number', 'Added Date & Time'];
    const data: String[][] = [];
    let i = 1;
    for (const mydata of this.ELEMENT_DATA) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number);
      row.push(DateUtils.getDisplayDateTime(mydata.transaction_date_time));
      row.push(mydata.transaction_amount);
      row.push(mydata.transaction_id);
      row.push(DateUtils.getDisplayDateTime(mydata.processing_date_time));
      row.push(mydata.plaza_name);
      row.push(mydata.toll_plaza_id);
      row.push(mydata.plaza_code);
      row.push(mydata.lane_code);
      row.push(mydata.hex_tag_id);
      row.push(mydata.transaction_status);
      row.push(mydata.transaction_reference_number);
      row.push(DateUtils.getDisplayDateTime(mydata.added_date));
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, columns, data, 'FasttagInfoReport');
  }

  exportExcel() {
    const columns = ['ID', 'Vehicle Number', 'Transaction Date & Time',
      'Transaction Amount', 'Transaction ID', 'Processing Date & Time', 'Plaza Name', 'Toll Plaza ID', 'Plaza Code', 'Lane Code', 'Hex Tag ID', 'Transaction Status',
      'Transaction Reference Number', 'Added Date & Time'];
    const title_dates = DateUtils.getDisplayDate(this.fastTagInfoForm.value.startDate) + ' TO '
      + DateUtils.getDisplayDate(this.fastTagInfoForm.value.endDate);
    const mainTitle = 'UTrack Fasttag Information Report' + ' - ' + this.selectedRow.vehicle_number + ' ( ' + this.selectedRow.vehicle_type + ' )';

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Utrack');
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
    // Add Row and formatting
    worksheet.mergeCells('C1', 'F2');
    const titleRow = worksheet.getCell('C1');
    titleRow.value = mainTitle;
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('C3', 'F3');
    const startToendData = worksheet.getCell('C3');
    startToendData.value = title_dates;
    startToendData.font = {
      name: 'Calibri',
      size: 14,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    startToendData.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow([]);
    // Adding Header Row
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
    const data: String[][] = [];
    let i = 1;
    for (const mydata of this.ELEMENT_DATA) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(mydata.vehicle_number);
      row.push(DateUtils.getDisplayDateTime(mydata.transaction_date_time));
      row.push(mydata.transaction_amount);
      row.push(mydata.transaction_id);
      row.push(DateUtils.getDisplayDateTime(mydata.processing_date_time));
      row.push(mydata.plaza_name);
      row.push(mydata.toll_plaza_id);
      row.push(mydata.plaza_code);
      row.push(mydata.lane_code);
      row.push(mydata.hex_tag_id);
      row.push(mydata.transaction_status);
      row.push(mydata.transaction_reference_number);
      row.push(DateUtils.getDisplayDateTime(mydata.added_date));
      data.push(row);
      worksheet.addRow(row);
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = 34;
    worksheet.getColumn(4).width = 10;
    worksheet.getColumn(5).width = 10;
    worksheet.getColumn(6).width = 10;
    worksheet.getColumn(7).width = 34;
    worksheet.getColumn(8).width = 15;
    worksheet.getColumn(9).width = 15;
    worksheet.getColumn(10).width = 15;
    worksheet.getColumn(11).width = 15;
    worksheet.getColumn(12).width = 15;
    worksheet.getColumn(13).width = 15;
    worksheet.getColumn(14).width = 34;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'FasttagInfoReport' + '.xlsx');
    });
  }

  detailsDownloadPDF() {
    const title1 = 'UTrack Fasttag Details Report\n';
    const title2 = this.selectedRow.vehicle_number + '(' + this.selectedRow.vehicle_type + ')' + '\n';
    const title3 = DateUtils.getDisplayDate(this.fastTagInfoForm.value.startDate) + ' To '
      + DateUtils.getDisplayDate(this.fastTagInfoForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);
    const columns: string[] = ['ID', 'Bank Name', 'Customer ID',
      'Access Token', 'Added Date', 'Updated Date', 'status'];
    const data: String[][] = [];
    let i = 1;
    for (const mydata of this.FAST_TAG_DETAILS_ELEMENT_DATA) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(mydata.bank_name);
      row.push(mydata.fasttag_api_client_id);
      row.push(mydata.fasttag_api_key);
      row.push(DateUtils.getDisplayDateTime(mydata.modified_date));
      row.push(DateUtils.getDisplayDateTime(mydata.added_date));
      row.push(mydata.status);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, columns, data, 'FasttagDetailsReport');
  }

  detailsExportExcel() {
    const columns = ['ID', 'Bank Name', 'Customer ID',
      'Access Token', 'Added Date', 'Updated Date', 'status'];
    const title_dates = DateUtils.getDisplayDate(this.fastTagInfoForm.value.startDate) + ' TO '
      + DateUtils.getDisplayDate(this.fastTagInfoForm.value.endDate);
    const mainTitle = 'UTrack Fasttag Details Report' + ' - ' + this.selectedRow.vehicle_number + ' ( ' + this.selectedRow.vehicle_type + ' )';

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Utrack');
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
    // Add Row and formatting
    worksheet.mergeCells('C1', 'F2');
    const titleRow = worksheet.getCell('C1');
    titleRow.value = mainTitle;
    titleRow.font = {
      name: 'Calibri',
      size: 18,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells('C3', 'F3');
    const startToendData = worksheet.getCell('C3');
    startToendData.value = title_dates;
    startToendData.font = {
      name: 'Calibri',
      size: 14,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' },
    };
    startToendData.alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.addRow([]);
    // Adding Header Row
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
    const data: String[][] = [];
    let i = 1;
    for (const mydata of this.FAST_TAG_DETAILS_ELEMENT_DATA) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(mydata.bank_name);
      row.push(mydata.fasttag_api_client_id);
      row.push(mydata.fasttag_api_key);
      row.push(DateUtils.getDisplayDateTime(mydata.added_date));
      row.push(DateUtils.getDisplayDateTime(mydata.modified_date));
      row.push(mydata.status);
      data.push(row);
      worksheet.addRow(row);
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 15;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 40;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 15;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'FasttagDetailsReport' + '.xlsx');
    });
  }

  addFastTag() {
    let dialogReference = this.dialog.open(AddFastTagDetailsComponent, {

    })
    dialogReference.afterClosed().subscribe(result => {
      this.get_fast_tag_account();
    })
  }

  edit(model_data: FastTagDetailsResponseData) {
    let rowData = JSON.stringify(model_data)
    let dialogReference = this.dialog.open(AddFastTagDetailsComponent, {
      data: { fasttag_account_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.get_fast_tag_account();
    })
  }

  delete(model_data: FastTagDetailsResponseData) {
    var result = confirm('Are You Sure Want to delete?')
    if (result == true) {

      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('device_token', "Web");
      formData.append('fasttag_account_id', model_data.fasttag_account_id);
      this.uTrackService.remove_fast_tag_account(formData).subscribe(response => {
        this.toasterService.danger('Pragati Utrack', response.message)
        this.get_fast_tag_account();
      })
    }
  }

}
