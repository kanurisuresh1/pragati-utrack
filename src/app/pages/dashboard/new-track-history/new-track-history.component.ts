import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { Location, DOCUMENT } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { ActivatedRoute } from '@angular/router';
import { TravelMarker, TravelMarkerOptions, EventType, TravelData } from 'travel-marker';
// drop down search
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { DateUtils } from '../../../@theme/components/Services/date_utils';
import { NbToastrService } from '@nebular/theme';
import { GoogleChartComponent } from 'angular-google-charts';
import { HomeLiteV1Data } from '../../../@theme/components/Model/HomeLiteV1Response';
import { TrackReport } from '../../../@theme/components/Model/final_summary_report_mongo_v2';

@Component({
  selector: 'ngx-new-track-history',
  templateUrl: './new-track-history.component.html',
  styleUrls: ['./new-track-history.component.scss'],
})
export class NewTrackHistoryComponent implements OnInit {

  reportStartDate: string;

  startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
  endDate = new Date();
  minStartDate = new Date(new Date().getTime() - (365 * 24 * 60 * 60 * 1000));
  currentDate = new Date();

  zoom: number = 17;
  lat: number = 18.1408383;
  lng: number = 83.62034;

  map: any;
  marker: TravelMarker = null;
  startMarker: google.maps.Marker;
  endMarker: google.maps.Marker;
  speedMultiplier = 1;

  data: TrackReport[] = [];

  vehicles: HomeLiteV1Data[] = [];
  dashboard_device_link_id: string;
  deviceLinkId: string;

  map_total_distance: string;
  map_avg_speed: string;
  map_max_speed: string;
  map_total_time: string;

  cumulative_distance_address: string;
  cumulative_distance: string;
  cumulative_time: number;

