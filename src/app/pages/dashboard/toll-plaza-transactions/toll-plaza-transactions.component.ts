import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import * as _moment from 'moment';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { TollPlazaResponse, TollPlazaResponseData } from '../../../@theme/components/Model/TollPlazaResponse';
import { ProgressDialogComponent } from '../../progress-dialog/progress-dialog.component';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { TollChargesDialogComponent } from './toll-charges-dialog/toll-charges-dialog.component';
import { MapsAPILoader } from '@agm/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { Location } from '@angular/common';
import { GetTollPlazaListStateListData } from '../../../@theme/components/Model/GetTollPlazaListStateListResponse';


export const MY_FORMATS = {
  display: {
    dateInput: 'DD MMM YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MM YYYY',
  },
};
interface marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}
@Component({
  selector: 'ngx-toll-plaza-transactions',
  templateUrl: './toll-plaza-transactions.component.html',
  styleUrls: ['./toll-plaza-transactions.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class TollPlazaTransactionsComponent implements OnInit {

  TableDataNotshow:boolean;
  ELEMENT_DATA: TollPlazaResponseData[] = [];
  displayedColumns: string[] = ['id', 'toll_name', 'state', 'district', 'location', 'project_type', 'contractor_name', 'last_modified_date'];
  dataSource = new MatTableDataSource<TollPlazaResponseData>(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('content') content: ElementRef;

  map: any;
  source_location: any;
  source_autocomplete: any;
  desitination_location: any;
  desitination_autocomplete: any;
  sourceLatLong: any;
  destinationLatlng: any
  destinatonlatitude: any;
  destinatonlongitude: any;
  sourcelatitude: any;
  sourcelongitude: any;
  selected = '0';
  StateName: GetTollPlazaListStateListData[] = []
  selectall: string;

  constructor(private headerService: HeaderInteractorService,
    private dialog: MatDialog,
    private uTrackService: UtrackService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private location: Location,
  ) {
 
  }


  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Toll Plaza Information');
    this.get_toll_plaza_list('');
    this.dataSource.sort = this.sort;
    this.getStateName();
    this.selectall = ''

    this.searchStateName.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStateName();
      });
  }

  icon = {
    url: './assets/images/pin_start.png',
    scaledSize: {
      width: 40,
      height: 60
    }
  }

  zoom: number = 8;

  // initial center position for the map
  lat: number = 20.5937;
  lng: number = 78.9629;
  previous;
  markers: marker[] = []
  start_end_mark = [];
  latlng = [];

  public searchStateName: FormControl = new FormControl();
  public filteredStateName: ReplaySubject<GetTollPlazaListStateListData[]> = new ReplaySubject<GetTollPlazaListStateListData[]>(1);

  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();


  private filterStateName() {
    if (!this.StateName) {
      return;
    }
    // get the search keyword
    let search = this.searchStateName.value;
    if (!search) {
      this.filteredStateName.next(this.StateName);
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the 
    this.filteredStateName.next(
      this.StateName.filter(searchData => searchData.state_name.toLowerCase().indexOf(search) > -1)
    );
  }

  getStateName() {
    this.uTrackService.get_toll_plaza_list_state_list().subscribe(response => {
      this.StateName = response.data
      this.filteredStateName.next(this.StateName);
    })
  }

  updateSelectedValue(StateName){
    this.get_toll_plaza_list(StateName)
  }

  selectAllDropDownBtn() {
    this.get_toll_plaza_list('')
  }

  back() {
    this.location.back()
  }


  get_toll_plaza_list(StateName) {
    this.ELEMENT_DATA = [];
    const formData = new FormData();
    formData.append('user_id', localStorage.getItem("USER_ID"));
    formData.append('user_type', localStorage.getItem("USER_TYPE"));
    formData.append('device_token', "Web");
    formData.append('state_name', StateName);
    this.uTrackService.get_toll_plaza_list(formData)
      .subscribe(response => {
        this.ELEMENT_DATA=[];
        if (response.status) {
          if (response.data != null && response.data != undefined && response.data.length > 0) {
            this.TableDataNotshow=false;
            var dialogRefe = this.dialog.open(ProgressDialogComponent, {
              disableClose: true
            })
            this.ELEMENT_DATA = response.data;
            this.ELEMENT_DATA.forEach(data => {
              this.markers.push({
                lat: Number(data.latitude),
                lng: Number(data.longitude),
                label: data.toll_name + ' ' + data.location,
                draggable: false,

              })
              var arrayA = [Number(data.latitude), Number(data.longitude)];
              this.latlng.push(arrayA)
              dialogRefe.close();
            })
          }else{
            this.TableDataNotshow=true;
          }
        }else{
          this.TableDataNotshow=true;
        }
        this.dataSource.data = this.ELEMENT_DATA;
      });
  }

  markerDragEnd(m: marker, $event: MouseEvent) {
  }

  clickedMarker(infowindow) {
    if (this.previous) {
      this.previous.close();
    }
    this.previous = infowindow;
  }

  showCharges(element: TollPlazaResponseData) {
    let rowData = JSON.stringify(element)
    let dialogReference = this.dialog.open(TollChargesDialogComponent, {
      width: '55%',
      position: <DialogPosition>{
        top: '5%'
      },
      data: { toll_plaza_id: rowData }
    })
    dialogReference.afterClosed().subscribe(result => {
      this.get_toll_plaza_list('');
    })
  }


  TollRoute = new FormGroup({
    searchControl: new FormControl(''),
    endsearchControl: new FormControl(''),
    selected: new FormControl(''),
  })

  isSelectedMapTab: boolean = false;
  selectedIndex = 0;

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


  mapTab($event) {
    if ($event.index === 2) {
      this.isSelectedMapTab = true;
      if (this.map == null || this.map === undefined) {

        var directionsService = new google.maps.DirectionsService();
        var directionsRenderer = new google.maps.DirectionsRenderer()

        this.map = new google.maps.Map(document.getElementById('tollmap'), {
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

        directionsRenderer.setMap(this.map);

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
          map: this.map,
          // icon: './assets/images/pin_start.png',
          anchorPoint: new google.maps.Point(0, -29)
        });

        this.source_autocomplete.addListener("place_changed", () => {

          var place = this.source_autocomplete.getPlace();

          this.map.setCenter(place.geometry.location);
          this.map.setZoom(8);
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
          source_infowindow.open(this.map, sourceMarker);

          this.calculateAndDisplayRoute(directionsService, directionsRenderer);

        });

        this.desitination_location = document.getElementById('destination_location');
        this.desitination_autocomplete = new google.maps.places.Autocomplete(this.desitination_location);
        this.desitination_autocomplete.setFields(
          ['address_components', 'geometry', 'icon', 'name', 'formatted_address']);

        var destinatonMarker = new google.maps.Marker({
          map: this.map,
          // icon: './assets/images/pin_start.png',
          anchorPoint: new google.maps.Point(0, -29)
        });

        this.desitination_autocomplete.addListener("place_changed", () => {

          var place = this.desitination_autocomplete.getPlace();

          this.map.setCenter(place.geometry.location);
          this.map.setZoom(8); // Why 17? Because it looks good.

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
          destination_infowindow.open(this.map, destinatonMarker);

          this.calculateAndDisplayRoute(directionsService, directionsRenderer);
        });

      }
    } else {
      this.isSelectedMapTab = false;
    }
  }

}


