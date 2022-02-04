import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';
import { NbToastrService } from '@nebular/theme';
import { MatTableDataSource } from '@angular/material/table';
import { MyRoutesInterMediateStopsResponseData } from '../../../../@theme/components/Model/MyRoutesInterMediateStopsResponse';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-create-route',
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.scss']
})
export class CreateRouteComponent implements OnInit {
  source_location: any;
  source_autocomplete: any;
  sourceLatLong: string;
  sourcelatitude: string;
  sourcelongitude: string;

  desitination_location: any;
  desitination_autocomplete: any;
  destinationLatlng: string
  destinatonlatitude: string;
  destinatonlongitude: string;

  test_location: any;
  test_autocomplete: any;
  testLatlng: string;
  testlatitude: string;
  testLongitude: string;


  return_stop_source_location: any;
  return_stop_source_latitude: string;
  return_stop_source_longitude: string;
  return_stop_source_autocomplete: any;
  return_stop_source_Latlng: string;

  interStopsData: MyRoutesInterMediateStopsResponseData[] = []
  displayedColumn: string[] = ['id', 'stop_location', 'stop_lat', 'stop_lon', 'action'];
  interStopsDataSource = new MatTableDataSource<MyRoutesInterMediateStopsResponseData>(this.interStopsData)

  returnStopsData: MyRoutesInterMediateStopsResponseData[] = []
  displayedReturnColumn: string[] = ['id', 'stop_location', 'stop_lat', 'stop_lon', 'action'];
  returnStopsDataSource = new MatTableDataSource<MyRoutesInterMediateStopsResponseData>(this.returnStopsData)

