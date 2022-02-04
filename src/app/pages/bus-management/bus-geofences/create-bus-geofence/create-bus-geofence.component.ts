import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { NbToastrService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { BusGeofenceDetailsResponseData } from '../../../../@theme/components/Model/BusGeofenceDetailsResponse';

@Component({
  selector: 'ngx-create-bus-geofence',
  templateUrl: './create-bus-geofence.component.html',
  styleUrls: ['./create-bus-geofence.component.scss']
})
export class CreateBusGeofenceComponent implements OnInit {

  latitude: any;
  longitude: any;
  searchElemant: any;
  autocomplete: google.maps.places.Autocomplete;
  map: google.maps.Map<HTMLElement>;
  addressName: string;
  searchname: string;

  geofence_id: string = '';
  isCreateGeofence: boolean = true;

  constructor(private headerService: HeaderInteractorService,
    private location: Location,
    private toasterService: NbToastrService,
    private uTrackService: UtrackService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {
    translate.setDefaultLang('en');
    this.activatedRoute.params.subscribe(params => {
      this.geofence_id = params.geofence_id;
    });
  }

  ngOnInit(): void {
    this.uTrackService.isUserValid();

    if (this.geofence_id == undefined || this.geofence_id == null
      || this.geofence_id == '') {
      this.headerService.updateHeaderTitle('Create Geofence');
      this.isCreateGeofence = true;
    } else {
      this.headerService.updateHeaderTitle('Edit Geofence');
      this.isCreateGeofence = false;
      this.bus_geofence_detail();
    }

    this.initMap();
  }

  initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 20.5937,
        lng: 78.9629
      },
      zoom: 5,
      disableDefaultUI: true,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });

    this.searchElemant = document.getElementById("map_on_search");

    this.autocomplete = new google.maps.places.Autocomplete(this.searchElemant);

    this.autocomplete.setFields(
      ['geometry', 'icon', 'name', 'formatted_address']);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');

    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    this.autocomplete.addListener("place_changed", () => {
      var place = this.autocomplete.getPlace();
      this.searchname = place.formatted_address
      this.latitude = place.geometry.location.lat();
      this.longitude = place.geometry.location.lng();

      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17); // Why 17? Because it looks good.
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = place.formatted_address;
      infowindow.open(map, marker);
    });

  }

  geofence_details: BusGeofenceDetailsResponseData;
  geofence_name: string;
  radius: string;
  device_geofence_trans_id: string;

  bus_geofence_detail() {
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem('USER_ID'));
    formData.append('geofence_id', this.geofence_id);
    this.uTrackService.bus_geofence_detail(formData).subscribe(response => {
      if (response.status) {
        if (response.data != undefined && response.data != null) {
          this.geofence_details = response.data;
          this.geofence_name = this.geofence_details.geofence_name;
          this.radius = this.geofence_details.radius;
          this.searchname = this.geofence_details.location_name;
          this.device_geofence_trans_id = this.geofence_details.device_geofence_trans_id;
        }
      }
    })
  }

  back() {
    this.location.back();
  }

  CreateGeofenceForm = new FormGroup({
    geofencename: new FormControl('', [Validators.required]),
    radius: new FormControl('', [Validators.required]),
    mapsearchname: new FormControl('', [Validators.required]),
  })

  submit() {

    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger("Please login with your credentials to proceed, This is demo account.")
    } else {
      if (this.CreateGeofenceForm.value.radius > 10000) {
        alert("Please enter below 10000 radius");
      } else {

        if (this.isCreateGeofence) {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('user_type', localStorage.getItem('USER_TYPE'));
          formData.append('device_token', "web");
          formData.append('geofence_name', this.CreateGeofenceForm.value.geofencename);
          formData.append('latitude', this.latitude);
          formData.append('longitude', this.longitude);
          formData.append('location_name', this.searchname);
          formData.append('radius', this.CreateGeofenceForm.value.radius);

          this.uTrackService.bus_geofence_create(formData).subscribe(response => {
            if (response.status) {
              if (response.data != undefined && response.data != null) {
                this.toasterService.success('Pragati Utrack', response.message)
                this.location.back();
              }
            } else {
              this.toasterService.danger('Pragati Utrack', response.message)
            }
          })
        } else {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('user_type', localStorage.getItem('USER_TYPE'));
          formData.append('device_token', "web");
          formData.append('geofence_name', this.CreateGeofenceForm.value.geofencename);
          formData.append('latitude', this.latitude);
          formData.append('longitude', this.longitude);
          formData.append('location_name', this.searchname);
          formData.append('radius', this.CreateGeofenceForm.value.radius);
          formData.append('device_geofence_trans_id', this.device_geofence_trans_id);

          this.uTrackService.bus_geofence_edit(formData).subscribe(response => {
            if (response.status) {
              if (response.data != undefined && response.data != null) {
                this.toasterService.success('Pragati Utrack', response.message)
                this.location.back();
              }
            } else {
              this.toasterService.danger('Pragati Utrack', response.message)
            }
          })
        }

      }
    }
  }


}
