import { Component, ViewChild, ElementRef, OnInit, Inject } from '@angular/core';
import { NbThemeService, NbToastrService } from '@nebular/theme';
import { HeaderInteractorService } from '../../@theme/components/Services/header-interactor.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../@theme/components/Services/Utrack.service';
import { MygroupListResponseData } from '../../@theme/components/Model/MygroupListRespones';
import { NewAllDeviceReportStatsResponse } from '../../@theme/components/Model/NewAllDeviceReportStatsResponse';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { OpenDetailsComponent } from './open-details/open-details.component';
import { HomeLiteData } from '../../@theme/components/Model/HomeLite';
import { CurrentDevicePositionResponse } from '../../@theme/components/Model/CurrentDevicePositionResponse';

import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ShowChartVehicleListComponent } from './show-chart-vehicle-list/show-chart-vehicle-list.component';
import { MatCheckboxChange } from '@angular/material/checkbox';
// excel import paclage
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDatepicker } from '@angular/material/datepicker';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { States } from '../../@theme/components/Model/StateRessponse';
import { DateUtils } from '../../@theme/components/Services/date_utils';
import { PdfUtils } from '../../@theme/components/Services/pdf_utils';
import { Base64ImageConstants } from '../../@theme/components/Services/image_constants';
import { TranslateService } from '@ngx-translate/core';
import { Home_V1_Data } from '../../@theme/components/Model/Home_v1_Response';

export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },

};

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },

  ],
})
export class DashboardComponent implements OnInit {

  step = 0;

  panelOpenState = false;

  ListTableDataNotshow: boolean;
  MapTableDataNotshow: boolean;
  TripDashBoardTableDataNotshow: boolean;
  mapNoDataFound: boolean;

  userName = localStorage.getItem('FIRST_NAME') + ' ' + localStorage.getItem('LAST_NAME');
  userPicture = localStorage.getItem('PROFILE_IMAGE');

  driverDetails = [];

  vehiclestatusChart: any = {};
  KMTravelledChart: any = {};
  MonthKMTravelledChart: any = {};
  themeSubscription: any;
  top_travelled_vehicles: any = {};
  Chart1: any = {};
  Chart2: any = {};

  totaltempval: any;
  totalfuelval: any;

  markersArray: google.maps.Marker[] = [];
  infoWindowsArray: google.maps.InfoWindow[] = [];

  // Vehicle Status
  totalVehicle = 0;
  movingVehicle = 0;
  stoppedVehicle = 0;
  dataNotFoundVehicle = 0;
  power_status = 0;

  // Asset Types
  VEHICLE_CAR = 0;
  VEHICLE_BUS = 0;
  VEHICLE_TRUCK = 0;
  VEHICLE_AUTO = 0;
  VEHICLE_BIKE = 0;
  VEHICLE_MOBILE = 0;
  VEHICLE_ID_CARD = 0;
  VEHICLE_TRAIN = 0;
  VEHICLE_SCOOTY = 0;

  // Product Types

  basic = 0;
  magnetic = 0;
  mobile = 0;
  idCard = 0;
  temperature = 0;
  obd = 0;
  carStereo = 0;
  fuel = 0;
  FuelTemp = 0;


  // Vehicles Map Count State Vise
  AndhraPradesh: number = 0;
  West_Bengal: number = 0;
  Maharashtra: number = 0;
  Uttar_Pradesh: number = 0;
  Chandigarh: number = 0;
  Uttarakhand: number = 0;
  Punjab: number = 0;
  Himachal_Pradesh: number = 0;
  JammuAndKashmir: number = 0;
  Ladakh: number = 0;
  Jharkhand: number = 0;
  Bihar: number = 0;
  Sikkim: number = 0;
  Haryana: number = 0;
  Delhi: number = 0;
  Rajasthan: number = 0;
  AndamanAndNicobarIslands: number = 0;
  Tripura: number = 0;
  Manipur: number = 0;
  Meghalaya: number = 0;
  Nagaland: number = 0;
  Assam: number = 0;
  ArunachalPradesh: number = 0;
  Lakshadweep: number = 0;
  Puducherry: number = 0;
  DadraAndNagarHaveliAndDamanAndDiu: number = 0;
  Telangana: number = 0;
  Kerala: number = 0;
  Goa: number = 0;
  Karnataka: number = 0;
  Odisha: number = 0;
  Gujarat: number = 0;
  Chhattisgarh: number = 0;
  MadhyaPradesh: number = 0;
  TamilNadu: number = 0;
  Mizoram: number = 0;

  todayDate = new Date().getTime();
  currentDate = new Date();
  currentMonthDate = new Date();
  maxDate = new Date();

  ELEMENT_DATA: Home_V1_Data[] = [];
  MAP_ELEMENT_DATA: Home_V1_Data[] = [];
  HOME_DATA: Home_V1_Data[];
  FILTERED_HOME_DATA: Home_V1_Data[] = [];
  ELEMENT_DATA_TRIP_DASHBOARD: Home_V1_Data[] = [];
  ELEMENT_DATA_STATES: States[] = [];

  displayedColumns: string[] = ['id', 'vehicle_number', 'vehicle_type', 'speed', 'last_location', 'last_state', 'last_district', 'fixtime', 'last_running_time', 'driver_name', 'driver_number', 'fuel_point', 'tank_size', 'temp1'];
  dataSource = new MatTableDataSource<Home_V1_Data>(this.ELEMENT_DATA);

  chartdisplayedColumns: string[] = ['id', 'vehicle_number', 'vehicle_type', 'last_location'];
  chartdataSource = new MatTableDataSource<Home_V1_Data>(this.ELEMENT_DATA);

  mapdisplayedColumns: string[] = ['id', 'vehicle_number', 'vehicle_type'];
  mapdataSource = new MatTableDataSource<Home_V1_Data>(this.MAP_ELEMENT_DATA);

  tripdisplayedColumns: string[] = ['id', 'vehicle_number', 'vehicle_type', 'speed', 'last_location', 'fixtime', 'driver_name', 'driver_number', 'trip_code', 'customer', 'route_name', 'start_date', 'eta', 'p_eta', 't_kms', 't_days', 'travel_remaining', '24kms', 'currentdatetime', 'status'];
  tripDataSource = new MatTableDataSource<Home_V1_Data>(this.ELEMENT_DATA_TRIP_DASHBOARD);


  state_table_columns: string[] = ['sno', 'state_name', 'vehicles_count'];
  stateTableDataSource = new MatTableDataSource<States>(this.ELEMENT_DATA_STATES);


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('content') content: ElementRef;

  constructor(private headerService: HeaderInteractorService,
    private routes: Router,
    private activatedRoute: ActivatedRoute,

    private uTrackService: UtrackService,
    private theme: NbThemeService,
    private dialog: MatDialog,
    private toasterService: NbToastrService,
    @Inject(DOCUMENT) private document: any,
  ) {

  }

  // Exit and Full Screen
  elem;

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Pragati Utrack');
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.tripDataSource.paginator = this.paginator;
    this.tripDataSource.sort = this.sort;
    this.stateTableDataSource.sort = this.sort;
    this.getMyGroupList();
    this.getTodayKmReport();
    this.getStateList();
    this.elem = document.documentElement;
    this.setChart1Data();
    this.setChart2Data();