  constructor(private headerService: HeaderInteractorService,
    private location: Location,
    private toasterService: NbToastrService,
    private uTrackService: UtrackService) { }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Create Route')
    this.initMap();
  }

  back() {
    this.location.back();
  }

  calculateAndDisplayRoute(directionsService, directionsRenderer) {
    if (this.sourceLatLong != null && this.destinationLatlng != null) {
      directionsService.route({
        origin: {
          query: this.sourceLatLong
        },
        destination: {
          query: this.destinationLatlng
        },
        travelMode: 'DRIVING'
      },
        function (response, status) {
          if (status === 'OK') {
            directionsRenderer.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
    }
  }

  initMap() {
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer = new google.maps.DirectionsRenderer();

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

    directionsRenderer.setMap(map);

    var source_infowindow = new google.maps.InfoWindow();
    var source_infowindowContent = document.getElementById('source_infowindowContent');
    source_infowindow.setContent(source_infowindowContent);

    var destination_infowindow = new google.maps.InfoWindow();
    var destination_infowindowContent = document.getElementById('destination_infowindowContent');
    destination_infowindow.setContent(destination_infowindowContent);

    this.source_location = document.getElementById('source_location');

    this.source_autocomplete = new google.maps.places.Autocomplete(this.source_location);

    this.source_autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name', 'formatted_address']);

    var sourceMarker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    this.source_autocomplete.addListener("place_changed", () => {
      var place = this.source_autocomplete.getPlace();
      map.setCenter(place.geometry.location);
      map.setZoom(8);
      this.sourcelatitude = place.geometry.location.lat();
      this.sourcelongitude = place.geometry.location.lng();
      this.sourceLatLong = place.formatted_address;

      sourceMarker.setPosition(place.geometry.location);
      sourceMarker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      source_infowindowContent.children['place-icon'].src = place.icon;
      source_infowindowContent.children['place-name'].textContent = place.name;
      source_infowindowContent.children['place-address'].textContent = address;
      source_infowindow.open(map, sourceMarker);
      // this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    });

    this.desitination_location = document.getElementById('destination_location');
    this.desitination_autocomplete = new google.maps.places.Autocomplete(this.desitination_location);
    this.desitination_autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name', 'formatted_address']);

    var destinatonMarker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    this.desitination_autocomplete.addListener("place_changed", () => {
      var place = this.desitination_autocomplete.getPlace();

      map.setCenter(place.geometry.location);
      map.setZoom(8); // Why 17? Because it looks good.

      this.destinatonlatitude = place.geometry.location.lat();
      this.destinatonlongitude = place.geometry.location.lng();

      this.destinationLatlng = place.formatted_address;

      destinatonMarker.setPosition(place.geometry.location);
      destinatonMarker.setVisible(true);

      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      destination_infowindowContent.children['place-icon'].src = place.icon;
      destination_infowindowContent.children['place-name'].textContent = place.name;
      destination_infowindowContent.children['place-address'].textContent = address;
      destination_infowindow.open(map, destinatonMarker);
      // this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    });


    // InterMediate Stops Search Auto Complete
    this.test_location = document.getElementById('test_location');
    this.test_autocomplete = new google.maps.places.Autocomplete(this.test_location);
    this.test_autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name', 'formatted_address']);

    this.test_autocomplete.addListener("place_changed", () => {
      var place = this.test_autocomplete.getPlace();
      this.testlatitude = place.geometry.location.lat();
      this.testLongitude = place.geometry.location.lng();
      this.testLatlng = place.formatted_address;
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      destination_infowindowContent.children['place-icon'].src = place.icon;
      destination_infowindowContent.children['place-name'].textContent = place.name;
      destination_infowindowContent.children['place-address'].textContent = address;
      destination_infowindow.open(map, destinatonMarker);
      // this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    });

    // Return Intermediate Stops List

    this.return_stop_source_location = document.getElementById('return_stop_location');
    this.return_stop_source_autocomplete = new google.maps.places.Autocomplete(this.return_stop_source_location);
    this.return_stop_source_autocomplete.setFields(
      ['address_components', 'geometry', 'icon', 'name', 'formatted_address']);
    this.return_stop_source_autocomplete.addListener("place_changed", () => {
      var place = this.return_stop_source_autocomplete.getPlace();
      this.return_stop_source_latitude = place.geometry.location.lat();
      this.return_stop_source_longitude = place.geometry.location.lng();
      this.return_stop_source_Latlng = place.formatted_address;
      var address = '';
      if (place.address_components) {
        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      destination_infowindowContent.children['place-icon'].src = place.icon;
      destination_infowindowContent.children['place-name'].textContent = place.name;
      destination_infowindowContent.children['place-address'].textContent = address;
      destination_infowindow.open(map, destinatonMarker);
      // this.calculateAndDisplayRoute(directionsService, directionsRenderer);
    });
  }

  createRoute = new FormGroup({
    routtename: new FormControl('', [Validators.required]),
    selecttriptype: new FormControl('', [Validators.required]),
    selectroutetype: new FormControl('', [Validators.required]),
    startlocation: new FormControl('', [Validators.required]),
    endlocation: new FormControl('', [Validators.required]),
    testlocation: new FormControl('', []),
    returnStoplocation: new FormControl('', []),
    routenote: new FormControl('', [Validators.required]),
    routestatus: new FormControl('', [Validators.required]),
  })

  submit() {
    if (localStorage.getItem("MOBILE") == "9966663333") {
      this.toasterService.danger('', "Please login with your credentials to proceed, This is demo account.")
    } else {
      var stopsData: MyRoutesInterMediateStopsResponseData[] = []
      if (this.interStopsData.length > 0) {
        stopsData.push(...this.interStopsData)
      }

      if (this.returnStopsData.length > 0) {
        stopsData.push(...this.returnStopsData)
      }

      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('device_token', "web");
      formData.append('route_name', this.createRoute.value.routtename);
      formData.append('is_round_trip', this.createRoute.value.selecttriptype);
      formData.append('route_type', this.createRoute.value.selectroutetype);
      formData.append('start_lat', this.sourcelatitude);
      formData.append('start_lon', this.sourcelongitude);
      formData.append('start_location', this.sourceLatLong);
      formData.append('end_lat', this.destinatonlatitude);
      formData.append('end_lon', this.destinatonlongitude);
      formData.append('end_location', this.destinationLatlng);
      formData.append('route_notes', this.createRoute.value.routenote);
      formData.append('status', this.createRoute.value.routestatus);
      formData.append('distance', "0");
      formData.append('stop_json', JSON.stringify(stopsData));
      formData.append('start_station_id', "0");
      formData.append('end_station_id', "0");
      formData.append('travel_time_mins', "0");
      formData.append('user_type', "Customer");

      this.uTrackService.route_create(formData).subscribe(response => {
        if (response.status) {
          this.toasterService.success('', response.message)
          this.location.back();
        } else {
          this.toasterService.danger('', response.message)
        }
      })
    }
  }

  public show: boolean = true;
  public isInsterStopAdd: boolean = true;
  inter_stop_input_data: string = '';

  addIntermediate() {
    this.show = false;
    this.isInsterStopAdd = false;
    this.inter_stop_input_data = '';
  }

  addInterStopLocation() {
    this.interStopsData.push({ stop_lat: this.testlatitude, stop_location: this.testLatlng, stop_lon: this.testLongitude, is_return_stop: '0' });
    this.interStopsDataSource.data = this.interStopsData;
    this.show = true;
    this.isInsterStopAdd = true;
    this.inter_stop_input_data = '';
  }

  cancelInterStop() {
    this.show = true;
    this.isInsterStopAdd = true;
    this.inter_stop_input_data = '';
  }

  delete(index) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to remove delete',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ce1212',
      cancelButtonColor: '#81b214',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.interStopsData.splice(index, 1);
        this.interStopsDataSource.data = this.interStopsData;
      } else {
        result.dismiss === Swal.DismissReason.cancel
      }
    })
  }

  public showReturn: boolean = true;
  public isreturnStopAdd: boolean = true;
  return_stop_input_data: string = '';

  addreturnStop() {
    this.showReturn = false;
    this.isreturnStopAdd = false;
    this.return_stop_input_data = '';
  }

  addreturnStopLocation() {
    this.returnStopsData.push({ stop_lat: this.return_stop_source_latitude, stop_location: this.return_stop_source_Latlng, stop_lon: this.return_stop_source_longitude, is_return_stop: '1' });
    this.returnStopsDataSource.data = this.returnStopsData;
    this.showReturn = true;
    this.isreturnStopAdd = true;
    this.return_stop_input_data = '';
  }

  cancelReturnStop() {
    this.showReturn = true;
    this.isreturnStopAdd = true;
    this.return_stop_input_data = '';
  }

  returndelete(index) {

    Swal.fire({
      title: 'Are you sure?',
      text: 'you want to remove delete',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ce1212',
      cancelButtonColor: '#81b214',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {
        this.returnStopsData.splice(index, 1);
        this.returnStopsDataSource.data = this.returnStopsData;
      } else {
        result.dismiss === Swal.DismissReason.cancel
      }
    })
  }
}
