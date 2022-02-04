import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FastTagResponseData } from '../../../@theme/components/Model/FastTagResponse';
import { FuelPriceListResponseData } from '../../../@theme/components/Model/FuelPriceListResponse';
import { FuelStatesResponseData } from '../../../@theme/components/Model/FuelStateResponse';
import { States } from '../../../@theme/components/Model/StateRessponse';
import { HeaderInteractorService } from '../../../@theme/components/Services/header-interactor.service';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
// drop down search
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'ngx-fuel-price-info',
  templateUrl: './fuel-price-info.component.html',
  styleUrls: ['./fuel-price-info.component.scss']
})
export class FuelPriceInfoComponent implements OnInit {
  elem: HTMLElement;
  TableDataNotshow:boolean;
  constructor(
    private uTrackService: UtrackService,
    private headerService: HeaderInteractorService,
    private location: Location,
  ) {
  
   }

  ngOnInit(): void {
    this.getStatesList();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Fuel Prices Information');
    this.uTrackService.translateLanguage();
    this.uTrackService.isUserValid();
    this.dataSource.sort = this.sort;
    this.elem = document.documentElement;

    this.searchStateName.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterStateName();
      });
  }

  ELEMENT_DATA: FuelPriceListResponseData[] = [];
  displayedColumns: string[] = ['id', 'district_name', 'hp_petrol_price', 'hp_diesel_price', 'ioc_petrol_price', 'ioc_diesel_price'];
  dataSource = new MatTableDataSource<FuelPriceListResponseData>(this.ELEMENT_DATA);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('content') content: ElementRef;

  states: FuelStatesResponseData[] = [];
  state_id: string;


  public searchStateName: FormControl = new FormControl();

  public filteredStateName: ReplaySubject<FuelStatesResponseData[]> = new ReplaySubject<FuelStatesResponseData[]>(1);

  @ViewChild('singleSelect', { static: false }) singleSelect: MatSelect;
  /** Subject that emits when the component has been destroyed. */
  private _onDestroy = new Subject<void>();

  private filterStateName() {
    if (!this.states) {
      return;
    }
    // get the search keyword
    let search = this.searchStateName.value;
    if (!search) {
      this.filteredStateName.next(this.states);
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the
    this.filteredStateName.next(
      this.states.filter(searchData => searchData.state.toLowerCase().indexOf(search) > -1),
    );
  }

  getStatesList() {
    this.uTrackService.get_fuel_state_list().subscribe(response => {
      if (response.status) {
        this.states = [];
        this.states = response.data;
        this.filteredStateName.next(this.states);
        this.state_id = this.states[0].fuel_state_id;
        this.get_fuel_price_list();
      }
    })
  }

  back() {
    this.location.back()
  }

  fuelStateChnage(event) {
    this.state_id = event;
    this.get_fuel_price_list();
  }

  get_fuel_price_list() {
    this.ELEMENT_DATA = [];
    const formData = new FormData();
    formData.append('fuel_state_id', this.state_id);

    this.uTrackService.get_fuel_price_list(formData).subscribe(response => {
      if (response.status) {
        if (response.data != undefined && response.data != null && response.data.length > 0) {
          this.TableDataNotshow=false;
          this.ELEMENT_DATA = response.data;
        }else{
          this.TableDataNotshow=true;
        }
        this.dataSource.data = this.ELEMENT_DATA;
      }else{
        this.TableDataNotshow=true;
      }
    })

  }

}
