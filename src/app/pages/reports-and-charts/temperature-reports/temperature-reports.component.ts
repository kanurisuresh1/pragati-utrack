import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { NbThemeService, NbToastrService } from '@nebular/theme';
//excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
// drop down search 
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../../@theme/components/Services/image_constants';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { TemperatureResponseData } from '../../../@theme/components/Model/TemperatureReportsResponse';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-temperature-reports',
  templateUrl: './temperature-reports.component.html',
  styleUrls: ['./temperature-reports.component.scss']
})
export class TemperatureReportsComponent implements OnInit {

  deviceLinkId: string;
  private vehicles: HomeLiteV1Data[] = [];

  ELEMENT_DATA: TemperatureResponseData[] = [];
  displayedColumns: string[] = ['id', 'date_time', 'temperature', 'latitude', 'longitude', 'landmark'];
  dataSource = new MatTableDataSource<TemperatureResponseData>(this.ELEMENT_DATA);

  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  endDate = new Date();
  currentDate = new Date();
  minStartDate = new Date(new Date().getTime() - (365 * 24 * 60 * 60 * 1000));

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  TableDataNotshow: boolean;
  GraphDataNotshow: boolean;

  selectedRow: HomeLiteV1Data;
  vehicle_number: string;
  vehicle_type: string;
  selectTimeInterval: number;

  temperatureGraphOptions: any = {};
  temperatureGraph: any;

