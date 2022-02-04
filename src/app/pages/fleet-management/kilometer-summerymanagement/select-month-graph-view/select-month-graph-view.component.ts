import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-select-month-graph-view',
  templateUrl: './select-month-graph-view.component.html',
  styleUrls: ['./select-month-graph-view.component.scss']
})
export class SelectMonthGraphViewComponent implements OnInit {


  distanceArray = [];
  vehicleNumberArray = [];

  selectMonthViewGrapBarChartoptions: any = {};
  selectMonthViewGraphBarChart: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public selectMonthViewData: any,
    private theme: NbThemeService,
  ) {

  }

  ngOnInit(): void {
    this.selectMonthViewGraphData();
  }

  selectMonthViewGraphData() {

    this.distanceArray = [];
    this.vehicleNumberArray = [];

    const bar_colors = [
      '#9242cf', '#00CC00', '#080aff',
      '#fa163f', '#32dbc6', '#00bfff',
      '#0040ff', '#8000ff', '#ff00bf',
      '#ff0040', '#1089ff', '#00CC00',
      '#080aff', '#fa163f', '#32dbc6',
      '#00bfff', '#0040ff', '#8000ff',
      '#ff00bf', '#ff0040', '#1089ff',
      '#00CC00', '#080aff', '#fa163f',
      '#32dbc6', '#00bfff', '#0040ff',
      '#8000ff', '#ff00bf', '#ff0040', '#8000ff'
    ]

    let i = 1;
    this.selectMonthViewData.forEach((row => {
      this.vehicleNumberArray.push(row.vehicle_number);
      const this_today_val = {
        value: row.this_month.total_distance,
        itemStyle: {
          color: bar_colors[i % 10],
        }
      }
      this.distanceArray.push(this_today_val);
      i++;
    }))
    this.barChart(this.distanceArray, this.vehicleNumberArray);
  }

  barChart(distanceArray, vehicleNumberArray) {
    this.selectMonthViewGraphBarChart = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;
      this.selectMonthViewGrapBarChartoptions = {
        backgroundColor: echarts.bg,
        color: ['#0f4c75'],
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
            data: vehicleNumberArray,
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
            name: 'KMS',
            type: 'bar',
            barWidth: '45%',
            data: distanceArray,
          },
        ],
      };
    });
  }


}
