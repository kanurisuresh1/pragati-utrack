import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { DOCUMENT, Location } from '@angular/common';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { CurrentDevicePositionResponse } from '../../../@theme/components/Model/CurrentDevicePositionResponse';
import { NbToastrService } from '@nebular/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ShowChartDetailsComponent } from './show-chart-details/show-chart-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatRadioChange } from '@angular/material/radio';
import { TripResponseData } from '../../../@theme/components/Model/TripResponse';
import { ShareTripLinkComponent } from '../share-trip-link/share-trip-link.component';
// drop down search
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { GoogleChartComponent } from 'angular-google-charts';
import { VehicleTripDetailsComponent } from './vehicle-trip-details/vehicle-trip-details.component';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SingleCustomDeviceDetail } from '../../../@theme/components/Model/SingleCustomDeviceReportStatsResponse';

@Component({
  selector: 'ngx-live-track',
  templateUrl: './live-track.component.html',
  styleUrls: ['./live-track.component.scss'],
})

export class LiveTrackComponent implements OnInit {

  selected = '0';

  map: any;

  interval: NodeJS.Timeout;
  data: CurrentDevicePositionResponse;

  course: string;
  marker: any;

  latitudedata: string;
  longitudedata: string;
  device_time: string;
  Location: string;
  last_state_name: string;
  last_district_name: string;

  // Code For the SPEEDO METER
  @ViewChild('googlechart')
  googlechart: GoogleChartComponent;
  chart: { type: string; data: (string | number)[][]; options: { width: number; height: number; greenFrom: number; greenTo: number; redFrom: number; redTo: number; yellowFrom: number; yellowTo: number; minorTicks: number; }; };
  gaugeValue = 0;

  temperature_data: string;
  fuel_data: string;

  temperature_data_color: string;
  fuel_data_color: string;

  selectedRow: HomeLiteV1Data;
  deviceLinkId: string;
  deviceId: string;
  vehicle_type: string;
  product_type: string;

  vehicle_number: string;

  singledevicedata: SingleCustomDeviceDetail[] = [];

  today_max_speed: string;
  today_avg_speed: string;
  today_total_distance: string;
  today_travelled_time: string;
  yesterday_max_speed: string;
  yesterday_avg_speed: string;
  yesterday_total_distance: string;
  yesterday_travelled_time: string;
  last7days_avg_speed: string;
  last7days_total_distance: string;
  last7days_travelled_time: string;
  last7days_max_speed: string;

  vehicles: HomeLiteV1Data[] = [];
  dashboard_device_link_id: string;