  constructor(
    private headerService: HeaderInteractorService,
    private location: Location,
    private uTrackService: UtrackService,
    private theme: NbThemeService,
    private toasterService: NbToastrService,
    private activatedRoute: ActivatedRoute,

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.dashboard_device_link_id = params.device_link_id;
    });
  }
  private dashboard_device_link_id: string;

  TemperatureSearchForm = new FormGroup({
    vechicleName: new FormControl(''),
    startDate: new FormControl(this.startDate),
    endDate: new FormControl(this.endDate),
    vehicleTimeInterval: new FormControl(''),
  })

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Temperature Report');
    this.dataSource.sort = this.sort;
    this.getVehicles();
    this.selectTimeInterval = 300;
    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  back() {
    this.location.back();
  }

  public searchvehiclenumber: FormControl = new FormControl();
  public filteredVehicleNumber: ReplaySubject<HomeLiteV1Data[]> = new ReplaySubject<HomeLiteV1Data[]>(1);

  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;

  private filterVehicles() {
    if (!this.vehicles) {
      return;
    }
    // get the search keyword
    let search = this.searchvehiclenumber.value;
    if (!search) {
      this.filteredVehicleNumber.next(this.vehicles);
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the 
    this.filteredVehicleNumber.next(
      this.vehicles.filter(searchData => searchData.vehicle_number.toLowerCase().indexOf(search) > -1)
    );
  }

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      this.vehicles = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
       
        response.data.forEach(element => {
          if (element.product_type == "Temperature" || element.product_type == "FuelTemp") {
            this.TableDataNotshow = false;
            this.GraphDataNotshow = false;
            this.vehicles.push(element)
            this.filteredVehicleNumber.next(this.vehicles);
          }else{
            this.TableDataNotshow = true;
            this.GraphDataNotshow = true;
          }
        })
        if (
          this.dashboard_device_link_id == undefined ||
          this.dashboard_device_link_id == null ||
          this.dashboard_device_link_id == ""
        ) {
          this.selectedRow = this.vehicles[0];
          this.deviceLinkId = this.selectedRow.device_link_id;
          this.vehicle_number = this.vehicles[0].vehicle_number;
          this.vehicle_type = this.vehicles[0].vehicle_type;
        } else {
          this.vehicles.forEach((element) => {
            if (this.dashboard_device_link_id == element.device_link_id) {
              this.deviceLinkId = this.dashboard_device_link_id;
              this.vehicle_number = element.vehicle_number;
          this.vehicle_type = element.vehicle_type;
            }
          });
        }
        this.fetchDataFromApi();
      }
    })
  }

  

  refresh() {
    this.fetchDataFromApi();
  }

  fetchDataFromApi() {
    this.uTrackService.new_track_report_web_mongo_temperature(this.deviceLinkId,
      DateUtils.getServerDateTime(this.TemperatureSearchForm.value.startDate),
      DateUtils.getServerDateTime(this.TemperatureSearchForm.value.endDate), 
      this.selectTimeInterval, '0').subscribe(response => {
        this.ELEMENT_DATA = [];
        if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
          this.TableDataNotshow = false;
          this.GraphDataNotshow = false;
          let temperatures = [];
          let dates = [];
          response.data.forEach(function (val) {
            dates.push(val.d);
            temperatures.push(val.t);
          })
          this.ELEMENT_DATA = response.data;
          this.updateChartData(dates, temperatures);
        } else {
          this.TableDataNotshow = true;
          this.GraphDataNotshow = true;
        }
        this.dataSource.data = this.ELEMENT_DATA
      })
  }

  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.TemperatureSearchForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.TemperatureSearchForm.value.endDate);
    const start_milli_sec = DateUtils.getDateDifference(this.TemperatureSearchForm.value.startDate);
    const end_milli_sec = DateUtils.getDateDifference(this.TemperatureSearchForm.value.endDate);
    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days.');
    } else {
      this.fetchDataFromApi();
    }
  }



  dateChange(){
    const start_date = DateUtils.getServerDateTime(this.TemperatureSearchForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.TemperatureSearchForm.value.endDate);
    const start_milli_sec = DateUtils.getDateDifference(this.TemperatureSearchForm.value.startDate);
    const end_milli_sec = DateUtils.getDateDifference(this.TemperatureSearchForm.value.endDate);
    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_milli_sec - start_milli_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days.');
    } else {

      const startAndendDateTimeDiff = end_milli_sec - start_milli_sec;

      if(startAndendDateTimeDiff <= 172799999){
        this.selectTimeInterval = 30 // 1days
      }else if(startAndendDateTimeDiff <= 431999999){
        this.selectTimeInterval = 60 // 2days
      }else if(startAndendDateTimeDiff <= 604799999){
        this.selectTimeInterval = 300 // 5days
      }else if( startAndendDateTimeDiff <= 1209599999){
        this.selectTimeInterval = 600 // 1week
      }else if(startAndendDateTimeDiff >= 1209599999){
        this.selectTimeInterval = 900 // 2week
      }
    }
  }

  updateSelectedValue(row) {
    this.selectedRow = row;
    this.vehicle_number = this.selectedRow.vehicle_number;
    this.vehicle_type = this.selectedRow.vehicle_type;
    this.viewReport();
  }

  downloadPDF() {
    const title1 = 'Utrack Temperature Report \n ';
    const title2 = this.vehicle_number + '(' + this.vehicle_type + ')' + '\n';
    const title3 = DateUtils.getDisplayDateTime(this.TemperatureSearchForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.TemperatureSearchForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);
    let customerTableColumn: string[] = ['ID', 'Date & Time', 'Temperature', 'Latitude', 'Longitude', 'Nearest Location'];
    let data: String[][] = [];
    let i = 1;
    for (let myData of this.ELEMENT_DATA) {
      var temp_extension_text = '\u00B0' + 'C';
      var custom_temperature = myData.t.concat(temp_extension_text)
      let row: String[] = [];
      row.push(i.toString());
      row.push(myData.d);
      row.push(custom_temperature);
      row.push(myData.la);
      row.push(myData.lo);
      row.push(myData.l);
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, customerTableColumn, data, 'AllTemperatureDetails');
  }

  epxportexcle() {
    let columns = ['ID', 'Date & Time', 'Temperature', 'Latitude', 'Longitude', 'Nearest Location', ' '];
    const converted_date = DateUtils.getDisplayDateTime(this.TemperatureSearchForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.TemperatureSearchForm.value.endDate);
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
    titleRow.value = 'Utrack Temperature Report' + ' - ' + this.vehicle_number + ' ( ' + this.vehicle_type + ' )'
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
    for (let myData of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString())
      row.push(myData.d);
      row.push(myData.t + ' ???');
      row.push(myData.la);
      row.push(myData.lo);
      row.push(myData.l);
      worksheet.addRow(row);
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 23;
    worksheet.getColumn(3).width = 16;
    worksheet.getColumn(4).width = 13;
    worksheet.getColumn(5).width = 13;
    worksheet.getColumn(6).width = 80;
    worksheet.getColumn(7).width = 27;
    worksheet.addRow([]);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'AllTemperatureDetails' + '.xlsx');
    })
  }
  // Graph View 
  updateChartData(dates: string[], temperatures: number[]) {
    this.temperatureGraph = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.temperatureGraphOptions = {
        backgroundColor: echarts.bg,
        color: [colors.info],
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          data: ['Temperature Report'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        grid: {
          top: 70,
          bottom: 50,
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors.info,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
            axisPointer: {
              label: {
                formatter: params => {
                  return (
                    'Temperature  ' + params.value + (params.seriesData.length ? '???' + params.seriesData[0].data : '')
                  );
                },
              },
            },
            data: dates,
          },
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              onZero: false,
              lineStyle: {
                color: colors.success,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
            axisPointer: {
              label: {
                formatter: params => {
                  return (
                    'Temperature  ' + params.value + (params.seriesData.length ? '???' + params.seriesData[0].data : '')
                  );
                },
              },
            },
            data: dates,
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: 'Temperature Chart',
            type: 'line',
            smooth: true,
            data: temperatures,
          },
        ],
      };
    });
  }
}
