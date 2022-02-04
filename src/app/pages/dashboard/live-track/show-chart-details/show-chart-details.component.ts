import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbThemeService } from '@nebular/theme';
import { SingleCustomDeviceDetail } from '../../../../@theme/components/Model/SingleCustomDeviceReportStatsResponse';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-show-chart-details',
  templateUrl: './show-chart-details.component.html',
  styleUrls: ['./show-chart-details.component.scss']
})
export class ShowChartDetailsComponent implements OnInit {

  bar: any = {};
  themeSubscription: any;

  report_date: string[] = []
  total_distance: string[] = []
  total_travel_time: string[] = []
  max_speed: string[] = []
  avg_speed: string[] = []

  chart_name = localStorage.getItem("CHART_NAME")
  chart_name_formatted = ""

  constructor(private theme: NbThemeService,
    @Inject(MAT_DIALOG_DATA) data: SingleCustomDeviceDetail[],
    private uTrackService: UtrackService) {

    data.forEach(element => {

      this.report_date.push(element.report_date)
      this.total_distance.push(element.total_distance)
      this.total_travel_time.push(element.total_travelled_time)
      this.max_speed.push(element.max_speed)
      this.avg_speed.push(element.avg_speed)
    })
    switch (this.chart_name) {
      case "AVG_SPEED":
        this.chart_name = 'AVERAGE SPEED'
        this.updateChartData(this.report_date, this.avg_speed);
        this.chart_name_formatted = 'Last 7 Days Average Speed in KMPH'
        break;

      case "MAX_SPEED":
        this.chart_name = 'MAX SPEED'
        this.updateChartData(this.report_date, this.max_speed);
        this.chart_name_formatted = 'Last 7 Days Max Speed in KMPH'
        break;

      case "TRAVEL_TIME":
        this.chart_name = 'TRAVEL TIME'
        this.updateChartData(this.report_date, this.total_travel_time);
        this.chart_name_formatted = 'Last 7 Days Travel Time in Minutes'
        break;

      case "DISTANCE":
        this.chart_name = 'DISTANCE'
        this.updateChartData(this.report_date, this.total_distance);
        this.chart_name_formatted = 'Last 7 Days Distance Travelled in Kilometers'
        break;
    }
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
  
  }


  updateChartData(date: string[], distance: string[]) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.bar = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: date,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
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
            name: this.chart_name,
            type: 'bar',
            barWidth: '60%',
            data: distance,
          },
        ],
      };
    });

  }
  ngAfterViewInit() {
  }



  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

}