    switch (localStorage.getItem('DASHBOARD_DISPLAY_TAB')) {
      case 'Dashboard Report':
        this.selectedIndex = 0
        break;
      case 'List View':
        this.selectedIndex = 1
        break;
      case 'Map View':
        this.selectedIndex = 2
        setTimeout(() => {
          this.mapTab({ index: 2 });
        }, 500);
        break;
      case 'Trip Dashboard':
        this.selectedIndex = 3
        break;
      case 'Products & Assets':
        this.selectedIndex = 4
        break;

      default:
        this.selectedIndex = 0
        break;
    }
  }

  map: any;
  data: CurrentDevicePositionResponse;

  course: string;
  marker: any;

  latitudedata: string;
  longitudedata: string;
  speed: string;
  device_time: any;
  Location: string;

  selectedRow: HomeLiteData;
  deviceLinkId: string;
  deviceId: string;
  vehicle_type: string;
  product_type: string;
  selected = '0';
  interval: NodeJS.Timeout;

  changeMapType(value) {
    this.map.setMapTypeId(value);
  }

  getStateList() {
    this.uTrackService.getStates().subscribe(response => {
      if (response.status) {
        response.data.forEach(data => {
          data.vehicles_count = 0;
        });
        this.ELEMENT_DATA_STATES = response.data;
        this.stateTableDataSource.data = this.ELEMENT_DATA_STATES;
        this.home();
      }
    });
  }

  updateIndMapData() {

    this.ELEMENT_DATA_STATES.forEach(data => {
      switch (data.state) {
        case 'Andaman & Nicobar Islands': this.AndamanAndNicobarIslands = data.vehicles_count;
          break;
        case 'Andhra Pradesh': this.AndhraPradesh = data.vehicles_count;
          break;
        case 'Arunachal Pradesh': this.ArunachalPradesh = data.vehicles_count;
          break;
        case 'Assam': this.Assam = data.vehicles_count;
          break;
        case 'Bihar': this.Bihar = data.vehicles_count;
          break;
        case 'Chandigarh': this.Chandigarh = data.vehicles_count;
          break;
        case 'Chattisgarh': this.Chhattisgarh = data.vehicles_count;
          break;
        case 'Dadra & Nagar Haveli': this.DadraAndNagarHaveliAndDamanAndDiu = data.vehicles_count;
          break;
        case 'Delhi': this.Delhi = data.vehicles_count;
          break;
        case 'Goa': this.Goa = data.vehicles_count;
          break;
        case 'Gujarat': this.Gujarat = data.vehicles_count;
          break;
        case 'Haryana': this.Haryana = data.vehicles_count;
          break;
        case 'Himachal Pradesh': this.Himachal_Pradesh = data.vehicles_count;
          break;
        case 'Jammu & Kashmir': this.JammuAndKashmir = data.vehicles_count;
          break;
        case 'Jharkhand': this.Jharkhand = data.vehicles_count;
          break;
        case 'Karnataka': this.Karnataka = data.vehicles_count;
          break;
        case 'Kerala': this.Kerala = data.vehicles_count;
          break;
        case 'Lakshadweep': this.Lakshadweep = data.vehicles_count;
          break;
        case 'Madhya Pradesh': this.MadhyaPradesh = data.vehicles_count;
          break;
        case 'Maharashtra': this.Maharashtra = data.vehicles_count;
          break;
        case 'Manipur': this.Manipur = data.vehicles_count;
          break;
        case 'Meghalaya': this.Meghalaya = data.vehicles_count;
          break;
        case 'Mizoram': this.Mizoram = data.vehicles_count;
          break;
        case 'Nagaland': this.Nagaland = data.vehicles_count;
          break;
        case 'Odisha': this.Odisha = data.vehicles_count;
          break;
        case 'Pondicherry': this.Puducherry = data.vehicles_count;
          break;
        case 'Punjab': this.Punjab = data.vehicles_count;
          break;
        case 'Rajasthan': this.Rajasthan = data.vehicles_count;
          break;
        case 'Sikkim': this.Sikkim = data.vehicles_count;
          break;
        case 'Tamil Nadu': this.TamilNadu = data.vehicles_count;
          break;
        case 'Telangana': this.Telangana = data.vehicles_count;
          break;
        case 'Tripura': this.Tripura = data.vehicles_count;
          break;
        case 'Uttar Pradesh': this.Uttar_Pradesh = data.vehicles_count;
          break;
        case 'Uttarakhand': this.Uttarakhand = data.vehicles_count;
          break;
        case 'West Bengal': this.West_Bengal = data.vehicles_count;
          break;
      }
    });
    this.ELEMENT_DATA_STATES.sort((a, b) => (a.vehicles_count > b.vehicles_count) ? -1 : 1);

    this.stateTableDataSource.data = this.ELEMENT_DATA_STATES;
  }

  topTravelledVehiclesbarChart(respone: NewAllDeviceReportStatsResponse) {

    const vehicle_numbers = [];
    const vehicle_km = [];
    const bar_colors = [
      '#00bfff', '#0040ff', '#8000ff',
      '#ff00bf', '#ff0040', '#1089ff',
      '#00CC00', '#080aff', '#fa163f', '#303960'];
    if (respone.status && respone.data != null && respone.data !== undefined && respone.data.length > 0) {

      respone.data.forEach(element => {
        try {
          element.dashboard_bar_chart_kms = Math.round((Number(element.today.total_distance) / 1000));
        } catch (error) {
          element.dashboard_bar_chart_kms = 0;
        }
      });
      let size = respone.data.length;
      if (size > 10) {
        size = 10;
        respone.data.sort((a, b) => (a.dashboard_bar_chart_kms > b.dashboard_bar_chart_kms) ? -1 : 1);
      }
      for (let i = 0; i < size; i++) {
        const element = respone.data[i];
        vehicle_numbers.push(element.vehicle_number);

        const top_travel_km_val = {
          value: element.dashboard_bar_chart_kms,
          itemStyle: {
            color: bar_colors[i % 10],
          }
        }
        vehicle_km.push(top_travel_km_val);
      }
    }



    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.top_travelled_vehicles = {
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
            data: vehicle_numbers,
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
            barWidth: '60%',
            data: vehicle_km,
          },
        ],
      };
    });
  }

  dashboardTabVehicleFilter(value) {
    this.removeMarkers();
    switch (value) {
      case '0': this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Total');
        this.filterDataProcessMapTab(0);
        this.filterDataProcessTripDashboardTab(0);
        break;
      case '1': this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Moving');
        this.filterDataProcessMapTab(1);
        this.filterDataProcessTripDashboardTab(1);
        break;
      case '2': this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Stopped');
        this.filterDataProcessMapTab(2);
        this.filterDataProcessTripDashboardTab(2);
        break;
      case '3': this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Ideal');
        this.filterDataProcessMapTab(3);
        this.filterDataProcessTripDashboardTab(3);
        break;
    }

  }

  // mapTabVehicleFilter(value) {
  //   this.removeMarkers();
  //   switch (value) {
  //     case '0': this.filterDataProcessMapTab(0);
  //       this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Total');
  //       this.filterDataProcessTripDashboardTab(0);
  //       break;
  //     case '1': this.filterDataProcessMapTab(1);
  //       this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Moving');
  //       this.filterDataProcessTripDashboardTab(1);
  //       break;
  //     case '2': this.filterDataProcessMapTab(2);
  //       this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Stopped');
  //       this.filterDataProcessTripDashboardTab(2);
  //       break;
  //     case '3': this.filterDataProcessMapTab(3);
  //       this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Ideal');
  //       this.filterDataProcessTripDashboardTab(3);
  //       break;
  //   }
  // }

  // tripdashboardTabVehicleFilter(value) {
  //   switch (value) {
  //     case '0': this.filterDataProcessMapTab(0);
  //       this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Total');
  //       this.filterDataProcessTripDashboardTab(0);
  //       break;
  //     case '1': this.filterDataProcessMapTab(1);
  //       this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Moving');
  //       this.filterDataProcessTripDashboardTab(1);
  //       break;
  //     case '2': this.filterDataProcessMapTab(2);
  //       this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Stopped');
  //       this.filterDataProcessTripDashboardTab(2);
  //       break;
  //     case '3': this.filterDataProcessMapTab(3);
  //       this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Ideal');
  //       this.filterDataProcessTripDashboardTab(3);
  //       break;
  //   }
  // }

  isSelectedMapTab: boolean = false;
  isChangedTabProgramatically: boolean = false;

  mapTab($event) {
    if ($event.index === 2) {
      this.isSelectedMapTab = true;
      if (this.map == null || this.map === undefined) {
        this.map = new google.maps.Map(document.getElementById('livemap'), {
          zoom: 16,
          center: {
            lat: 17.438557777777778,
            lng: 78.39158222222223,
          },
          disableDefaultUI: true,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        });
        this.drawMarkersOnMap();
      } else {
        this.drawMarkersOnMap();
      }
    } else {
      this.isSelectedMapTab = false;
    }

    if ($event.index === 1) {
      if (!this.isChangedTabProgramatically)
        this.filterDataProcessDashboardTab('VEHICLE_STATUS', 'Total');
    }
    this.isChangedTabProgramatically = false;

    if ($event.index === 3) {
      switch (this.selected) {
        case '0': this.filterDataProcessTripDashboardTab(0);
          break;
        case '1': this.filterDataProcessTripDashboardTab(1);
          break;
        case '2': this.filterDataProcessTripDashboardTab(2);
          break;
        case '3': this.filterDataProcessTripDashboardTab(3);
          break;
      }
    }
  }

  isShowInfoWIndow: boolean = false;
  showLabel(event: MatCheckboxChange) {
    this.isShowInfoWIndow = event.checked;
    this.infoWindowShowAndHide();
  }

  infoWindowShowAndHide() {
    if (this.markersArray.length > 0) {
      for (let j = 0; j < this.markersArray.length; j++) {
        if (this.infoWindowsArray[j] != null) {
          const infowindow = this.infoWindowsArray[j];
          if (this.isShowInfoWIndow) {
            infowindow.open(this.map, this.markersArray[j]);
          } else {
            infowindow.close();
          }
        }
      }
      this.mapOnMarkerZoom();
    }
  }

  removeMarkers() {
    if (this.markersArray.length > 0) {
      for (let i = 0; i < this.markersArray.length; i++) {
        this.markersArray[i].setMap(null);
      }
      this.markersArray = [];
      this.infoWindowsArray = [];
    }
  }

  drawMarkersOnMap() {

    if (this.MAP_ELEMENT_DATA != null && this.MAP_ELEMENT_DATA.length > 0) {

      if (this.markersArray.length > 0) {

        const size = this.MAP_ELEMENT_DATA.length;
        for (var j = 0; j < size; j++) {
          var row = this.MAP_ELEMENT_DATA[j];

          if ('0' !== row.latitude && '0' !== row.longitude) {

            var mapImage = '';
            var course = String(Number(row.course) / 10);
            var live_position_value = parseInt(course) * 10;

            if (row.speed && row.devicetime && row.fixtime &&
              ((new Date()).getTime() - (new Date(row.devicetime)).getTime()) < 7200000) {

              if (Number(row.speed) > 0) {

                switch (row.vehicle_type) {

                  case 'Car':
                    mapImage = 'assets/images/green-car/car_g_' + live_position_value + '.png';
                    break;

                  case 'Bus':
                    mapImage = 'assets/images/bus/bus_g_' + live_position_value + '.png';
                    break;

                  case 'Truck':
                    mapImage = 'assets/images/all-trucks/truck_g_' + live_position_value + '.png';
                    break;

                  case 'Auto':
                    mapImage = 'assets/images/auto/auto_g_' + live_position_value + '.png';
                    break;

                  case 'Bike':
                    mapImage = 'assets/images/bike/bike_g_' + live_position_value + '.png';
                    break;

                  case 'Mobile':
                    mapImage = 'assets/images/map_icons/marker_type_green_mobile.png';
                    break;

                  case 'IdCard':
                    mapImage = 'assets/images/map_icons/marker_type_green_id.png';
                    break;

                  case 'Scooty':
                    mapImage = 'assets/images/scooty/scooty_g_' + live_position_value + '.png';
                    break;

                  case 'Train':
                    mapImage = 'assets/images/train/train_g_' + live_position_value + '.png';
                    break;

                }

              } else if (Number(row.speed) === 0) {

                switch (row.vehicle_type) {

                  case 'Car':
                    mapImage = 'assets/images/red-car/car_r_' + live_position_value + '.png';
                    break;

                  case 'Bus':
                    mapImage = 'assets/images/bus/bus_r_' + live_position_value + '.png';
                    break;

                  case 'Truck':
                    mapImage = 'assets/images/all-trucks/truck_r_' + live_position_value + '.png';
                    break;

                  case 'Auto':
                    mapImage = 'assets/images/auto/auto_r_' + live_position_value + '.png';
                    break;

                  case 'Bike':
                    mapImage = 'assets/images/bike/bike_r_' + live_position_value + '.png';
                    break;

                  case 'Mobile':
                    mapImage = 'assets/images/map_icons/marker_type_red_mobile.png';
                    break;

                  case 'IDCard':
                    mapImage = 'assets/images/map_icons/marker_type_red_id.png';
                    break;

                  case 'Scooty':
                    mapImage = 'assets/images/scooty/scooty_r_' + live_position_value + '.png';
                    break;

                  case 'Train':
                    mapImage = 'assets/images/train/train_r_' + live_position_value + '.png';
                    break;

                }

              }

            } else {

              switch (row.vehicle_type) {

                case 'Car':
                  mapImage = 'assets/images/yellow-car/car_y_' + live_position_value + '.png';
                  break;

                case 'Bus':
                  mapImage = 'assets/images/bus/bus_y_' + live_position_value + '.png';
                  break;

                case 'Truck':
                  mapImage = 'assets/images/all-trucks/truck_y_' + live_position_value + '.png';
                  break;

                case 'Auto':
                  mapImage = 'assets/images/auto/auto_y_' + live_position_value + '.png';
                  break;

                case 'Bike':
                  mapImage = 'assets/images/bike/bike_y_' + live_position_value + '.png';
                  break;

                case 'Mobile':
                  mapImage = 'assets/images/map_icons/marker_type_yellow_mobile.png';
                  break;

                case 'IDCard':
                  mapImage = 'assets/images/map_icons/marker_type_yellow_id.png';
                  break;

                case 'Scooty':
                  mapImage = 'assets/images/scooty/scooty_y_' + live_position_value + '.png';
                  break;

                case 'Train':
                  mapImage = 'assets/images/train/train_y_' + live_position_value + '.png';
                  break;

              }

            }

            const marker: google.maps.Marker = this.markersArray[j];
            marker.setPosition(new google.maps.LatLng(parseFloat(row.latitude), parseFloat(row.longitude)));
            marker.setIcon(mapImage);

          }

        }

      } else {
        const size = this.MAP_ELEMENT_DATA.length;
        for (let j = 0; j < size; j++) {
          // tslint:disable-next-line: no-shadowed-variable
          const row = this.MAP_ELEMENT_DATA[j];
          if ('0' !== row.latitude && '0' !== row.longitude) {

            // tslint:disable-next-line: no-shadowed-variable
            let mapImage = '';
            // tslint:disable-next-line: no-shadowed-variable
            const course = String(Number(row.course) / 10);
            const live_position_value = parseInt(course) * 10;

            if (row.speed && row.devicetime && row.fixtime &&
              ((new Date()).getTime() - (new Date(row.devicetime)).getTime()) < 7200000) {

              if (Number(row.speed) > 0) {

                switch (row.vehicle_type) {

                  case 'Car':
                    mapImage = 'assets/images/green-car/car_g_' + live_position_value + '.png';
                    break;

                  case 'Bus':
                    mapImage = 'assets/images/bus/bus_g_' + live_position_value + '.png';
                    break;

                  case 'Truck':
                    mapImage = 'assets/images/all-trucks/truck_g_' + live_position_value + '.png';
                    break;

                  case 'Auto':
                    mapImage = 'assets/images/auto/auto_g_' + live_position_value + '.png';
                    break;

                  case 'Bike':
                    mapImage = 'assets/images/bike/bike_g_' + live_position_value + '.png';
                    break;

                  case 'Mobile':
                    mapImage = 'assets/images/map_icons/marker_type_green_mobile.png';
                    break;

                  case 'IdCard':
                    mapImage = 'assets/images/map_icons/marker_type_green_id.png';
                    break;

                  case 'Scooty':
                    mapImage = 'assets/images/scooty/scooty_g_' + live_position_value + '.png';
                    break;

                  case 'Train':
                    mapImage = 'assets/images/train/train_g_' + live_position_value + '.png';
                    break;

                }

              } else if (Number(row.speed) === 0) {

                switch (row.vehicle_type) {

                  case 'Car':
                    mapImage = 'assets/images/red-car/car_r_' + live_position_value + '.png';
                    break;

                  case 'Bus':
                    mapImage = 'assets/images/bus/bus_r_' + live_position_value + '.png';
                    break;

                  case 'Truck':
                    mapImage = 'assets/images/all-trucks/truck_r_' + live_position_value + '.png';
                    break;

                  case 'Auto':
                    mapImage = 'assets/images/auto/auto_r_' + live_position_value + '.png';
                    break;

                  case 'Bike':
                    mapImage = 'assets/images/bike/bike_r_' + live_position_value + '.png';
                    break;

                  case 'Mobile':
                    mapImage = 'assets/images/map_icons/marker_type_red_mobile.png';
                    break;

                  case 'IDCard':
                    mapImage = 'assets/images/map_icons/marker_type_red_id.png';
                    break;

                  case 'Scooty':
                    mapImage = 'assets/images/scooty/scooty_r_' + live_position_value + '.png';
                    break;

                  case 'Train':
                    mapImage = 'assets/images/train/train_r_' + live_position_value + '.png';
                    break;

                }

              }

            } else {

              switch (row.vehicle_type) {

                case 'Car':
                  mapImage = 'assets/images/yellow-car/car_y_' + live_position_value + '.png';
                  break;

                case 'Bus':
                  mapImage = 'assets/images/bus/bus_y_' + live_position_value + '.png';
                  break;

                case 'Truck':
                  mapImage = 'assets/images/all-trucks/truck_y_' + live_position_value + '.png';
                  break;

                case 'Auto':
                  mapImage = 'assets/images/auto/auto_y_' + live_position_value + '.png';
                  break;

                case 'Bike':
                  mapImage = 'assets/images/bike/bike_y_' + live_position_value + '.png';
                  break;

                case 'Mobile':
                  mapImage = 'assets/images/map_icons/marker_type_yellow_mobile.png';
                  break;

                case 'IDCard':
                  mapImage = 'assets/images/map_icons/marker_type_yellow_id.png';
                  break;

                case 'Scooty':
                  mapImage = 'assets/images/scooty/scooty_y_' + live_position_value + '.png';
                  break;

                case 'Train':
                  mapImage = 'assets/images/train/train_y_' + live_position_value + '.png';
                  break;

              }

            }

            // tslint:disable-next-line: no-shadowed-variable
            const marker = new google.maps.Marker({
              position: {
                lat: parseFloat(row.latitude),
                lng: parseFloat(row.longitude),
              },
              map: this.map,
              icon: mapImage,
            });

            marker.set('id', j);

            marker.addListener('click', () => {
              this.map.setZoom(16);
              this.map.setCenter(marker.getPosition());
              this.openDetails(this.MAP_ELEMENT_DATA[marker.get('id')]);
            });

            const infowindow = new google.maps.InfoWindow({
              content: row.vehicle_number,
            });

            this.markersArray.push(marker);
            this.infoWindowsArray.push(infowindow);

          } else {
            this.markersArray.push(null);
            this.infoWindowsArray.push(null);
          }
        }
        this.mapOnMarkerZoom();
      }
    }

  }


  zoomMap() {
    this.mapOnMarkerZoom();
  }

  mapOnMarkerZoom() {

    if (this.map != null && this.markersArray != null && this.markersArray.length > 0) {

      const bounds = new google.maps.LatLngBounds();
      for (let i = 0; i < this.markersArray.length; i++) {
        if (this.markersArray[i] != null)
          bounds.extend(this.markersArray[i].getPosition());
      }

      this.map.setCenter(bounds.getCenter());

      this.map.fitBounds(bounds);

      if (this.map.getZoom() > 15) {
        this.map.setZoom(15);
      }
    }

  }

  openDetails(model_data: Home_V1_Data) {
    const rowData = JSON.stringify(model_data);

    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });

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

  setTodayKMChartData(respone: NewAllDeviceReportStatsResponse) {

    let val_0_50 = 0, val_50_100 = 0, val_100_200 = 0, val_200_300 = 0, val_300_above = 0;

    if (respone.status && respone.data != null && respone.data !== undefined && respone.data.length > 0) {

      respone.data.forEach(element => {
        let formatDistance: number;
        try {
          formatDistance = Number(element.today.total_distance) / 1000;
        } catch (error) {
          formatDistance = 0;
        }


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
      });

    }


    this.KMTravelledChart = {
      backgroundColor: echarts.bg,
      color: ['#D41A1B', '#199823', '#7ED806', '#E86D00', '#851514'],
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

    let val_month_0_500 = 0,
      val_month_500_1000 = 0,
      val_month_1000_2000 = 0,
      val_month_2000_4000 = 0,
      val_month_4000_6000 = 0,
      val_month_6000_above = 0;

    if (respone.status && respone.data != null && respone.data !== undefined && respone.data.length > 0) {

      respone.data.forEach(element => {
        let formatDistance: number;
        try {
          formatDistance = Number(element.this_month.total_distance) / 1000;
        } catch (error) {
          formatDistance = 0;
        }


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
      });

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
        data: ['0-500 KM', '500-1000 KM', '1000-2000 KM', '2000-4000 KM', '4000-6000 KM', '> 6000 KM'],
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

  setChart1Data() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.Chart1 = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['USA', 'Germany', 'France', 'Canada', 'Russia'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Countries',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: 'Germany' },
              { value: 310, name: 'France' },
              { value: 234, name: 'Canada' },
              { value: 135, name: 'Russia' },
              { value: 1548, name: 'USA' },
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
    });
  }

  setChart2Data() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.Chart2 = {
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
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
            name: 'Score',
            type: 'bar',
            barWidth: '60%',
            data: [10, 52, 200, 334, 390, 330, 220],
          },
        ],
      };
    });
  }

  MyGroupList: MygroupListResponseData[];
  isMygroupList: boolean = false;
  getMyGroupList() {
    this.uTrackService.group_list().subscribe(respone => {
      if (respone.status) {
        let i = 0;
        this.isMygroupList = true;
        respone.data.forEach(element => {
          element.groupImagePath = 'assets/images/groups-icons_updated/' + element.group_icon_name + '.png';
          element.groupTotaldeviceListId = element.device_link_id_list.length;
          element.position = String(i);
          i++;
        });
        this.MyGroupList = respone.data;
      } else {
        this.MyGroupList = [];
        this.isMygroupList = false;
      }
    });
  }


  @ViewChild('fullScreen') divRef;

  openFullscreen() {
    // Use this.divRef.nativeElement here to request fullscreen
    document.getElementById('ExitFullScreen').style.display = 'block';
    document.getElementById('fullScreen').style.display = 'none';
    const elem = this.divRef.nativeElement;

    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }

  exitFullscreen() {
    document.getElementById('ExitFullScreen').style.display = 'none';
    document.getElementById('fullScreen').style.display = 'block';
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
  }

  home() {

    clearTimeout(this.interval);

    this.uTrackService.home_v1().subscribe(response => {

      this.HOME_DATA = [];

      // Vehicle Status
      this.totalVehicle = 0;
      this.dataNotFoundVehicle = 0;
      this.stoppedVehicle = 0;
      this.movingVehicle = 0;
      this.power_status = 0;

      // Asset Types
      this.VEHICLE_CAR = 0;
      this.VEHICLE_BUS = 0;
      this.VEHICLE_TRUCK = 0;
      this.VEHICLE_AUTO = 0;
      this.VEHICLE_BIKE = 0;
      this.VEHICLE_MOBILE = 0;
      this.VEHICLE_ID_CARD = 0;
      this.VEHICLE_TRAIN = 0;
      this.VEHICLE_SCOOTY = 0;

      // Product Types
      this.basic = 0;
      this.magnetic = 0;
      this.mobile = 0;
      this.idCard = 0;
      this.temperature = 0;
      this.obd = 0;
      this.carStereo = 0;
      this.fuel = 0;
      this.FuelTemp = 0;

      if (response.status) {


        this.HOME_DATA = response.data;
        this.totalVehicle = Number(this.HOME_DATA.length);

        if (this.ELEMENT_DATA_STATES.length > 0) {
          this.ELEMENT_DATA_STATES.forEach(stateData => {
            stateData.vehicles_count = 0;
          });
        }
        this.HOME_DATA.forEach(data => {

          if (this.ELEMENT_DATA_STATES.length > 0) {
            this.ELEMENT_DATA_STATES.forEach(stateData => {
              if (stateData.state === data.last_state) {
                stateData.vehicles_count = stateData.vehicles_count + 1;
              }
            });
          }

          this.todayDate = new Date().getTime();
          if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
            data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
            this.dataNotFoundVehicle = this.dataNotFoundVehicle + 1;
            data.vehicle_motion_status_color = '#f3c623';
            data.vehicle_motion_status = '0';
          } else {
            const lastTravelTime = Date.parse(data.devicetime);
            if ((this.todayDate - lastTravelTime) > 7200000) {
              if (data.power_status == '0' ) {
                this.power_status = this.power_status + 1;
              }else{
                this.dataNotFoundVehicle = this.dataNotFoundVehicle + 1;
              }
              data.vehicle_motion_status_color = '#f3c623';
              data.vehicle_motion_status = '0';
            } else {
              if (Number(data.speed) > 0) {
                if (lastTravelTime - Date.parse(data.fixtime) > 1800000) {
                  this.stoppedVehicle = this.stoppedVehicle + 1;
                  data.vehicle_motion_status_color = '#ec0101';
                  data.vehicle_motion_status = '1';
                } else {
                  this.movingVehicle = this.movingVehicle + 1;
                  data.vehicle_motion_status_color = '#62760c';
                  data.vehicle_motion_status = '2';
                }
              } else {
                this.stoppedVehicle = this.stoppedVehicle + 1;
                data.vehicle_motion_status_color = '#ec0101';
                data.vehicle_motion_status = '1';
              }
            }
          }

          if (data.driver_name === undefined || data.driver_name === '' || data.driver_name == null) {
            data.driver_details_formatted = '-';
          } else {
            data.driver_details_formatted = data.driver_name + '(' + data.driver_mobile + ')';
          }


          switch (data.vehicle_type) {
            case 'Car': this.VEHICLE_CAR = this.VEHICLE_CAR + 1;

              switch (data.vehicle_motion_status) {
                case '0': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_car.png';
                  break;

                case '1': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_car.png';
                  break;

                case '2': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_car.png';
                  break;
              }


              break;

            case 'Bus': this.VEHICLE_BUS = this.VEHICLE_BUS + 1;
              switch (data.vehicle_motion_status) {
                case '0': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_bus.png';
                  break;

                case '1': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_bus.png';
                  break;

                case '2': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_bus.png';
                  break;
              }
              break;

            case 'Truck': this.VEHICLE_TRUCK = this.VEHICLE_TRUCK + 1;
              switch (data.vehicle_motion_status) {
                case '0': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_truck.png';
                  break;

                case '1': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_truck.png';
                  break;

                case '2': data.vehicle_motion_status_image =
                  'assets/images/data_list_icons/marker_type_green_truck.png';
                  break;
              }
              break;

            case 'Auto': this.VEHICLE_AUTO = this.VEHICLE_AUTO + 1;

              switch (data.vehicle_motion_status) {
                case '0': data.vehicle_motion_status_image =
                  'assets/images/data_list_icons/marker_type_yellow_auto.png';
                  break;

                case '1': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_auto.png';
                  break;

                case '2': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_auto.png';
                  break;
              }
              break;

            case 'Bike': this.VEHICLE_BIKE = this.VEHICLE_BIKE + 1;

              switch (data.vehicle_motion_status) {
                case '0': data.vehicle_motion_status_image =
                  'assets/images/data_list_icons/marker_type_yellow_bike.png';
                  break;

                case '1': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_bike.png';
                  break;

                case '2': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_bike.png';
                  break;
              }
              break;

            case 'Mobile': this.VEHICLE_MOBILE = this.VEHICLE_MOBILE + 1;

              switch (data.vehicle_motion_status) {
                case '0': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_mobile.png';
                  break;

                case '1': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_mobile.png';
                  break;

                case '2': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_mobile.png';
                  break;
              }
              break;

            case 'IDCard': this.VEHICLE_ID_CARD = this.VEHICLE_ID_CARD + 1;

              switch (data.vehicle_motion_status) {
                case '0': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_id.png';
                  break;

                case '1': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_id.png';
                  break;

                case '2': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_id.png';
                  break;
              }
              break;

            case 'Train': this.VEHICLE_TRAIN = this.VEHICLE_TRAIN + 1;

              switch (data.vehicle_motion_status) {
                case '0': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_train_yellow.png';
                  break;

                case '1': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_train_red.png';
                  break;

                case '2': data.vehicle_motion_status_image =
                  'assets/images/data_list_icons/marker_type_train_green.png';
                  break;
              }
              break;

            case 'Scooty': this.VEHICLE_SCOOTY = this.VEHICLE_SCOOTY + 1;

              switch (data.vehicle_motion_status) {
                case '0': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_yellow_scooty.png';
                  break;

                case '1': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_red_scooty.png';
                  break;

                case '2': data.vehicle_motion_status_image = 'assets/images/data_list_icons/marker_type_green_scooty.png';
                  break;
              }
              break;

          }

          switch (data.product_type) {
            case 'Basic':
              this.basic = this.basic + 1;
              break;

            case 'Magnetic':
              this.magnetic = this.magnetic + 1;
              break;

            case 'Mobile':
              this.mobile = this.mobile + 1;
              break;

            case 'IDCard':
              this.idCard = this.idCard + 1;
              break;

            case 'Temperature':
              this.temperature = this.temperature + 1;
              break;

            case 'OBD':
              this.obd = this.obd + 1;
              break;

            case 'Car Stereo':
              this.carStereo = this.carStereo + 1;
              break;

            case 'Fuel':
              this.fuel = this.fuel + 1;
              break;

            case 'FuelTemp':
              this.FuelTemp = this.FuelTemp + 1;
              break;

          }


          this.totaltempval = this.FuelTemp + this.temperature;
          this.totalfuelval = this.FuelTemp + this.fuel;



          if (data.product_type === 'Temperature') {
            data.fuel_point = '-';
          } else if (data.product_type === 'Fuel') {
            data.temp1 = '-';
            let fuelTank = data.fuel_tank_size
            let fuelValue;

            if (fuelTank === undefined || fuelTank === null) {
              data.fuel_point_motion_image = 'assets/images/data_list_icons/fuel_images/fuel_40.png';
            } else {
              fuelValue = Math.round(Number(data.fuel_point) / Number(fuelTank) * 20) * 5
              data.fuel_point_motion_image = 'assets/images/data_list_icons/fuel_images/fuel_' + fuelValue + '.png';
            }
          } else if (data.product_type === 'FuelTemp') {
            let fuelTank = data.fuel_tank_size
            let fuelValue;

            if (fuelTank === undefined || fuelTank === null) {
              data.fuel_point_motion_image = 'assets/images/data_list_icons/fuel_images/fuel_40.png';
            } else {
              fuelValue = Math.round(Number(data.fuel_point) / Number(fuelTank) * 20) * 5
              data.fuel_point_motion_image = 'assets/images/data_list_icons/fuel_images/fuel_' + fuelValue + '.png';
            }
          } else {
            data.temp1 = '-';
            data.fuel_point = '-';
          }

          if (Number(data.batteryLevel) > 100) {
            data.batteryLevel = '100';
          }

          if (data.last_running_time !== '' && data.last_running_time !== undefined
            && data.last_running_time != null &&
            data.last_running_time !== '0000-00-00 00:00:00') {
            const currentDateTimeinSec = new Date().getTime();
            data.stopped_time = String((currentDateTimeinSec - new Date(data.last_running_time).getTime()) / 1000);
            data.stopped_time_formatted = DateUtils.secondsToFormattedTime(data.stopped_time);
          } else {
            data.stopped_time_formatted = '-';
          }

          // Fuel Tank Size Null Condition
          if (data.fuel_tank_size !== null || data.fuel_tank_size !== undefined || data.fuel_tank_size !== '') {
            data.fuel_tank_size = data.fuel_tank_size;
          } else {
            data.fuel_tank_size = '-';
          }

        });

        this.updateIndMapData();
        this.setVehicleStatusChartData();
      }


      this.filterDataProcessDashboardTab(this.mainFilterType, this.filterType);
      this.filterDataProcessMapTab(this.mapSelectedFilterPosition);
      this.filterDataProcessTripDashboardTab(this.tripSelectedFilterPosition);


      this.interval = setTimeout(() => {
        this.home(); // api call
      }, 60000);

    });

  }


  selectedIndex = 0;
  mainFilterType = '';
  filterType = '';

  filterDataProcessDashboardTab(mainFilterType: string, filterType: string) {
    this.mainFilterType = mainFilterType;
    this.filterType = filterType;

    this.FILTERED_HOME_DATA = [];
    if (this.HOME_DATA.length > 0) {

      if (mainFilterType === '') {
        this.FILTERED_HOME_DATA = this.HOME_DATA;
      } else {


        switch (mainFilterType) {
          case 'VEHICLE_STATUS':

            switch (filterType) {
              case 'Total': this.FILTERED_HOME_DATA = this.HOME_DATA;
                this.selected = '0';


                setTimeout(() => {
                  this.filterDataProcessMapTab(0);
                  this.filterDataProcessTripDashboardTab(0);
                }, 500);
                break;
              case 'Moving':
                this.selected = '1';

                this.HOME_DATA.forEach(data => {
                  this.todayDate = new Date().getTime();
                  if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
                    data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {

                  } else {
                    const lastTravelTime = Date.parse(data.devicetime);
                    if ((this.todayDate - lastTravelTime) > 7200000) {

                    } else {
                      if (Number(data.speed) > 0) {
                        if (lastTravelTime - Date.parse(data.fixtime) > 1800000) {

                        } else {
                          this.FILTERED_HOME_DATA.push(data);

                        }
                      }
                    }
                  }

                });

                setTimeout(() => {
                  this.filterDataProcessMapTab(1);
                  this.filterDataProcessTripDashboardTab(1)
                }, 500);
                break;
              case 'Stopped':
                this.selected = '2';

                this.HOME_DATA.forEach(data => {
                  this.todayDate = new Date().getTime();
                  if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
                    data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
                  } else {
                    const lastTravelTime = Date.parse(data.devicetime);
                    if ((this.todayDate - lastTravelTime) > 7200000) {
                    } else {
                      if (Number(data.speed) > 0) {
                        if (lastTravelTime - Date.parse(data.fixtime) > 1800000) {
                          this.FILTERED_HOME_DATA.push(data);
                        }
                      } else {
                        this.FILTERED_HOME_DATA.push(data);
                      }
                    }
                  }
                });

                setTimeout(() => {
                  this.filterDataProcessMapTab(2);
                  this.filterDataProcessTripDashboardTab(2)
                }, 500);
                break;
              case 'Ideal':
                this.selected = '3';

                this.HOME_DATA.forEach(data => {
                  this.todayDate = new Date().getTime();
                  if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
                    data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
                    this.FILTERED_HOME_DATA.push(data);
                  } else {
                    const lastTravelTime = Date.parse(data.devicetime);
                    if ((this.todayDate - lastTravelTime) > 7200000) {
                      this.FILTERED_HOME_DATA.push(data);
                    }
                  }
                });

                setTimeout(() => {
                  this.filterDataProcessMapTab(3);
                  this.filterDataProcessTripDashboardTab(3)
                }, 500);
                break;

              case 'Power_Status':

                this.HOME_DATA.forEach(data => {
                  if (data.power_status == '0') {
                    this.FILTERED_HOME_DATA.push(data);
                  }
                });
                break;
            }

            break;

          case 'MY_GROUPS':
            const myGroupRow = this.MyGroupList[Number(filterType)];
            const deviceLinkList = myGroupRow.device_link_id_list;
            if (deviceLinkList !== undefined && deviceLinkList.length > 0) {
              this.HOME_DATA.forEach(data => {
                if (deviceLinkList !== undefined && deviceLinkList.length > 0) {
                  deviceLinkList.forEach(row => {
                    if (row.device_link_id === data.device_link_id) {
                      this.FILTERED_HOME_DATA.push(data);
                    }
                  });
                }
              });
            } else {
              // show toaster
              this.toasterService.danger('No Devices in this group', 'Pragati Utrack');
            }
            break;

          case 'PRODUCT_TYPES':
            if (filterType === 'Temperature') {
              this.HOME_DATA.forEach(data => {
                if (data.product_type === filterType || data.product_type === 'FuelTemp') {
                  this.FILTERED_HOME_DATA.push(data);
                }
              });
            } else if (filterType === 'Fuel') {
              this.HOME_DATA.forEach(data => {
                if (data.product_type === filterType || data.product_type === 'FuelTemp') {
                  this.FILTERED_HOME_DATA.push(data);
                }
              });
            } else {
              this.HOME_DATA.forEach(data => {
                if (data.product_type === filterType) {
                  this.FILTERED_HOME_DATA.push(data);
                }
              });
            }

            break;

          case 'ASSET_TYPES':
            this.HOME_DATA.forEach(data => {
              if (data.vehicle_type === filterType) {
                this.FILTERED_HOME_DATA.push(data);
              }
            });
            break;
        }

      }
    }

    this.ELEMENT_DATA = this.FILTERED_HOME_DATA;
    this.dataSource.data = this.ELEMENT_DATA;

    if (this.ELEMENT_DATA.length > 0) {
      this.ListTableDataNotshow = false;
    } else {
      this.ListTableDataNotshow = true;
    }

  }

  mapSelectedFilterPosition = 0;
  filterDataProcessMapTab(mapSelectedFilterPosition: number) {
    this.mapSelectedFilterPosition = mapSelectedFilterPosition;

    this.FILTERED_HOME_DATA = [];
    if (this.HOME_DATA.length > 0) {

      switch (mapSelectedFilterPosition) {

        case 0: this.FILTERED_HOME_DATA = this.HOME_DATA;
          break;

        case 1:
          this.HOME_DATA.forEach(data => {
            this.todayDate = new Date().getTime();
            if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
              data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
            } else {
              const lastTravelTime = Date.parse(data.devicetime);
              if ((this.todayDate - lastTravelTime) > 7200000) {
              } else {
                if (Number(data.speed) > 0) {
                  if (lastTravelTime - Date.parse(data.fixtime) > 1800000) {
                  } else {
                    this.FILTERED_HOME_DATA.push(data);
                  }
                }
              }
            }

          });

          break;
        case 2:

          this.HOME_DATA.forEach(data => {
            this.todayDate = new Date().getTime();
            if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
              data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
            } else {
              const lastTravelTime = Date.parse(data.devicetime);
              if ((this.todayDate - lastTravelTime) > 7200000) {
              } else {
                if (Number(data.speed) > 0) {
                  if (lastTravelTime - Date.parse(data.fixtime) > 1800000) {
                    this.FILTERED_HOME_DATA.push(data);
                  }
                } else {
                  this.FILTERED_HOME_DATA.push(data);
                }
              }
            }

          });
          break;

        case 3:
          this.HOME_DATA.forEach(data => {
            this.todayDate = new Date().getTime();
            if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
              data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
              this.FILTERED_HOME_DATA.push(data);
            } else {
              const lastTravelTime = Date.parse(data.devicetime);
              if ((this.todayDate - lastTravelTime) > 7200000) {
                this.FILTERED_HOME_DATA.push(data);
              }
            }
          });
          break;
      }
    }

    // MAP TABLE DATA
    this.MAP_ELEMENT_DATA = this.FILTERED_HOME_DATA;
    this.mapdataSource.data = this.MAP_ELEMENT_DATA;

    if (this.MAP_ELEMENT_DATA.length > 0) {
      this.MapTableDataNotshow = false;
    } else {
      this.MapTableDataNotshow = true;
    }

    if (this.isSelectedMapTab) {
      this.drawMarkersOnMap();
    }

  }

  tripSelectedFilterPosition = 0;
  filterDataProcessTripDashboardTab(tripSelectedFilterPosition: number) {
    this.tripSelectedFilterPosition = tripSelectedFilterPosition;

    this.FILTERED_HOME_DATA = [];
    if (this.HOME_DATA.length > 0) {
      switch (tripSelectedFilterPosition) {
        case 0: this.FILTERED_HOME_DATA = this.HOME_DATA;
          break;
        case 1:

          this.HOME_DATA.forEach(data => {
            this.todayDate = new Date().getTime();
            if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
              data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
            } else {
              const lastTravelTime = Date.parse(data.devicetime);
              if ((this.todayDate - lastTravelTime) > 7200000) {
              } else {
                if (Number(data.speed) > 0) {
                  if (lastTravelTime - Date.parse(data.fixtime) > 1800000) {
                  } else {
                    this.FILTERED_HOME_DATA.push(data);
                  }
                }
              }
            }

          });

          break;
        case 2:

          this.HOME_DATA.forEach(data => {
            this.todayDate = new Date().getTime();
            if (data.devicetime === null || data.devicetime === undefined || data.devicetime === '' ||
              data.fixtime === null || data.fixtime === undefined || data.fixtime === '') {
            } else {
              const lastTravelTime = Date.parse(data.devicetime);
              if ((this.todayDate - lastTravelTime) > 7200000) {
              } else {
                if (Number(data.speed) > 0) {
                  if (lastTravelTime - Date.parse(data.fixtime) > 1800000) {
                    this.FILTERED_HOME_DATA.push(data);
                  }
                } else {
                  this.FILTERED_HOME_DATA.push(data);
                }
              }
            }

          });
          break;
        case 3:

          this.HOME_DATA.forEach(data => {
            this.todayDate = new Date().getTime();
            if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
              data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
              this.FILTERED_HOME_DATA.push(data);
            } else {
              const lastTravelTime = Date.parse(data.devicetime);
              if ((this.todayDate - lastTravelTime) > 7200000) {
                this.FILTERED_HOME_DATA.push(data);
              }
            }
          });
          break;
      }
    }

    // Trip Dashboard List
    this.ELEMENT_DATA_TRIP_DASHBOARD = this.FILTERED_HOME_DATA;
    this.tripDataSource.data = this.ELEMENT_DATA_TRIP_DASHBOARD;

    if (this.ELEMENT_DATA_TRIP_DASHBOARD.length > 0) {
      this.TripDashBoardTableDataNotshow = false;
    } else {
      this.TripDashBoardTableDataNotshow = true;
    }

  }

  filterData(mainFilterType: string, filterType: string) {
    this.isChangedTabProgramatically = true;
    this.selectedIndex = 1;
    this.filterDataProcessDashboardTab(mainFilterType, filterType);
  }

  getTodayKmReport() {
    this.uTrackService.new_all_device_report_stats(DateUtils.getServerDateFromDate(new Date(this.todayDate)))
      .subscribe(response => {
        this.setTodayKMChartData(response);
        this.setMonthKMChartData(response);
        this.topTravelledVehiclesbarChart(response);
      });
  }

  KM_Date_chart_api(event) {
    const date = new Date(event.value);
    this.uTrackService.new_all_device_report_stats(DateUtils.getServerDateFromDate(date))
      .subscribe(response => {
        this.setTodayKMChartData(response);
      });
  }

  public date: FormControl = new FormControl(moment());

  chosenYearHandler(normalizedYear: moment.Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: moment.Moment, datepicker: MatDatepicker<moment.Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    this.currentMonthDate = new Date(this.date.value);
    datepicker.close();
    this.uTrackService.new_all_device_report_stats(DateUtils.getServerDateFromDate(this.date.value))
      .subscribe(response => {
        this.setMonthKMChartData(response);
      });
  }


  private filterValue = '';
  private filterMapValue = '';
  private tripFilterValue = '';

  applyFilter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.filterValue = (event.target as HTMLInputElement).value;
      this.filterValue = this.filterValue.trim();
      this.dataSource.filter = this.filterValue;
      this.dataSource.data = this.ELEMENT_DATA;

    }
  }

  mapapplyFilter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.filterMapValue = (event.target as HTMLInputElement).value;
      this.filterMapValue = this.filterMapValue.trim();
      this.mapdataSource.filter = this.filterMapValue;
      this.mapdataSource.data = this.MAP_ELEMENT_DATA;

    }
  }

  tripapplyFilter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.tripFilterValue = (event.target as HTMLInputElement).value;
      this.tripFilterValue = this.tripFilterValue.trim();
      this.tripDataSource.filter = this.tripFilterValue;
      this.tripDataSource.data = this.ELEMENT_DATA_TRIP_DASHBOARD;
    }
  }

  refresh() {
    this.home();
  }

  search() {
    this.filterValue = (document.getElementById('asset_list_search') as HTMLInputElement).value;
    this.filterValue = this.filterValue.trim();
    this.dataSource.filter = this.filterValue;
    this.dataSource.data = this.ELEMENT_DATA;
  }

  mapsearch() {
    this.filterMapValue = (document.getElementById('map_list_search') as HTMLInputElement).value;
    this.filterMapValue = this.filterMapValue.trim();
    this.mapdataSource.filter = this.filterMapValue;
    this.mapdataSource.data = this.MAP_ELEMENT_DATA;
  }

  tripsearch() {
    this.tripFilterValue = (document.getElementById('trip_list_search') as HTMLInputElement).value;
    this.tripFilterValue = this.tripFilterValue.trim();
    this.tripDataSource.filter = this.tripFilterValue;
    this.tripDataSource.data = this.ELEMENT_DATA_TRIP_DASHBOARD;
  }

  downloadPDF() {

    const title1 = 'Pragati UTrack Dashboard Report \n Report generated on';
    const title2 = DateUtils.getDisplayDateTimeFromDate(new Date());
    const pdf_heading_date = title1.concat(title2);


    const Columns: string[] = ['ID', 'Vehicle Name', 'Vehicle Type', 'Speed(KMPH)', 'Location', 'State', 'District', 'Last Record(D&T)', 'Driver Name', 'Driver Number', 'Stopped Duration (HH:MM:SS)', 'Fuel', 'Tank Size', 'Temperature'];
    const data: String[][] = [];

    let i = 1;
    this.ELEMENT_DATA.forEach(value => {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.speed);
      row.push(value.landmark);
      row.push(value.last_state);
      row.push(value.last_district);
      row.push(DateUtils.getDisplayDateTime(value.fixtime));
      row.push(value.driver_name);
      row.push(value.driver_mobile);
      row.push(value.stopped_time_formatted);
      row.push(value.fuel_point);
      row.push(value.fuel_tank_size);
      row.push(value.temp1);

      data.push(row);
      i++;
    }),

      PdfUtils.downloadPdf(pdf_heading_date, Columns, data, 'DashboardReport');
  }

  exportexcleDashBoard() {

    const columns = ['ID', 'Vehicle Name', 'Vehicle Type', 'Speed(KMPH)', 'Location', 'State', 'District', 'Last Record(D&T)', 'Driver Name', 'Driver Number', 'Stopped Duration (HH:MM:SS)', 'Fuel', 'Tank Size', 'Temperature'];

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
      row.push(value.speed);
      row.push(value.landmark);
      row.push(value.last_state);
      row.push(value.last_district);
      row.push(DateUtils.getDisplayDateTime(value.fixtime));
      row.push(value.driver_name);
      row.push(value.driver_mobile);
      row.push(value.stopped_time_formatted);
      row.push(value.fuel_point);
      row.push(value.fuel_tank_size);
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
    worksheet.getColumn(16).width = 10;
    worksheet.getColumn(14).width = 16;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'TrackRawDataReport' + '.xlsx');
    });
  }

  downloadTripPDF() {

    const title1 = 'Pragati UTrack Trip Dashboard Report \n Report generated on ';
    const title2 = DateUtils.getDisplayDateTimeFromDate(new Date());
    const pdf_heading_date = title1.concat(title2);

    const Columns: string[] = ['ID', 'Vehicle Number', 'Vehicle Type', 'Last Location', 'Date & Time', 'Driver Name', 'Trip Name', 'Trip Status', 'Trip Comment', 'Route Name', 'Trip Customer Name'];
    const data: String[][] = [];

    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.landmark);
      row.push(DateUtils.getDisplayDateTime(value.fixtime));
      row.push(value.driver_details_formatted);
      row.push(value.trip_name);
      row.push(value.trip_status);
      row.push(value.route_name);
      row.push(value.trip_customer_name);

      data.push(row);
      i++;
    }),
      PdfUtils.downloadPdf(pdf_heading_date, Columns, data, 'TripDashboardReport');
  }

  exportexcleTripData() {
    const columns = ['ID', 'Vehicle Number', 'Vehicle Type', 'Last Location', 'Date & Time', 'Driver Name', 'Trip Name', 'Trip Status', 'Trip Comment', 'Route Name', 'Trip Customer Name'];

    const mainTitle = 'Pragati UTrack Trip Dashboard Report';
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
    startToendData.value = title_dates,
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

      // worksheet.getColumn(index).width = header[index - 1].length < 22 ? 22 : header[index - 1].length;
    });

    // Adding Data with Conditional Formatting
    let i = 1;
    this.ELEMENT_DATA.forEach(function (value) {
      const row: String[] = [];
      row.push(i.toString());
      row.push(value.vehicle_number);
      row.push(value.vehicle_type);
      row.push(value.landmark);
      row.push(DateUtils.getDisplayDateTime(value.fixtime));
      row.push(value.driver_details_formatted);
      row.push(value.trip_name);
      row.push(value.trip_status);
      row.push(value.route_name);
      row.push(value.trip_customer_name);

      worksheet.addRow(row);
      i++;
    }),

      worksheet.getColumn(1).width = 5;
    worksheet.getColumn(2).width = 23;
    worksheet.getColumn(3).width = 17;
    worksheet.getColumn(4).width = 100;
    worksheet.getColumn(5).width = 23;
    worksheet.getColumn(6).width = 36;
    worksheet.getColumn(7).width = 12;
    worksheet.getColumn(8).width = 13;
    worksheet.getColumn(9).width = 17;
    worksheet.getColumn(10).width = 15;
    worksheet.getColumn(11).width = 25;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'TripDashboardReport' + '.xlsx');
    });
  }

  showvehicle(element) {
    this.map.setZoom(18);
    this.map.setCenter(new google.maps.LatLng(Number(element.latitude), Number(element.longitude)));
  }

  OpenChartDetails(mainFilterType, filterType) {
    localStorage.setItem('VEHICLE_STATUS_NAME', filterType);

    this.mainFilterType = mainFilterType;
    this.filterType = filterType;

    let FILTERED_HOME_DATA = [];
    if (this.HOME_DATA.length > 0) {

      switch (mainFilterType) {
        case 'VEHICLE_STATUS':

          switch (filterType) {

            case 'Total': FILTERED_HOME_DATA = this.HOME_DATA;
              break;

            case 'Moving':
              this.HOME_DATA.forEach(data => {
                this.todayDate = new Date().getTime();
                if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
                  data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
                } else {
                  const lastTravelTime = Date.parse(data.devicetime);
                  if ((this.todayDate - lastTravelTime) > 7200000) {
                  } else {
                    if (Number(data.speed) > 0) {
                      if (lastTravelTime - Date.parse(data.fixtime) > 1800000) {
                      } else {
                        FILTERED_HOME_DATA.push(data);
                      }
                    }
                  }
                }
              });
              break;

            case 'Stopped':
              this.HOME_DATA.forEach(data => {
                this.todayDate = new Date().getTime();
                if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
                  data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
                } else {
                  const lastTravelTime = Date.parse(data.devicetime);
                  if ((this.todayDate - lastTravelTime) > 7200000) {
                  } else {
                    if (Number(data.speed) > 0) {
                      if (lastTravelTime - Date.parse(data.fixtime) > 1800000) {
                        FILTERED_HOME_DATA.push(data);
                      }
                    } else {
                      FILTERED_HOME_DATA.push(data);
                    }
                  }
                }
              });
              break;

            case 'Ideal':
              this.HOME_DATA.forEach(data => {
                this.todayDate = new Date().getTime();
                if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
                  data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
                  FILTERED_HOME_DATA.push(data);
                } else {
                  const lastTravelTime = Date.parse(data.devicetime);
                  if ((this.todayDate - lastTravelTime) > 7200000) {
                    FILTERED_HOME_DATA.push(data);
                  }
                }
              });
              break;
          }
          break;

        case 'STATE':
          this.HOME_DATA.forEach(row => {

            if (row.last_state === filterType) {
              FILTERED_HOME_DATA.push(row);
            }
          });
          break;
      }
    }

    const rowData = JSON.stringify(FILTERED_HOME_DATA);
    const dialogReference = this.dialog.open(ShowChartVehicleListComponent, {
      data: { rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
  }

  mygroup() {
    this.routes.navigate([`web/myaccount/mygroups`]);
    { this.activatedRoute; }
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit(): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(() => {
    });
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
    clearTimeout(this.interval);
  }

}
