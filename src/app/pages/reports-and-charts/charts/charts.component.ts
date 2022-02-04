import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { DatePipe, Location } from '@angular/common';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { NbThemeService } from '@nebular/theme';
import { NewAllDeviceReportStatsResponse } from '../../../@theme/components/Model/NewAllDeviceReportStatsResponse';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HomeData } from '../../../@theme/components/Model/Home';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { DateUtils } from '../../../@theme/components/Services/date_utils';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};

@Component({
  selector: 'ngx-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],

})
export class ChartsComponent implements OnDestroy, AfterViewInit {

  vehiclestatusChart: any = {};
  KMTravelledChart: any = {};
  MonthKMTravelledChart: any = {};
  themeSubscription: any;

  HOME_DATA: HomeData[];

  movingVehicle = 0;
  stoppedVehicle = 0;
  dataNotFoundVehicle = 0;

  todayDate = new Date().getTime();
  currentDate = new Date();
  MaxDate = new Date();
  currentMonthDate = new Date();
  interval: NodeJS.Timeout;

  constructor(private location: Location,
    private headerService: HeaderInteractorService,
    private theme: NbThemeService,
    private uTrackService: UtrackService,
  ) {

  }

  public pieChartLabels: string[] = ['Moving', 'Stopped', 'DataNotFound'];
  public pieChartData: number[] = [40, 20, 35];
  public pieChartType: string = 'doughnut';
  // events
  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Charts Report');
    this.home();
    this.getTodayKmReport();
  }


  home() {
    clearTimeout(this.interval)
    this.uTrackService.getHomeWebService().subscribe(response => {
      this.HOME_DATA = [];
      this.dataNotFoundVehicle = 0;
      this.stoppedVehicle = 0;
      this.movingVehicle = 0;
      if (response.status) {
        this.HOME_DATA = response.data
        this.HOME_DATA.forEach(data => {
          this.todayDate = new Date().getTime();
          if (data.devicetime == null || data.devicetime == undefined || data.devicetime == "" ||
            data.fixtime == null || data.fixtime == undefined || data.fixtime == "") {
            this.dataNotFoundVehicle = this.dataNotFoundVehicle + 1;
          } else {
            let lastTravelTime = Date.parse(data.devicetime);
            if ((this.todayDate - lastTravelTime) > 7200000) {
              this.dataNotFoundVehicle = this.dataNotFoundVehicle + 1;
            }
            else {
              if (Number(data.speed) > 0) {
                if (lastTravelTime - Date.parse(data.fixtime) > 1800000) {
                  this.stoppedVehicle = this.stoppedVehicle + 1
                } else {
                  this.movingVehicle = this.movingVehicle + 1
                }
              } else {
                this.stoppedVehicle = this.stoppedVehicle + 1
              }
            }
          }
        })
        this.setVehicleStatusChartData();
      }
    })
  }

  setVehicleStatusChartData() {
    this.vehiclestatusChart = {
      backgroundColor: echarts.bg,
      color: ['#60C225', '#DF2626', '#EEC70E'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['Moving', 'Stopped', 'Ideal'],
        textStyle: {
          color: '#393e46',
        },
      },
      series: [
        {
          name: 'Vehicle Status',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          data: [
            { value: this.movingVehicle, name: 'Moving' },
            { value: this.stoppedVehicle, name: 'Stopped' },
            { value: this.dataNotFoundVehicle, name: 'Ideal' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: echarts.itemHoverShadowColor,
            },
          },
          label: {
            normal: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
          },
        },
      ],
    };

  }

  getTodayKmReport() {
    this.uTrackService.new_all_device_report_stats(DateUtils.getServerDateFromDate(this.currentDate)).subscribe(response => {
      this.setTodayKMChartData(response);
      this.setMonthKMChartData(response);
    })
  }

  KM_Date_chart_api(event) {
    var date = new Date(event.value);
    this.uTrackService.new_all_device_report_stats(DateUtils.getServerDateFromDate(date)).subscribe(response => {
      this.setTodayKMChartData(response);
    })
  }

  Month_KM_Chart_api(event) {
    var month_date = new Date(event.value);
    this.uTrackService.new_all_device_report_stats(DateUtils.getServerDateFromDate(month_date)).subscribe(response => {
      this.setMonthKMChartData(response);
    })
  }


  setTodayKMChartData(respone: NewAllDeviceReportStatsResponse) {
    var val_0_50 = 0, val_50_100 = 0, val_100_200 = 0, val_200_300 = 0, val_300_above = 0;
    if (respone.status && respone.data != null && respone.data != undefined && respone.data.length > 0) {
      respone.data.forEach(element => {
        var formatDistance: number
        formatDistance = Number(element.today.total_distance) / 1000
        if (formatDistance < 50) {
          val_0_50 = val_0_50 + 1;
        } else if (formatDistance < 100) {
          val_50_100 = val_50_100 + 1;
        } else if (formatDistance < 200) {
          val_100_200 = val_100_200 + 1;
        } else if (formatDistance < 300) {
          val_200_300 = val_200_300 + 1;
        } else {
          val_300_above = val_300_above + 1;
        }
      })
    }

    this.KMTravelledChart = {
      backgroundColor: echarts.bg,
      color: ['#F73012', '#003927', '#262E30', '#8F7435', '#F5C009'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'horizontal',
        left: 'left',
        data: ['0-50 KM', '50-100 KM', '100-200 KM', '200-300 KM', '> 300 KM'],
        textStyle: {
          color: '#393e46',
        },
      },
      series: [
        {
          name: 'Kilometer Travelled',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          data: [
            { value: val_0_50, name: '0-50 KM' },
            { value: val_50_100, name: '50-100 KM' },
            { value: val_100_200, name: '100-200 KM' },
            { value: val_200_300, name: '200-300 KM' },
            { value: val_300_above, name: '> 300 KM' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: echarts.itemHoverShadowColor,
            },
          },
          label: {
            normal: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
          },
        },
      ],
    };
  }

  setMonthKMChartData(respone: NewAllDeviceReportStatsResponse) {
    var val_month_0_500 = 0, val_month_500_1000 = 0, val_month_1000_2000 = 0, val_month_2000_4000 = 0, val_month_4000_6000 = 0, val_month_6000_above = 0;
    if (respone.status && respone.data != null && respone.data != undefined && respone.data.length > 0) {
      respone.data.forEach(element => {
        var formatDistance: number
        formatDistance = Number(element.this_month.total_distance) / 1000
        if (formatDistance < 500) {
          val_month_0_500 = val_month_0_500 + 1;
        } else if (formatDistance < 1000) {
          val_month_500_1000 = val_month_500_1000 + 1;
        } else if (formatDistance < 2000) {
          val_month_1000_2000 = val_month_1000_2000 + 1;
        } else if (formatDistance < 4000) {
          val_month_2000_4000 = val_month_2000_4000 + 1;
        } else if (formatDistance < 6000) {
          val_month_4000_6000 = val_month_4000_6000 + 1;
        } else {
          val_month_6000_above = val_month_6000_above + 1;
        }
      })
    }

    this.MonthKMTravelledChart = {
      backgroundColor: echarts.bg,
      color: ['#E62565', '#587BF8', '#1EAAF1', '#8CC152', '#9B2FAE', '#785549'],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['0-500 KM', '500-1000 KM', '1000-2000 KM', '2000-4000 KM', '4000-6000 KM', '> 6000 KM',],
        textStyle: {
          color: '#393e46',
        },
      },
      series: [
        {
          name: 'Month Kilometer Travelled',
          type: 'pie',
          radius: '80%',
          center: ['50%', '50%'],
          data: [
            { value: val_month_0_500, name: '0-500 KM' },
            { value: val_month_500_1000, name: '500-1000 KM' },
            { value: val_month_1000_2000, name: '1000-2000 KM' },
            { value: val_month_2000_4000, name: '2000-4000 KM' },
            { value: val_month_4000_6000, name: '4000-6000 KM' },
            { value: val_month_6000_above, name: '> 6000 KM' },
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: echarts.itemHoverShadowColor,
            },
          },
          label: {
            normal: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
          },
        },
      ],
    };
  }


  back() {
    this.location.back();
  }


  ngAfterViewInit(): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;
      const echarts: any = config.variables.echarts;
    });
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
    clearTimeout(this.interval)
  }

}