  constructor(private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    @Inject(DOCUMENT) private document: any,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private toasterService: NbToastrService,

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.dashboard_device_link_id = params.device_link_id;
      this.reportStartDate = params.report_date_formatted;
    });
  }

  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Track History');
    if (this.reportStartDate === undefined || this.reportStartDate == null || this.reportStartDate === '') {
      this.startDate = new Date(new Date().getTime() - (1 * 24 * 60 * 60 * 1000));
      this.endDate = new Date();
    } else {
      const dateString = this.reportStartDate + 'T00:00:00';
      this.startDate = new Date(dateString);
      this.endDate = new Date(this.startDate.getTime() + (1000 * 60 * 60 * 24 * 1));
    }

    this.getVehicles();

    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
      this.filterVehicles();
    });
  }

  trackHistoryReportForm = new FormGroup({
    vechicleName: new FormControl(''),
    startDate: new FormControl(),
    endDate: new FormControl(),
  });

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
    this.filteredVehicleNumber.next(
      this.vehicles.filter(searchData => searchData.vehicle_number.toLowerCase().indexOf(search) > -1),
    );
  }

  getVehicles() {
    this.uTrackService.home_lite_v1().subscribe(response => {
      this.vehicles = response.data;
      this.filteredVehicleNumber.next(this.vehicles);
      if (this.dashboard_device_link_id == undefined || this.dashboard_device_link_id == null || this.dashboard_device_link_id === '') {
        this.deviceLinkId = this.vehicles[0].device_link_id;
      } else {
        this.vehicles.forEach(element => {
          if (this.dashboard_device_link_id === element.device_link_id) {
            this.deviceLinkId = this.dashboard_device_link_id;
          }
        });
      }
      this.final_summary_report_mongo();
    });
  }

  update_screen_load_status() {
    this.uTrackService.update_screen_load_status('TrackHistory').subscribe(() => {
    });
  }

  back() {
    this.location.back();
  }

  updateSelectedValue(event) {
    this.isPlayPauseBtn = true;
    this.isShowCumulativeDistance = false;
    this.select_time_interval = 299;
    this.speedMultiplier = 1;
    this.deviceLinkId = event;
    this.removeOldMapData();
    this.viewReport();
  }

  final_summary_report_mongo() {
    let time_diff = 20;

    const endDate = this.endDate.getTime();
    const startDate = this.startDate.getTime();
    const seconds = (endDate - startDate) / 1000;

    if (seconds <= 24 * 60 * 60 * 1) {
      time_diff = 10;
    } else if (seconds <= 24 * 60 * 60 * 2) {
      time_diff = 20;
    } else if (seconds <= 24 * 60 * 60 * 4) {
      time_diff = 30;
    } else if (seconds <= 24 * 60 * 60 * 5) {
      time_diff = 45;
    }else if (seconds <= 24 * 60 * 60 * 7) {
      time_diff = 60;
    }else if (seconds <= 24 * 60 * 60 * 14) {
      time_diff = 120;
    }else if (seconds <= 24 * 60 * 60 * 21) {
      time_diff = 180;
    }else if (seconds <= 24 * 60 * 60 * 28) {
      time_diff = 300;
    } else {
      time_diff = 300;
    }

    this.uTrackService.final_summary_report_mongo_v2(this.deviceLinkId,
      DateUtils.getServerDateTime(this.trackHistoryReportForm.value.startDate),
      DateUtils.getServerDateTime(this.trackHistoryReportForm.value.endDate), time_diff,'1', '1').subscribe(response => {
        this.data = [];
          if (response.status && response.status && response.data != null && response.data !== undefined) {
            if (response.data.track_report != null && response.data.track_report !== undefined && response.data.track_report.length > 0) {
              this.data = response.data.track_report;
              var trackHistortData = response.data.device_report_stats_custom
              this.updatePolyColorLineData(this.data);
              this.map_total_distance = trackHistortData.total_distance + ' KMS';
              this.map_avg_speed = trackHistortData.avg_speed + ' KMPH';
              this.map_max_speed = trackHistortData.max_speed + ' KMPH';
              this.map_total_time = trackHistortData.total_travelled_time + ' (HH:MM:SS)';
            } else {
              this.map_total_distance = '-';
              this.map_avg_speed = '-';
              this.map_max_speed = '-';
              this.map_total_time = '-';
            }
          }else{
            this.toasterService.danger('Pragati Utrack', response.message);
          }
        this.mockDirections();
      });
  }

  poly_line_data: TrackReport[][] = [];

  updatePolyColorLineData(data: TrackReport[] = []) {
    this.poly_line_data = [];
    let previousMovingType: string = 'slow';
    if (data[0].s < 25) {
      previousMovingType = 'slow';
    } else if (data[0].s < 32.5) {
      previousMovingType = 'medium';
    } else {
      previousMovingType = 'fast';
    }

    let childArray: TrackReport[] = [];

    for (let i = 0; i < data.length; i++) {

      let currentMovingType: string = 'slow';
      if (data[i].s < 25) {
        currentMovingType = 'slow';
      } else if (data[i].s < 32.5) {
        currentMovingType = 'medium';
      } else {
        currentMovingType = 'fast';
      }

      if (previousMovingType === currentMovingType) {
        childArray.push(data[i]);
      } else {
        childArray.push(data[i]);
        this.poly_line_data.push(childArray);
        childArray = [];
        childArray.push(data[i]);
        previousMovingType = currentMovingType;
      }
    }

    if (childArray.length > 0) {
      this.poly_line_data.push(childArray);
    }
  }

  viewReport() {
    this.isPlayPauseBtn = true;
    this.isShowCumulativeDistance = false;
    this.select_time_interval = 299;
    this.speedMultiplier = 1;

    const start_date = DateUtils.getServerDateTime(this.trackHistoryReportForm.value.startDate);
    const end_date = DateUtils.getServerDateTime(this.trackHistoryReportForm.value.endDate);

    const start_millisec = DateUtils.getDateDifference(this.trackHistoryReportForm.value.startDate);
    const end_millisec = DateUtils.getDateDifference(this.trackHistoryReportForm.value.endDate);

    if (start_date > end_date) {
      this.toasterService.danger('Pragati Utrack', 'Start date should be less than End date.');
    } else if ((end_millisec - start_millisec) > 3024000000) {
      this.toasterService.danger('Pragati Utrack', 'Difference between start and end date should be less than 35days.');
    } else {
      this.removeOldMapData();
      this.final_summary_report_mongo();
    }
  }

  onMapReady(map: any) {
    this.map = map;
    this.map.setOptions({
      zoomControl: 'true',
      zoomControlOptions: {
        position: google.maps.ControlPosition.LEFT_BOTTOM,
      }
    });
    if (this.pendingDataSetOnMap) {
      this.pendingDataSetOnMap = false;
      this.mockDirections();
    }
  }

  private pendingDataSetOnMap: boolean = false;
  private stopped_markerss = [];
  private poly_lines_markers = [];

  removeStoppageMarkers() {
    if (this.stopped_markerss.length > 0) {
      this.stopped_markerss.forEach(row => {
        row.setMap(null);
      });
      this.stopped_markerss = [];
    }
  }

  removePolylinesMarkers() {
    if (this.poly_lines_markers.length > 0) {
      this.poly_lines_markers.forEach(row => {
        row.setMap(null);
      });
      this.poly_lines_markers = [];
    }
  }

  drawStopTimeMarkers(interval: number) {
    this.removeStoppageMarkers();
    const datalength = this.data.length;
    if (datalength > 0) {
      
      for (let i = 0; i < datalength; i = i + 1) {
        let previousTime = 0;
        let nextTime = 0;

        if (i > 0) {
          previousTime = this.data[i - 1].nt;
        } else {
          previousTime = this.data[i].nt;
        }

        if (i === datalength - 1) {
          nextTime = this.data[i].nt;

        } else {
          nextTime = this.data[i + 1].nt;
        }

        if (this.data[i].s === 0 && (nextTime - previousTime) > interval) {

          let mins = Math.floor((nextTime - previousTime) / 60);
          let stop_marker_image: string;
          if (mins < 119) {
            stop_marker_image = 'assets/marker_type_purple_mins.png';
          } else if (mins < 2779) {
            mins = Math.floor(mins / 60);
            if (mins === 1) {
              stop_marker_image = 'assets/marker_type_purple_hour.png';
            } else {
              stop_marker_image = 'assets/marker_type_purple_hours.png';
            }
          } else {
            mins = Math.floor(mins / (60 * 24));
            if (mins === 1) {
              stop_marker_image = 'assets/marker_type_purple_day.png';
            } else {
              stop_marker_image = 'assets/marker_type_purple_days.png';
            }
          }

          const stopped_lat_lng = new google.maps.LatLng(this.data[i].la, this.data[i].lo);
          const marker_type = {
            url: stop_marker_image,
            // anchor: new google.maps.Point(26.5, 43),
            labelOrigin: new google.maps.Point(25, 19),
          };

          const stopped_time_label = {
            text: String(mins),
            color: 'white',
            fontSize: '12px',
            textAlign: 'center',
            x: '0',
            y: '0',
          };

          const stopped_marker = new google.maps.Marker({
            position: stopped_lat_lng,
            icon: marker_type,
            map: this.map,
            title: this.data[i].l,
            label: stopped_time_label,
          });
          this.stopped_markerss.push(stopped_marker);
          stopped_marker.setMap(this.map);
        }
      }
    }
  }

  mockDirections() {
    if (this.map !== undefined && this.map != null) {
      if (this.data.length > 0) {
        this.poly_line_data.forEach(rowData => {
          let color: string = '#26b206';
          if (rowData[0].s < 25) {
            color = '#26b206';
          } else if (rowData[0].s < 32.5) {
            color = '#FF8C00';
          } else {
            color = '#a20a0a';
          }

          const line = new google.maps.Polyline({
            strokeOpacity: 0.5,
            path: [],
            map: this.map,
            strokeWeight: 4,
            strokeColor: color,
          });
          rowData.forEach(l => line.getPath().push(new google.maps.LatLng(l.la, l.lo)));
          this.poly_lines_markers.push(line);
        });

        const start = new google.maps.LatLng(this.data[0].la, this.data[0].lo);
        const end = new google.maps.LatLng(this.data[this.data.length - 1].la, this.data[this.data.length - 1].lo);

        const start_icon = {
          url: 'assets/marker_type_green_edited_new.png',
        };

        const end_icon = {
          url: 'assets/marker_type_red_edited_new.png',
        };

        const start_data = this.data[0].l;
        const end_data = this.data[this.data.length - 1].l;

        const startInfoWindow = new google.maps.InfoWindow({
          content: start_data,
        });

        const endInfoWindow = new google.maps.InfoWindow({
          content: end_data,
        });

        this.startMarker = new google.maps.Marker({ position: start, map: this.map, icon: start_icon });
        this.endMarker = new google.maps.Marker({ position: end, map: this.map, icon: end_icon });

        this.startMarker.addListener('click', () => {
          startInfoWindow.open(this.map, this.startMarker);
        });

        this.endMarker.addListener('click', () => {
          endInfoWindow.open(this.map, this.endMarker);
        });

        this.drawStopTimeMarkers(this.select_time_interval); // for the mins and stop marker
        this.initRoute();
        this.initEvents();
      }
    } else {
      this.pendingDataSetOnMap = true;
    }
  }

  removeOldMapData() {
    this.removeStoppageMarkers();
    this.removePolylinesMarkers();
    this.reset();

    if (this.marker != null && this.marker !== undefined) {
      this.marker.setMap(null);
      this.marker = null;
    }

    if (this.startMarker != null && this.startMarker !== undefined) {
      this.startMarker.setMap(null);
      this.startMarker = null;
    }

    if (this.endMarker != null && this.endMarker !== undefined) {
      this.endMarker.setMap(null);
      this.endMarker = null;
    }
  }

  // initialize travel marker
  initRoute() {
    const vehicle_icon = {
      url: 'assets/images/new_vehivcle_Mapicon.png', // url
      animation: google.maps.Animation.DROP,
      scaledSize: new google.maps.Size(128, 128),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(53, 110),
    };
    const route = [];
    const locationArray = this.data.map(l => new google.maps.LatLng(l.la, l.lo));
    locationArray.forEach(l => route.push(l));
    // options
    const options: TravelMarkerOptions = {

      map: this.map,  // map object
      speed: 50,  // default 10 , animation speed
      interval: 10, // default 10, marker refresh time
      cameraOnMarker: true,
      speedMultiplier: this.speedMultiplier,
      markerOptions: {
        title: 'Travel Marker',
        animation: google.maps.Animation.DROP,
        icon: vehicle_icon,
      },
    };

    // define marker
    this.marker = new TravelMarker(options);
    // add locations from direction service
    this.marker.addLocation(route);
    this.marker.setMarkerOptions({ visible: false });
    setTimeout(() => this.zoomtoCoverallMarkers(), 500);
  }

  zoomtoCoverallMarkers() {
    if (this.data.length > 1 && this.data != null && this.data !== undefined) {
      const bounds = new google.maps.LatLngBounds();
      for (let i = 0; i < this.data.length; i++) {
        const myLatlng = new google.maps.LatLng(this.data[i].la, this.data[i].lo);
        bounds.extend(myLatlng);
      }
      this.map.setCenter(bounds.getCenter());
      this.map.fitBounds(bounds);
      if (this.map.getZoom() > 14) {
        this.map.setZoom(14);
      }
    }
  }

  isShowCumulativeDistance: boolean = false;
  private isPlaying: boolean = false;
  isPlayPauseBtn: boolean = true;

  play() {
    this.marker.setMarkerOptions({ visible: true });
    this.map.setZoom(14);
    this.marker.play();
    this.isShowCumulativeDistance = true;
    this.isPlaying = true;
    this.isPlayPauseBtn = false;

  }

  pause() {
    this.marker.pause();
    this.isPlaying = false;
    this.isPlayPauseBtn = true;
  }

  reset() {
    try {
      this.marker.reset();
      this.marker.setMarkerOptions({ visible: false });
    } catch (e) {

    }
    this.isShowCumulativeDistance = false;
    this.isPlayPauseBtn = true;
    this.speedMultiplier = 1;
    this.select_time_interval = 299;
  }

  next() {
    this.marker.next();
  }

  prev() {
    this.marker.prev();
  }

  fast() {
    if (this.speedMultiplier <= 64) {
      this.speedMultiplier *= 2;
      this.marker.setSpeedMultiplier(this.speedMultiplier);
    }
  }

  slow() {
    if (this.speedMultiplier >= 0.25) {
      this.speedMultiplier /= 2;
      this.marker.setSpeedMultiplier(this.speedMultiplier);
    }
  }

  // Code For the SPEEDO METER
  @ViewChild('googlechart')
  googlechart: GoogleChartComponent;
  chart: { type: string; data: (string | number)[][]; options: { width: number; height: number; greenFrom: number; greenTo: number; redFrom: number; redTo: number; yellowFrom: number; yellowTo: number; minorTicks: number; }; };

  playCount = 0;

  initEvents() {
    this.marker.event.onEvent((event: EventType, data: TravelData) => {
      const dataIndex = this.data[data.index];
      this.cumulative_distance_address = dataIndex.l;
      this.cumulative_distance = dataIndex.cd + ' KM';
      this.cumulative_time = dataIndex.nt;
      this.chart = {
        type: 'Gauge',
        data: [
          ['kmph', dataIndex.s],
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
      this.playCount = this.playCount + 1;
      if (this.playCount % 7 === 0) {
        this.marker.pause();
        this.playCount = 0;
        setTimeout(() => {
          if (this.isPlaying) {
            this.marker.play();
          }
        }, 200);
      }
      if (event === 'finished') {
        this.reset();
      }
    });
  }

  select_time_interval = 299;
  onSelectTimeInterval(event) {
    this.removeStoppageMarkers();
    this.select_time_interval = event;
    this.drawStopTimeMarkers(this.select_time_interval);
  }

  @ViewChild('fullScreen') divRef;
  openFullscreen() {
    document.getElementById('agmMap').style.height = '775px';
    const elem = this.divRef.nativeElement;
    document.getElementById('close').style.display = 'block';
    document.getElementById('open').style.display = 'none';
    document.getElementById('time_interval').style.display = 'none';

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

  closeFullscreen() {
    document.getElementById('agmMap').style.height = '500px';
    document.getElementById('open').style.display = 'block';
    document.getElementById('close').style.display = 'none';
    document.getElementById('time_interval').style.display = 'block';
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

}
