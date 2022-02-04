import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { GeofenceListResponse, GeofenceListResponseData } from '../../../@theme/components/Model/GeofenceListResponse';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { MatTableDataSource } from '@angular/material/table';
import { HomeData } from '../../../@theme/components/Model/Home';
// drop down search 
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { OpenDetailsComponent } from '../../dashboard/open-details/open-details.component';
import { MatDialog } from '@angular/material/dialog';
import { NbToastrService } from '@nebular/theme';

interface marker {
  lat: number;
  lng: number;
  markerVehicleNum?: string;
  markerDate?: string;
  markerSpeed?: string;
  markerAddress?: string;
  markerDriverName?: string;
  draggable: boolean;
  icon?: string;
  visible: boolean;
  opacity: number;
}
@Component({
  selector: 'ngx-track-nearest-vechile',
  templateUrl: './track-nearest-vechile.component.html',
  styleUrls: ['./track-nearest-vechile.component.scss']
})
export class TrackNearestVechileComponent implements OnInit {
  selectedRow: any;
  TableDataNotshow: boolean;
  map: google.maps.Map<HTMLElement>;
  wellCircle: google.maps.Circle;
  showmarker: google.maps.Marker;
  private latitude: string;
  private longitude: string;
  private place_latitude: number;
  private place_longtitude: number;
  private place_name: string;
  radiuscircle: number;
  geofenceId: string;
  searchElemant: any;
  autocomplete: google.maps.places.Autocomplete;
  searchname: string;
  dynamicZoomLevel: number;
  inputdynamicZoomLevel:number;

  HOME_DATA: HomeData[] = [];
  HOME_DATA_FOR_TABLE: HomeData[] = [];

  private MyGeofenceData: GeofenceListResponseData[] = []

  mapdisplayedColumns: string[] = ['id', 'vehicle_number', 'vehicle_type'];
  mapdataSource = new MatTableDataSource<HomeData>(this.HOME_DATA)
  locationName: string;

  public radius: FormControl = new FormControl();
  public mapsearchname: FormControl = new FormControl();

