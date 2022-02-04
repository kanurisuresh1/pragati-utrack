import { Component, OnInit } from '@angular/core';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { Location } from '@angular/common';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { NbToastrService } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-create-geofence',
  templateUrl: './create-geofence.component.html',
  styleUrls: ['./create-geofence.component.scss']
})
export class CreateGeofenceComponent implements OnInit {
  latitude: any;
  longitude: any;
  searchElemant: any;
  autocomplete: google.maps.places.Autocomplete;
  map: google.maps.Map<HTMLElement>;
  addressName: string;
  searchname: string;
  geofenceId: string;
  isSubmit: boolean;
  lat: string;
  long: string;
  radius: Number;
  location_name: string;
  geofence_name: string;

  constructor(
    private headerService: HeaderInteractorService,
    private location: Location,
    private toasterService: NbToastrService,
    private uTrackService: UtrackService,
    private activatedRoute: ActivatedRoute,) {
    this.activatedRoute.params.subscribe(params => {
      this.geofenceId = params.geofence_id;
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
    this.initMap();
    if (this.geofenceId == undefined) {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Create Geofence');
      this.isSubmit = true;
    } else {
      this.headerService.updateHeaderTitle('HEADER_NAMES.Edit Geofence');
      this.isSubmit = false;
    }
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
      infowindowContent.children['place-address'].textContent = this.searchname;
      infowindow.open(map, marker);
    });

    if (this.geofenceId == undefined) {

    } else {
      this.searchname = this.location_name;
      this.latitude = this.lat;
      this.longitude = this.long;
      var myLatLng = {
        lat: parseFloat(this.lat),
        lng: parseFloat(this.long)
      };

      map.setCenter(myLatLng);
      map.setZoom(17); // Why 17? Because it looks good. 

      marker.setPosition(myLatLng);
      marker.setVisible(true);

      infowindowContent.children['place-address'].textContent = this.searchname;
      infowindow.open(map, marker);
    }
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
      this.toasterService.danger("", "Please login with your credentials to proceed, This is demo account.")
    } else {
      if (this.geofenceId == undefined) {
        if (this.CreateGeofenceForm.value.radius > 10000) {
          this.toasterService.danger("", "Please Enter Below 10000 Radius")
        } else {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('geofence_name', this.CreateGeofenceForm.value.geofencename);
          formData.append('location_name', this.searchname);
          formData.append('radius', this.CreateGeofenceForm.value.radius);
          formData.append('device_link_id', "1");
          formData.append('device_token', "web");
          formData.append('latitude', this.latitude);
          formData.append('longitude', this.longitude);
          this.uTrackService.geofence_create(formData).subscribe(response => {
            if (response.status) {
              this.toasterService.success('', response.message)
              this.location.back();
            } else {
              this.toasterService.danger('', response.message)
            }
          })
        }
      } else {
        if (this.CreateGeofenceForm.value.radius > 10000) {
          this.toasterService.danger('', "Please enter below 10000 radius")
        } else {
          const formData = new FormData();
          formData.append('user_id', localStorage.getItem('USER_ID'));
          formData.append('geofence_name', this.CreateGeofenceForm.value.geofencename);
          formData.append('location_name', this.searchname);
          formData.append('radius', this.CreateGeofenceForm.value.radius);
          formData.append('device_link_id', "1");
          formData.append('device_token', "web");
          formData.append('latitude', this.latitude);
          formData.append('longitude', this.longitude);
          formData.append('device_geofence_trans_id', this.geofenceId);
          formData.append('status', 'Active');
          this.uTrackService.geofence_edit(formData).subscribe(response => {
            if (response.status) {
              this.toasterService.success('', response.message)
              this.location.back();
            } else {
              this.toasterService.danger('', response.message)
            }
          })
        }
      }
    }
  }

}
