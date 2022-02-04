import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { HomeData } from '../../../../@theme/components/Model/Home';

@Component({
  selector: 'ngx-geofence-details',
  templateUrl: './geofence-details.component.html',
  styleUrls: ['./geofence-details.component.scss']
})
export class GeofenceDetailsComponent implements OnInit {

  public lat: string;
  public long: string;
  public radius: number;
  public geofence_name: string;
  public location_name: string;
  public map: google.maps.Map<HTMLElement>;

  constructor(private headerService: HeaderInteractorService, private location: Location, private routes: Router,
    private activatedRoute: ActivatedRoute, private uTrackService: UtrackService
  ) {
    this.activatedRoute.params.subscribe(params => {
      this.lat = params.latitude;
      this.long = params.longitude;
      this.radius = params.radius;
      this.location_name = params.location_name;
      this.geofence_name = params.geofence_name;
    });

  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.My Geofence Details');

    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: parseFloat(this.lat),
        lng: parseFloat(this.long)
      },
      zoom: 8,
      disableDefaultUI: true,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });
    this.home();
    this.showmapmarker();
  }


  showmapmarker() {
    var latlng = new google.maps.LatLng(parseFloat(this.lat), parseFloat(this.long));
    new google.maps.Circle({
      strokeColor: '#563ee2',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#6beb86',
      fillOpacity: 0.35,
      map: this.map,
      center: latlng,
      radius: Math.round(this.radius)
    });
    // var image = 'assets/images/data_list_icons/blue.png'
    var marker = new google.maps.Marker({
      position: latlng,
      map: this.map,
      // icon: image
    });

    var locationName = this.location_name;
    var infowindow = new google.maps.InfoWindow({
      content: locationName
    });
    infowindow.open(this.map, marker);
    this.map.setZoom(16);
    this.map.setCenter(latlng);
  }

  HOME_DATA: HomeData[];

  // Vehicle Status
  totalVehicle = 0;
  insideVehicle = 0;
  outsideVehicle = 0;
  dataNotFoundVehicle = 0;

  todayDate = new Date().getTime();

  home() {
    this.uTrackService.getHomeWebService().subscribe(response => {
      if (response.status) {
        this.HOME_DATA = response.data;
        this.totalVehicle = Number(this.HOME_DATA.length);
        this.HOME_DATA.forEach(data => {
          this.todayDate = new Date().getTime();
          if (data.devicetime == null || data.devicetime === undefined || data.devicetime === '' ||
            data.fixtime == null || data.fixtime === undefined || data.fixtime === '') {
            this.dataNotFoundVehicle = this.dataNotFoundVehicle + 1;
          } else {
            const lastTravelTime = Date.parse(data.devicetime);
            if ((this.todayDate - lastTravelTime) > 7200000) {
              this.dataNotFoundVehicle = this.dataNotFoundVehicle + 1;
            } else {
              if (this.getDistanceFromLatLonInKm(Number(this.lat), Number(this.long),
                Number(data.latitude), Number(data.longitude)) > this.radius) {
                this.outsideVehicle = this.outsideVehicle + 1;
              } else {
                this.insideVehicle = this.insideVehicle + 1;
              }
            }
          }
        });
      }
    });
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    var m = d / 1000; // Distance in meteres 
    return m;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  back() {
    this.location.back();
  }

}