  isStatisticsData: boolean = false;

  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private toasterNotification: NbToastrService,
    private routes: Router,
    private modalService: NgbModal,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    @Inject(DOCUMENT) private document: any,
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.dashboard_device_link_id = params.device_link_id;
    });
  }

  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();

    this.headerService.updateHeaderTitle('HEADER_NAMES.Live Track');
    this.map = new google.maps.Map(document.getElementById('livemap'), {
      zoom: 14,
      center: {
        lat: 17.438557777777778,
        lng: 78.39158222222223,
      },
      disableDefaultUI: true,
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      }
    });
    this.getVehicles();
    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  open(shareLocationPopUp) {
    this.modalService.open(shareLocationPopUp, { ariaLabelledBy: 'modal-basic-title' }).result.then(() => {
    });
  }

  back() {
    this.location.back();
  }

  showChartDetails(name: string) {
    localStorage.setItem('CHART_NAME', name);
    this.dialog.open(ShowChartDetailsComponent, {
      height: '80%',
      width: '65%',
      data: this.singledevicedata,
    });
  }

  trip: TripResponseData[] = [];

  trip_list() {
    this.uTrackService.trip_list(this.deviceLinkId).subscribe(response => {
      if (response.status && response.data.length > 0) {
        this.trip = response.data;
        this.isTrip_data = true;
      } else {
        this.isTrip_data = false;
      }
    });
  }

  onChange(value) {
    this.live_dutation_value = value;
  }

  onTripChange(value) {
    this.trip_value = value;
  }

  isLive: boolean = false;
  isTrip: boolean = false;
  isTrip_data: boolean = false;
  radioValue: number;
  live_dutation_value: string = '60';
  trip_value: string;

  radioChange(event: MatRadioChange) {
    this.radioValue = event.value;
    switch (event.value) {

      case '1': this.isLive = false;
        this.isTrip = false;
        break;

      case '2': this.isLive = true;
        this.isTrip = false;
        break;

      case '3': this.isTrip = true;
        this.isLive = false;
        break;
    }
  }

  shareLocation() {
    if (this.radioValue == undefined || this.radioValue == null) {
      this.radioValue = 1;
    }

    if (this.radioValue == 1) {
      const dialogReference = this.dialog.open(ShareTripLinkComponent, {
        height: '45%',
        width: '55%',
        data: {
          dataKey: JSON.stringify('http://maps.google.com/maps?daddr=' + this.latitudedata + ',' + this.longitudedata),
          vehicle_num: JSON.stringify(this.vehicle_number),
        },
      });
      dialogReference.afterClosed().subscribe(() => {
        dialogReference.close();
      });
    }

    if (this.radioValue == 2) {
      this.radioValue = 1;
      this.isLive = false;
      this.isTrip = false;
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('device_token', 'Web');
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('type', 'Live');
      formData.append('live_duration', this.live_dutation_value);
      formData.append('device_link_id', this.deviceLinkId);
      formData.append('trip_id', '0');

      this.uTrackService.trip_share_create(formData).subscribe(response => {
        const dialogReference = this.dialog.open(ShareTripLinkComponent, {
          height: '45%',
          width: '55%',
          data: {
            dataKey: JSON.stringify(response.data.share_url),
            vehicle_num: JSON.stringify(this.vehicle_number)
          },
        });
        dialogReference.afterClosed().subscribe(() => {
          dialogReference.close();
        });
      });
    }

    if (this.radioValue == 3) {
      this.radioValue = 1;
      this.isLive = false;
      this.isTrip = false;
      if (!this.isTrip_data) {
        alert('No Trips Found');
      } else {
        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('device_token', 'Web');
        formData.append('user_type', localStorage.getItem('USER_TYPE'));
        formData.append('type', 'Trip');
        formData.append('live_duration', '0');
        formData.append('device_link_id', this.deviceLinkId);
        formData.append('trip_id', this.trip_value);

        this.uTrackService.trip_share_create(formData).subscribe(response => {
          const dialogReference = this.dialog.open(ShareTripLinkComponent, {
            height: '45%',
            width: '55%',
            data: {
              dataKey: JSON.stringify(response.data.share_url),
              vehicle_num: JSON.stringify(this.vehicle_number)
            },
          });
          dialogReference.afterClosed().subscribe(() => {
            dialogReference.close();
          });
        });
      }
    }
    this.modalService.dismissAll('Closed');
  }

  updateSelectedValue(row) {
    this.selectedRow = row;
    this.vehicle_type = this.selectedRow.vehicle_type;
    this.product_type = this.selectedRow.product_type;
    this.deviceLinkId = this.selectedRow.device_link_id;
    this.deviceId = this.selectedRow.device_id;
    this.vehicle_number = this.selectedRow.vehicle_number
    clearTimeout(this.interval);
    this.first_loadlive_track(this.deviceLinkId, this.deviceId);
    this.get_statistics_data(this.deviceLinkId);
    this.new_track_report_web_mongo();
    this.trip_list();
  }

  changeMapType(value) {
    // var selectmap = (document.getElementById('maptype') as HTMLInputElement).value
    this.map.setMapTypeId(value);
  }

  first_loadlive_track(device_link_id, device_id) {
    this.uTrackService.current_device_position_v1(device_link_id, device_id).subscribe(response => {
      if (response.status) {
        this.data = response.data;
        this.updatedata(this.data);
      } else {
        this.latitudedata = '';
        this.longitudedata = '';
        this.gaugeValue = 0;
        this.device_time = '';
        this.Location = '';
        this.last_state_name = '-';
        this.last_district_name = '-';
        this.marker = null;
      }
    });
    this.interval = setTimeout(() => {
      this.first_loadlive_track(device_link_id, device_id); // api call
    }, 3000);
  }


  public searchvehiclenumber: FormControl = new FormControl();
  public filteredVehicleNumber: ReplaySubject<HomeLiteV1Data[]> = new ReplaySubject<HomeLiteV1Data[]>(1);

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

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      if (response.status && response.data != null && response.data !== undefined && response.data.length > 0) {
        this.vehicles = response.data;
        this.filteredVehicleNumber.next(this.vehicles);
        if (this.dashboard_device_link_id === undefined ||
          this.dashboard_device_link_id == null ||
          this.dashboard_device_link_id === '') {
          this.selectedRow = this.vehicles[0];
        } else {
          this.vehicles.forEach(element => {
            if (element.device_link_id === this.dashboard_device_link_id) {
              this.selectedRow = element;
            }
          });
        }
        this.vehicle_type = this.selectedRow.vehicle_type;
        this.product_type = this.selectedRow.product_type;
        this.deviceLinkId = this.selectedRow.device_link_id;
        this.deviceId = this.selectedRow.device_id;
        this.vehicle_number = this.selectedRow.vehicle_number;
        this.first_loadlive_track(this.deviceLinkId, this.deviceId);
        this.get_statistics_data(this.deviceLinkId);
        this.new_track_report_web_mongo();
        this.trip_list();
      } else {
        this.toasterNotification.danger('Pragati Utrack', response.message);
      }
    });
  }

  trackHistory() {
    this.routes.navigate([`web/track_history`, this.deviceLinkId]);
    { this.activatedRoute; }
  }

  vehicleTripDetails() {
    this.dialog.open(VehicleTripDetailsComponent, {
      // height: '85%',
      // width: '70%',
    });
  }

  @ViewChild('fullScreen') divRef;

  openFullscreen() {
    // Use this.divRef.nativeElement here to request fullscreen
    document.getElementById('livemap').style.height = '775px';
    document.getElementById('livemap').style.width = '100%';
    document.getElementById('ExitFullScreen').style.display = 'block';
    document.getElementById('fullScreen').style.display = 'none';
    document.getElementById('btn_center').style.left = '110px';
    document.getElementById('btn_btn_track_history').style.display = 'none';
    document.getElementById('btn_trip_details').style.display = 'none';
    document.getElementById('btn_share_location').style.display = 'none';

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
    document.getElementById('livemap').style.height = '500px';
    document.getElementById('livemap').style.width = '96%';
    document.getElementById('ExitFullScreen').style.display = 'none';
    document.getElementById('fullScreen').style.display = 'block';
    document.getElementById('btn_center').style.left = '90px';
    document.getElementById('btn_btn_track_history').style.display = 'block';
    document.getElementById('btn_trip_details').style.display = 'block';
    document.getElementById('btn_share_location').style.display = 'block';

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

  latitudeCenter: number;
  longitudCenter: number;

  openCenterscreen() {
    this.map.setCenter(new google.maps.LatLng(this.latitudeCenter, this.longitudCenter));
  }

  updatedata(data) {

    this.latitudedata = parseFloat(data.la).toFixed(4);
    this.longitudedata = parseFloat(data.lo).toFixed(4);

    this.latitudeCenter = data.la;
    this.longitudCenter = data.lo;

    this.gaugeValue = Math.floor(data.s);
    this.chart = {
      type: 'Gauge',
      data: [
        ['kmph', this.gaugeValue],
      ],
      options: {
        width: 400,
        height: 120,
        greenFrom: 0,
        greenTo: 50,
        redFrom: 65,
        redTo: 100,
        yellowFrom: 51,
        yellowTo: 65,
        minorTicks: 5
      }
    };
    this.device_time = data.dt;
    this.Location = data.l;
    this.last_state_name = data.state;
    this.last_district_name = data.district;

    this.temperature_data = '-';
    this.fuel_data = '-';

    if ('Temperature' === this.product_type) {
      const temp1 = data.t
      this.temperature_data = temp1 + '\u00B0' + 'C';
      this.temperature_data_color = 'blue';
    } else if ('Fuel' === this.product_type) {
      const fuel = data.f;
      this.fuel_data = fuel + ' Liters';
      this.fuel_data_color = 'green';

      if (Number(fuel) > 10) {
        this.fuel_data_color = 'green';
      } else {
        this.fuel_data_color = 'red';
      }

    } else if ('FuelTemp' === this.product_type) {
      const temp1 = data.t;
      const fuel = data.f;
      this.temperature_data = temp1 + '\u00B0' + 'C';
      this.fuel_data = fuel + ' Liters';
      this.fuel_data_color = 'green';
      this.temperature_data_color = 'blue';

      if (Number(fuel) > 10) {
        this.fuel_data_color = 'green';
      } else {
        this.fuel_data_color = 'red';
      }
    }
    this.updateMapData(data);
  }

  last_latitude = '';
  last_longitude = '';

  updateMapData(row) {

    let mapImage;
    const course = row.c / 10;
    const live_position_valuecourse = course.toFixed(1);
    const live_position_value = parseInt(live_position_valuecourse) * 10;

    const imageCarRed = 'assets/images/red-car/car_r_' + live_position_value + '.png';
    const imageCarGreen = 'assets/images/green-car/car_g_' + live_position_value + '.png';
    const imageCarYellow = 'assets/images/yellow-car/car_y_' + live_position_value + '.png';

    const imageTruckGreen = 'assets/images/all-trucks/truck_g_' + live_position_value + '.png';
    const imageTruckRed = 'assets/images/all-trucks/truck_r_' + live_position_value + '.png';
    const imageTruckYellow = 'assets/images/all-trucks/truck_y_' + live_position_value + '.png';

    const imageAutoGreen = 'assets/images/auto/auto_g_' + live_position_value + '.png';
    const imageAutoRed = 'assets/images/auto/auto_r_' + live_position_value + '.png';
    const imageAutoYellow = 'assets/images/auto/auto_y_' + live_position_value + '.png';

    const imageBikeGreen = 'assets/images/bike/bike_g_' + live_position_value + '.png';
    const imageBikeRed = 'assets/images/bike/bike_r_' + live_position_value + '.png';
    const imageBikeYellow = 'assets/images/bike/bike_y_' + live_position_value + '.png';

    const imageBusGreen = 'assets/images/bus/bus_g_' + live_position_value + '.png';
    const imageBusRed = 'assets/images/bus/bus_r_' + live_position_value + '.png';
    const imageBusYellow = 'assets/images/bus/bus_y_' + live_position_value + '.png';

    const imageScootyGreen = 'assets/images/scooty/scooty_g_' + live_position_value + '.png';
    const imageScootyRed = 'assets/images/scooty/scooty_r_' + live_position_value + '.png';
    const imageScootyYellow = 'assets/images/scooty/scooty_y_' + live_position_value + '.png';

    const imageTrainGreen = 'assets/images/train/train_g_' + live_position_value + '.png';
    const imageTrainRed = 'assets/images/train/train_r_' + live_position_value + '.png';
    const imageTrainYellow = 'assets/images/train/train_y_' + live_position_value + '.png';

    const imageIdCardRed = 'assets/images/map_icons/marker_type_red_id.png';
    const imageIdCardGreen = 'assets/images/map_icons/marker_type_green_id.png';
    const imageIdCardYellow = 'assets/images/map_icons/marker_type_yellow_id.png';

    const imageMobileRed = 'images/map_icons/marker_type_red_mobile.png';
    const imageMobileGreen = 'images/map_icons/marker_type_green_mobile.png';
    const imageMobileYellow = 'images/map_icons/marker_type_yellow_mobile.png';


    switch (row.vms) {
      case 0:
        switch (this.vehicle_type) {
          case 'Car':
            mapImage = imageCarYellow;
            break;
          case 'Bus':
            mapImage = imageBusYellow;
            break;
          case 'Truck':
            mapImage = imageTruckYellow;
            break;
          case 'Auto':
            mapImage = imageAutoYellow;
            break;
          case 'Bike':
            mapImage = imageBikeYellow;
            break;
          case 'Mobile':
            mapImage = imageMobileYellow;
            break;
          case 'IDCard':
            mapImage = imageIdCardYellow;
            break;
          case 'Scooty':
            mapImage = imageScootyYellow;
            break;
          case 'Train':
            mapImage = imageTrainYellow;
            break;
        }
        break;
      case 1:
        switch (this.vehicle_type) {
          case 'Car':
            mapImage = imageCarRed;
            break;
          case 'Bus':
            mapImage = imageBusRed;
            break;
          case 'Truck':
            mapImage = imageTruckRed;
            break;
          case 'Auto':
            mapImage = imageAutoRed;
            break;
          case 'Bike':
            mapImage = imageBikeRed;
            break;
          case 'Mobile':
            mapImage = imageMobileRed;
            break;
          case 'IDCard':
            mapImage = imageIdCardRed;
            break;
          case 'Scooty':
            mapImage = imageScootyRed;
            break;
          case 'Train':
            mapImage = imageTrainRed;
            break;
        }
        break;
      case 2:
        switch (this.vehicle_type) {
          case 'Car':
            mapImage = imageCarGreen;
            break;
          case 'Bus':
            mapImage = imageBusGreen;
            break;
          case 'Truck':
            mapImage = imageTruckGreen;
            break;
          case 'Auto':
            mapImage = imageAutoGreen;
            break;
          case 'Bike':
            mapImage = imageBikeGreen;
            break;
          case 'Mobile':
            mapImage = imageMobileGreen;
            break;
          case 'IdCard':
            mapImage = imageIdCardGreen;
            break;
          case 'Scooty':
            mapImage = imageScootyGreen;
            break;
          case 'Train':
            mapImage = imageTrainGreen;
            break;
        }
        break;
    }

    const latlng = new google.maps.LatLng(parseFloat(row.la), parseFloat(row.lo));

    if (this.marker == null) {
      this.marker = new google.maps.Marker({
        position: {
          lat: parseFloat(row.la),
          lng: parseFloat(row.lo),
        },
        // zoom: 13,
        map: this.map,
        icon: mapImage,
        animation: google.maps.Animation.DROP,
      });
      this.map.setCenter(latlng);
    } else {
      this.marker.setIcon(mapImage);
      this.animatedMove(this.marker, .5, this.marker.getPosition(), latlng);
    }

    if (row.la !== this.last_latitude || row.lo !== this.last_longitude) {
      this.trackLatLogs.push(latlng);

      this.trackPolyline = new google.maps.Polyline({
        path: this.trackLatLogs,
        strokeColor: '#FF0000',
        strokeOpacity: 2,
        strokeWeight: 2,
        geodesic: true,
        icons: [{
          icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW },
          offset: '100%'
        }]
      });
      this.trackPolyline.setMap(this.map);

    }
    this.last_latitude = row.la;
    this.last_longitude = row.lo;
  }

  isShowAutoZoomMap: boolean = true;

  showAutoZoom(event: MatCheckboxChange) {
    this.isShowAutoZoomMap = event.checked;
  }

  animatedMove(marker, t, current, moveto) {

    const deltalat = (moveto.lat() - current.lat()) / 100;
    const deltalng = (moveto.lng() - current.lng()) / 100;

    const delay = 20 * t;
    for (let i = 0; i < 100; i++) {
      (function (ind) {
        setTimeout(
          function () {
            let lat = marker.position.lat();
            let lng = marker.position.lng();
            lat += deltalat;
            lng += deltalng;
            this.latlng = new google.maps.LatLng(lat, lng);
            marker.setPosition(this.latlng);
          }, delay * ind,
        );
      })(i);
    }
    if (this.isShowAutoZoomMap) {
      this.map.setCenter(moveto);
    }
  }

  trackPolyline;
  trackLatLogs = [];

  removePolyLine() {
    if (this.trackPolyline != null) {
      this.trackPolyline.setMap(null);
    }
    this.trackLatLogs = [];
  }

  new_track_report_web_mongo() {
    this.removePolyLine();
    const time_diff = 10;
    const endDate = new Date();
    const startDate = new Date(new Date().getTime() - (4 * 60 * 60 * 1000));

    this.uTrackService.new_track_report_web_mongo(this.deviceLinkId,
      DateUtils.getServerDateTimeFromDate(startDate),
      DateUtils.getServerDateTimeFromDate(endDate), time_diff, '0').subscribe(response => {
        if (response.status && response.data != null && response.data !== undefined && response.data.length > 0) {
          this.removePolyLine();
          response.data.forEach(row => {
            this.trackLatLogs.push(new google.maps.LatLng(row.la, row.lo));
          });

          this.trackPolyline = new google.maps.Polyline({
            path: this.trackLatLogs,
            strokeColor: '#FF0000',
            strokeOpacity: 2,
            strokeWeight: 2,
            geodesic: true,
            icons: [{
              icon: { path: google.maps.SymbolPath.FORWARD_OPEN_ARROW },
              offset: '100%'
            }]
          });
          this.trackPolyline.setMap(this.map);
        }
      });
  }

  get_statistics_data(device_link_id) {

    const stringStartDate = DateUtils.getServerDateFromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const stringEndData = DateUtils.getServerDateFromDate(new Date());

    this.uTrackService.single_custom_device_report_stats_v1(stringStartDate, stringEndData, device_link_id)
      .subscribe(response => {
        if (response.status && response.data != null && response.data !== undefined
          && response.data.detail.length > 0) {
          this.singledevicedata = response.data.detail;

          const todayPosition = this.singledevicedata.length - 1;
          const todayData = this.singledevicedata[todayPosition];
          this.today_max_speed = todayData.max_speed;
          this.today_avg_speed = todayData.avg_speed;
          this.today_total_distance = todayData.total_distance;
          this.today_travelled_time = todayData.total_travelled_time;

          if (response.data.detail.length > 1) {
            const yesterdayPosition = this.singledevicedata.length - 2;
            const yesterdayData = this.singledevicedata[yesterdayPosition];
            this.yesterday_max_speed = yesterdayData.max_speed;
            this.yesterday_avg_speed = yesterdayData.avg_speed;
            this.yesterday_total_distance = yesterdayData.total_distance;
            this.yesterday_travelled_time = yesterdayData.total_travelled_time;
          } else {
            this.yesterday_max_speed = '-';
            this.yesterday_avg_speed = '-';
            this.yesterday_total_distance = '-';
            this.yesterday_travelled_time = '-';
          }


          var last7daysData = response.data
          this.last7days_max_speed = last7daysData.max_speed;
          this.last7days_avg_speed = last7daysData.avg_speed;
          this.last7days_total_distance = last7daysData.total_distance;
          this.last7days_travelled_time = last7daysData.total_travelled_time;

        } else {
          this.today_max_speed = '0';
          this.today_avg_speed = '0';
          this.today_total_distance = '0';
          this.today_travelled_time = '00:00:00';
          this.yesterday_max_speed = '0';
          this.yesterday_avg_speed = '0';
          this.yesterday_total_distance = '0';
          this.yesterday_travelled_time = '00:00:00';
          this.last7days_avg_speed = '0';
          this.last7days_total_distance = '0';
          this.last7days_travelled_time = '';
          this.last7days_max_speed = '0';
        }
      });
  }

  ngOnDestroy() {
    clearTimeout(this.interval);
  }
}
