import { Component, OnInit, ViewChild} from '@angular/core';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { MatSort } from '@angular/material/sort';
//  Excel down load
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
import { FuelReportResponseData } from '../../../@theme/components/Model/FuelReportResponse';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-fuel-reports',
  templateUrl: './fuel-reports.component.html',
  styleUrls: ['./fuel-reports.component.scss']
})
export class FuelReportsComponent implements OnInit {
  private vehicles: HomeLiteV1Data[] = [];
  device_link_id: string;

  options: any = {};
  themeSubscription: any;

  ELEMENT_DATA: FuelReportResponseData[] = [];
  displayedColumns: string[] = ['id', 'date_time', 'fuel', 'latitude', 'longitude', 'landmark'];
  dataSource = new MatTableDataSource<FuelReportResponseData>(this.ELEMENT_DATA);

  deviceLinkId: string;
  selectedRow: HomeLiteV1Data;
  vehicle_number: string;
  vehicle_type: string;

  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  endDate = new Date();
  currentDate = new Date();
  minStartDate = new Date(new Date().getTime() - (365 * 24 * 60 * 60 * 1000));

  FuelTableDataNotshow: boolean;
  GraphDataNotshow: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private headerService: HeaderInteractorService,
    private location: Location, private fb: FormBuilder,
    private uTrackService: UtrackService,
    private theme: NbThemeService,
    private toasterService: NbToastrService,
    private activatedRoute: ActivatedRoute
    ) {
      this.activatedRoute.params.subscribe((params) => {
        this.dashboard_device_link_id = params.device_link_id;
      });
    }
    private dashboard_device_link_id: string;

  fuelSearchForm = new FormGroup({
    vechicleName: new FormControl(''),
    startDate: new FormControl(this.startDate),
    endDate: new FormControl(this.endDate)
  })

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Fuel Report')
    this.dataSource.sort = this.sort;
    this.getVehicles();
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
          if (element.product_type == "Fuel" || element.product_type == "FuelTemp") {
            this.FuelTableDataNotshow = false;
            this.GraphDataNotshow = false;
            this.vehicles.push(element)
            this.filteredVehicleNumber.next(this.vehicles);
          }else{
            this.FuelTableDataNotshow = true;
            this.GraphDataNotshow = true;
          }
        })
        if (this.vehicles.length > 0) {
          if (
            this.dashboard_device_link_id == undefined ||
            this.dashboard_device_link_id == null ||
            this.dashboard_device_link_id == ""
          ) {
            this.deviceLinkId = this.vehicles[0].device_link_id;
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
      } 
    })
  }

  refresh() {
    this.fetchDataFromApi()
  }

  fetchDataFromApi() {
    if (this.deviceLinkId != null && this.deviceLinkId != undefined && this.deviceLinkId != "") {
      var time_split = 150;
      this.uTrackService.new_track_report_web_mongo_fuel_v1(this.deviceLinkId,
        DateUtils.getServerDateTime(this.fuelSearchForm.value.startDate),
        DateUtils.getServerDateTime(this.fuelSearchForm.value.endDate), time_split).subscribe(response => {
          let fuels = [];
          let dates = [];
          this.ELEMENT_DATA = [];
          if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
            this.FuelTableDataNotshow = false;
            this.GraphDataNotshow = false;
            response.data.forEach(val => {
              this.ELEMENT_DATA.push(val);
            })
            let i = 0;
            this.ELEMENT_DATA.forEach(row => {
              try {
                dates.push((row.dt));
                fuels.push(row.fuel_avg);
              } catch (Exception) {
              }
              i++;
            })
            this.updateChartData(dates, fuels);
          } else {
            this.FuelTableDataNotshow = true;
            this.GraphDataNotshow = true;
          }
          this.dataSource.data = this.ELEMENT_DATA
        })
    } else {
      this.toasterService.danger('', 'No Devices Found');
    }
  }

  viewReport() {
    const start_date = DateUtils.getServerDateTime(this.fuelSearchForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.fuelSearchForm.value.endDate);
    const start_sec = DateUtils.getDateDifference(this.fuelSearchForm.value.startDate);
    const end_sec = DateUtils.getDateDifference(this.fuelSearchForm.value.endDate);

    if (start_date > end_date) {
      this.toasterService.danger('', 'Start date should be less than End date.');
    } else if ((end_sec - start_sec) > 3888000000) {
      this.toasterService.danger('', 'Difference between start and end date should be less than 45 days.');
    } else {
      this.fetchDataFromApi();
    }
  }

  updateSelectedValue(row) {
    this.selectedRow = row;
    this.vehicle_number = this.selectedRow.vehicle_number;
    this.vehicle_type = this.selectedRow.vehicle_type;
    this.viewReport();
  }

  downloadPDF() {
    const title1 = 'Utrack Fuel Report \n '
    const title2 = this.vehicle_number + '(' + this.vehicle_type + ')' + '\n';
    const title3 = DateUtils.getDisplayDateTime(this.fuelSearchForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.fuelSearchForm.value.endDate);
    const pdf_heading_date = title1.concat(title2).concat(title3);
    let customerTableColumn: string[] = ['ID', 'Date & Time', 'Fuel', 'Latitude', 'Longitude', 'Nearest Location'];
    let data: String[][] = [];
    let i = 1;

    for (let myData of this.ELEMENT_DATA) {
      let row: String[] = [];
      row.push(i.toString())
      row.push(myData.dt);
      row.push(String(myData.fuel_avg))
      row.push(myData.la.toString())
      row.push(myData.lo.toString())
      row.push(myData.ld + ' KM From ' + myData.ln)
      data.push(row);
      i++;
    }
    PdfUtils.downloadPdf(pdf_heading_date, customerTableColumn, data, 'AllFuelDetails');
  }

  epxportexcle() {
    const columns = ['ID', 'Date & Time', 'Fuel', 'Latitude', 'Longitude', 'Nearest Location', ' '];
    const converted_date = DateUtils.getDisplayDateTime(this.fuelSearchForm.value.startDate) + ' To '
      + DateUtils.getDisplayDateTime(this.fuelSearchForm.value.endDate);
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
    titleRow.value = 'Utrack Fuel Report' + ' - ' + this.vehicle_number + ' ( ' + this.vehicle_type + ' )'
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
      row.push(myData.dt);
      row.push(String(myData.fuel_avg))
      row.push(myData.la.toString())
      row.push(myData.lo.toString())
      row.push(myData.ld + ' KM From ' + myData.ln)
      worksheet.addRow(row)
      i++;
    }
    worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 23;
    worksheet.getColumn(3).width = 9;
    worksheet.getColumn(4).width = 13;
    worksheet.getColumn(5).width = 13;
    worksheet.getColumn(6).width = 80;
    worksheet.getColumn(7).width = 27;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'AllFuelDetails' + '.xlsx');
    })
  }
  // Graph View 
  updateChartData(dates: string[], fuels: number[]) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.info],
        tooltip: {
          trigger: 'none',
          axisPointer: {
            type: 'cross',
          },
        },
        legend: {
          data: ['Fuel Report'],
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
                    'Fuel  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
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
                    'Fuel  ' + params.value + (params.seriesData.length ? '：' + params.seriesData[0].data : '')
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
            name: 'Fuel Chart',
            type: 'line',
            smooth: true,
            data: fuels,
          },
        ],
      };
    });
  }
}