  constructor(private location: Location,
    private http: HttpClient,
    private dialog: MatDialog,
    private headerService: HeaderInteractorService,
    private uTrackService: UtrackService,
    private toasterService: NbToastrService,
  ) {

  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Track Nearest Vehicle');
    this.getGeofenceList();
    this.getVehicles();

    this.searchvehiclenumber.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
        this.filterVehicles();
      });

    this.searchElemant = document.getElementById("map_on_search");
    this.autocomplete = new google.maps.places.Autocomplete(this.searchElemant);
    this.autocomplete.setFields(
      ['geometry', 'icon', 'name', 'formatted_address']);

    this.autocomplete.addListener("place_changed", () => {
      var place = this.autocomplete.getPlace();
      this.place_name = place.formatted_address
      this.place_latitude = place.geometry.location.lat();
      this.place_longtitude = place.geometry.location.lng();

    });
  }

  getVehicles() {
    this.uTrackService.getHomeWebService().subscribe(response => {
      this.HOME_DATA = [];
      this.HOME_DATA_FOR_TABLE = [];
      if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
        this.TableDataNotshow = false;
        this.HOME_DATA = response.data;
        response.data.forEach(row => {
          this.HOME_DATA_FOR_TABLE.push(row);
        })
        this.tableData();
        this.showAllMarkers();
      } else {
        this.TableDataNotshow = true;
      }
      this.mapdataSource.data = this.HOME_DATA_FOR_TABLE;
    })
  }

  markers: marker[] = [];
  previous;
  zoom: number = 8;
  lat: number = 17.438557777777778;
  lng: number = 78.39158222222223;
  radius_val: number = 0;
  currentCenter = { lat: 17.438557777777778, lng: 78.39158222222223 };

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }
  mapClicked($event: MouseEvent) {
  }


  showAllMarkers() {
    this.HOME_DATA.forEach(row => {

      var course = String(Number(row.course) / 10);
      var live_position_value = parseInt(course) * 10;

      if (row.speed && row.devicetime && row.fixtime &&
        ((new Date()).getTime() - (new Date(row.devicetime)).getTime()) < 7200000) {

        if (Number(row.speed) > 0) {

          switch (row.vehicle_type) {

            case 'Car':
              row.listimage = 'assets/images/green-car/car_g_' + live_position_value + '.png';
              break;

            case 'Bus':
              row.listimage = 'assets/images/bus/bus_g_' + live_position_value + '.png';
              break;

            case 'Truck':
              row.listimage = 'assets/images/all-trucks/truck_g_' + live_position_value + '.png';
              break;

            case 'Auto':
              row.listimage = 'assets/images/auto/auto_g_' + live_position_value + '.png';
              break;

            case 'Bike':
              row.listimage = 'assets/images/bike/bike_g_' + live_position_value + '.png';
              break;

            case 'Mobile':
              row.listimage = 'assets/images/map_icons/marker_type_green_mobile.png';
              break;

            case 'IdCard':
              row.listimage = 'assets/images/map_icons/marker_type_green_id.png';
              break;

            case 'Scooty':
              row.listimage = 'assets/images/scooty/scooty_g_' + live_position_value + '.png';
              break;

            case 'Train':
              row.listimage = 'assets/images/train/train_g_' + live_position_value + '.png';
              break;
          }

        } else if (Number(row.speed) === 0) {

          switch (row.vehicle_type) {

            case 'Car':
              row.listimage = 'assets/images/red-car/car_r_' + live_position_value + '.png';
              break;

            case 'Bus':
              row.listimage = 'assets/images/bus/bus_r_' + live_position_value + '.png';
              break;

            case 'Truck':
              row.listimage = 'assets/images/all-trucks/truck_r_' + live_position_value + '.png';
              break;

            case 'Auto':
              row.listimage = 'assets/images/auto/auto_r_' + live_position_value + '.png';
              break;

            case 'Bike':
              row.listimage = 'assets/images/bike/bike_r_' + live_position_value + '.png';
              break;

            case 'Mobile':
              row.listimage = 'assets/images/map_icons/marker_type_red_mobile.png';
              break;

            case 'IDCard':
              row.listimage = 'assets/images/map_icons/marker_type_red_id.png';
              break;

            case 'Scooty':
              row.listimage = 'assets/images/scooty/scooty_r_' + live_position_value + '.png';
              break;

            case 'Train':
              row.listimage = 'assets/images/train/train_r_' + live_position_value + '.png';
              break;
          }
        }

      } else {

        switch (row.vehicle_type) {

          case 'Car':
            row.listimage = 'assets/images/yellow-car/car_y_' + live_position_value + '.png';
            break;

          case 'Bus':
            row.listimage = 'assets/images/bus/bus_y_' + live_position_value + '.png';
            break;

          case 'Truck':
            row.listimage = 'assets/images/all-trucks/truck_y_' + live_position_value + '.png';
            break;

          case 'Auto':
            row.listimage = 'assets/images/auto/auto_y_' + live_position_value + '.png';
            break;

          case 'Bike':
            row.listimage = 'assets/images/bike/bike_y_' + live_position_value + '.png';
            break;

          case 'Mobile':
            row.listimage = 'assets/images/map_icons/marker_type_yellow_mobile.png';
            break;

          case 'IDCard':
            row.listimage = 'assets/images/map_icons/marker_type_yellow_id.png';
            break;

          case 'Scooty':
            row.listimage = 'assets/images/scooty/scooty_y_' + live_position_value + '.png';
            break;

          case 'Train':
            row.listimage = 'assets/images/train/train_y_' + live_position_value + '.png';
            break;

        }

      }
      this.markers.push({
        lat: Number(row.latitude),
        lng: Number(row.longitude),
        draggable: false,
        markerVehicleNum: row.vehicle_number,
        markerDate: row.last_running_time,
        markerSpeed: row.speed,
        markerAddress: row.last_location,
        markerDriverName: row.driver_name,
        icon: row.listimage,
        visible: true,
        opacity: 0.4
      });

    })
  }

  tableData() {
    this.HOME_DATA_FOR_TABLE.forEach(row => {

      var listimageCarRed = "assets/images/data_list_icons/marker_type_red_car.png";
      var listimageCarGreen = "assets/images/data_list_icons/marker_type_green_car.png";
      var listimageCarYellow = "assets/images/data_list_icons/marker_type_yellow_car.png";

      var listimageBusRed = "assets/images/data_list_icons/marker_type_red_bus.png";
      var listimageBusGreen = "assets/images/data_list_icons/marker_type_green_bus.png";
      var listimageBusYellow = "assets/images/data_list_icons/marker_type_yellow_bus.png";

      var listimageTruckRed = "assets/images/data_list_icons/marker_type_red_truck.png";
      var listimageTruckGreen = "assets/images/data_list_icons/marker_type_green_truck.png";
      var listimageTruckYellow = "assets/images/data_list_icons/marker_type_yellow_truck.png";

      var listimageAutoRed = "assets/images/data_list_icons/marker_type_red_auto.png";
      var listimageAutoGreen = "assets/images/data_list_icons/marker_type_green_auto.png";
      var listimageAutoYellow = "assets/images/data_list_icons/marker_type_yellow_auto.png";

      var listimageBikeRed = "assets/images/data_list_icons/marker_type_red_bike.png";
      var listimageBikeGreen = "assets/images/data_list_icons/marker_type_green_bike.png";
      var listimageBikeYellow = "assets/images/data_list_icons/marker_type_yellow_bike.png";

      var listimageMobileRed = "assets/images/data_list_icons/marker_type_red_mobile.png";
      var listimageMobileGreen = "assets/assets/images/data_list_icons/marker_type_green_mobile.png";
      var listimageMobileYellow = "assets/images/data_list_icons/marker_type_yellow_mobile.png";

      var listimageIdCardRed = "assets/images/data_list_icons/marker_type_red_id.png";
      var listimageIdCardGreen = "assets/images/data_list_icons/marker_type_green_id.png";
      var listimageIdCardYellow = "assets/images/data_list_icons/marker_type_yellow_id.png";

      var listimageScootyRed = "assets/images/data_list_icons/marker_type_scooty_red.png";
      var listimageScootyGreen = "assets/images/data_list_icons/marker_type_scooty_green.png";
      var listimageScootyYellow = "assets/images/data_list_icons/marker_type_scooty_yellow.png";

      var listimageTrainRed = "assets/images/data_list_icons/marker_type_train_red.png";
      var listimageTrainGreen = "assets/images/data_list_icons/marker_type_train_green.png";
      var listimageTrainYellow = "assets/images/data_list_icons/marker_type_train_yellow.png";

      if (row.speed && row.devicetime && row.fixtime &&
        ((new Date()).getTime() - (new Date(row.devicetime)).getTime()) < 7200000) {

        if (Number(row.speed) > 0) {

          switch (row.vehicle_type) {
            case "Car":

              row.table_listimage = listimageCarGreen;
              break;
            case "Bus":

              row.table_listimage = listimageBusGreen;
              break;
            case "Truck":

              row.table_listimage = listimageTruckGreen;
              break;
            case "Auto":

              row.table_listimage = listimageAutoGreen;
              break;
            case "Bike":

              row.table_listimage = listimageBikeGreen;
              break;
            case "Mobile":

              row.table_listimage = listimageMobileGreen;
              break;
            case "IdCard":

              row.table_listimage = listimageIdCardGreen;
              break;
            case "Scooty":

              row.table_listimage = listimageScootyGreen;
              break;
            case "Train":

              row.table_listimage = listimageTrainGreen;
              break;
          }
        } else if (Number(row.speed) == 0) {

          switch (row.vehicle_type) {
            case "Car":

              row.table_listimage = listimageCarRed;
              break;
            case "Bus":

              row.table_listimage = listimageBusRed;
              break;
            case "Truck":

              row.table_listimage = listimageTruckRed;
              break;
            case "Auto":

              row.table_listimage = listimageAutoRed;
              break;
            case "Bike":

              row.table_listimage = listimageBikeRed;
              break;
            case "Mobile":

              row.table_listimage = listimageMobileRed;
              break;
            case "IDCard":

              row.table_listimage = listimageIdCardRed;
              break;
            case "Scooty":

              row.table_listimage = listimageScootyRed;
              break;
            case "Train":

              row.table_listimage = listimageTrainRed;
              break;
          }
        }
      } else {

        switch (row.vehicle_type) {
          case "Car":

            row.table_listimage = listimageCarYellow;
            break;
          case "Bus":

            row.table_listimage = listimageBusYellow;
            break;
          case "Truck":

            row.table_listimage = listimageTruckYellow;
            break;
          case "Auto":

            row.table_listimage = listimageAutoYellow;
            break;
          case "Bike":

            row.table_listimage = listimageBikeYellow;
            break;
          case "Mobile":

            row.table_listimage = listimageMobileYellow;
            break;
          case "IDCard":

            row.table_listimage = listimageIdCardYellow;
            break;
          case "Scooty":

            row.table_listimage = listimageScootyYellow;
            break;
          case "Train":

            row.table_listimage = listimageTrainYellow;
            break;
        }
      }
    })
  }

  addMarkers() {
    this.showAllMarkers();
  }

  removeMarkers() {
    this.markers = [];
  }

  back() {
    this.location.back()
  }

  openDetails(model_data: HomeData) {
    const rowData = JSON.stringify(model_data);
    const dialogReference = this.dialog.open(OpenDetailsComponent, {
      disableClose: true,
      data: { vehicle_number: rowData },
    });
    dialogReference.afterClosed().subscribe(() => {
      dialogReference.close();
    });
  }

  public searchvehiclenumber: FormControl = new FormControl();
  public filteredVehicleNumber: ReplaySubject<GeofenceListResponseData[]> = new ReplaySubject<GeofenceListResponseData[]>(1);

  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;

  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  private filterVehicles() {
    if (!this.MyGeofenceData) {
      return;
    }
    // get the search keyword
    let search = this.searchvehiclenumber.value;
    if (!search) {
      this.filteredVehicleNumber.next(this.MyGeofenceData);
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the 
    this.filteredVehicleNumber.next(
      this.MyGeofenceData.filter(searchData => searchData.geofence_name.toLowerCase().indexOf(search) > -1)
    );
  }


  getGeofenceList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<GeofenceListResponse>(environment.apiBaseUrl + 'geofence_list', { params }).subscribe(response => {
      this.MyGeofenceData = [];
        if (response.status && response.data != null && response.data != undefined && response.data.length > 0) {
          this.TableDataNotshow = false;
          this.MyGeofenceData = response.data
          this.filteredVehicleNumber.next(this.MyGeofenceData);
          this.mapSelectedValue(this.MyGeofenceData[0]);
          this.geofenceId = this.MyGeofenceData[0].geofence_id;
        } else {
          this.TableDataNotshow = true;
        }
    })
  }

  mapSelectedValue(row) {
    this.selectedRow = row;
    this.latitude = this.selectedRow.latitude;
    this.longitude = this.selectedRow.longitude;
    this.radiuscircle = this.selectedRow.radius;
    this.locationName = this.selectedRow.location_name;

    const convetMetersToKillometers =Number(this.selectedRow.radius)/1000;

    if (convetMetersToKillometers <= 1) {
      this.dynamicZoomLevel = 16;
    } else if (convetMetersToKillometers <= 2) {
      this.dynamicZoomLevel = 15;
    } else if (convetMetersToKillometers <= 3) {
      this.dynamicZoomLevel = 14;
    } else if (convetMetersToKillometers <= 4) {
      this.dynamicZoomLevel = 14;
    } else if (convetMetersToKillometers <= 5) {
      this.dynamicZoomLevel = 14;
    } else if (convetMetersToKillometers <= 6) {
      this.dynamicZoomLevel = 12;
    } else if (convetMetersToKillometers <= 7) {
      this.dynamicZoomLevel = 12;
    } else if (convetMetersToKillometers <= 8) {
      this.dynamicZoomLevel = 12;
    } else if (convetMetersToKillometers <= 9) {
      this.dynamicZoomLevel = 12;
    } else if (convetMetersToKillometers <= 10) {
      this.dynamicZoomLevel = 11;
    } else if (convetMetersToKillometers <= 15) {
      this.dynamicZoomLevel = 11;
    } else if (convetMetersToKillometers <= 20) {
      this.dynamicZoomLevel = 10;
    } else if (convetMetersToKillometers <= 25) {
      this.dynamicZoomLevel = 10;
    } else if (convetMetersToKillometers <= 30) {
      this.dynamicZoomLevel = 10;
    } else if (convetMetersToKillometers <= 35) {
      this.dynamicZoomLevel = 10;
    } else if (convetMetersToKillometers <= 40) {
      this.dynamicZoomLevel = 10;
    } else if (convetMetersToKillometers <= 45) {
      this.dynamicZoomLevel = 9;
    } else if (convetMetersToKillometers <= 50) {
      this.dynamicZoomLevel = 9;
    } else if (convetMetersToKillometers <= 55) {
      this.dynamicZoomLevel = 9;
    } else if (convetMetersToKillometers <= 60) {
      this.dynamicZoomLevel = 9;
    } else if (convetMetersToKillometers <= 65) {
      this.dynamicZoomLevel = 9;
    } else if (convetMetersToKillometers <= 70) {
      this.dynamicZoomLevel = 9;
    } else if (convetMetersToKillometers <= 75) {
      this.dynamicZoomLevel = 8;
    } else if (convetMetersToKillometers <= 80) {
      this.dynamicZoomLevel = 8;
    } else if (convetMetersToKillometers <= 85) {
      this.dynamicZoomLevel = 8;
    } else if (convetMetersToKillometers <= 90) {
      this.dynamicZoomLevel = 8;
    } else if (convetMetersToKillometers <= 95) {
      this.dynamicZoomLevel = 8;
    } else if (convetMetersToKillometers <= 100) {
      this.dynamicZoomLevel = 8;
    } else if (convetMetersToKillometers >= 100) {
      this.dynamicZoomLevel = 7;
    }

    this.zoom =  this.dynamicZoomLevel;

    this.lat = Number(this.selectedRow.latitude);
    this.lng = Number(this.selectedRow.longitude);
    this.radius_val = Number(this.selectedRow.radius);
    this.currentCenter = { lat: this.lat, lng: this.lng }
  }

  submit() {
    if (this.mapsearchname.value == null || this.mapsearchname.value == undefined || this.mapsearchname.value == '') {
      this.toasterService.danger("", "Please Enter Geofence Loction Name");
    } else if (this.radius.value == null || this.radius.value == undefined || this.radius.value == '') {
      this.toasterService.danger("", "Please Enter Radius");
    } else if (this.radius.value > 10000) {
      this.toasterService.danger("", "Please Enter Below 10000 Radius");
    } else {
      this.latitude = '' + this.place_latitude;
      this.longitude = '' + this.place_longtitude;
      this.locationName = this.place_name;
      this.radiuscircle = this.radius.value;
      this.lat = Number('' + this.place_latitude);
      this.lng = Number('' + this.place_longtitude);
      this.radius_val = Number(this.radius.value) * 1000;
      this.currentCenter = { lat: this.lat, lng: this.lng }

      if (this.radius.value == 1) {
        this.inputdynamicZoomLevel = 15;
      } else if (this.radius.value == 2) {
        this.inputdynamicZoomLevel = 14;
      } else if (this.radius.value == 3) {
        this.inputdynamicZoomLevel = 13;
      } else if (this.radius.value == 4) {
        this.inputdynamicZoomLevel = 13;
      } else if (this.radius.value == 5) {
        this.inputdynamicZoomLevel = 12;
      } else if (this.radius.value == 6) {
        this.inputdynamicZoomLevel = 12;
      } else if (this.radius.value == 7) {
        this.inputdynamicZoomLevel = 12;
      } else if (this.radius.value == 8) {
        this.inputdynamicZoomLevel = 12;
      } else if (this.radius.value == 9) {
        this.inputdynamicZoomLevel = 12;
      } else if (this.radius.value == 10) {
        this.inputdynamicZoomLevel = 11;
      } else if (this.radius.value <= 15) {
        this.inputdynamicZoomLevel = 11;
      } else if (this.radius.value <= 20) {
        this.inputdynamicZoomLevel = 10;
      } else if (this.radius.value <= 25) {
        this.inputdynamicZoomLevel = 10;
      } else if (this.radius.value <= 30) {
        this.inputdynamicZoomLevel = 10;
      } else if (this.radius.value <= 35) {
        this.inputdynamicZoomLevel = 10;
      } else if (this.radius.value <= 40) {
        this.inputdynamicZoomLevel = 10;
      } else if (this.radius.value <= 45) {
        this.inputdynamicZoomLevel = 9;
      } else if (this.radius.value <= 50) {
        this.inputdynamicZoomLevel = 9;
      } else if (this.radius.value <= 55) {
        this.inputdynamicZoomLevel = 9;
      } else if (this.radius.value <= 60) {
        this.inputdynamicZoomLevel = 9;
      } else if (this.radius.value <= 65) {
        this.inputdynamicZoomLevel = 9;
      } else if (this.radius.value <= 70) {
        this.inputdynamicZoomLevel = 9;
      } else if (this.radius.value <= 75) {
        this.inputdynamicZoomLevel = 8;
      } else if (this.radius.value <= 80) {
        this.inputdynamicZoomLevel = 8;
      } else if (this.radius.value <= 85) {
        this.inputdynamicZoomLevel = 8;
      } else if (this.radius.value <= 90) {
        this.inputdynamicZoomLevel = 8;
      } else if (this.radius.value <= 95) {
        this.inputdynamicZoomLevel = 8;
      } else if (this.radius.value <= 100) {
        this.inputdynamicZoomLevel = 8;
      } else if (this.radius.value >= 100) {
        this.inputdynamicZoomLevel = 7;
      }
      this.zoom = this.inputdynamicZoomLevel;   
    }
  }

}
