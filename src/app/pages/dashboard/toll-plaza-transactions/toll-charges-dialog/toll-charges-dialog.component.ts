import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TollDetails, TollPlazaResponseData } from '../../../../@theme/components/Model/TollPlazaResponse';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-toll-charges-dialog',
  templateUrl: './toll-charges-dialog.component.html',
  styleUrls: ['./toll-charges-dialog.component.scss']
})
export class TollChargesDialogComponent implements OnInit {
  private tollDisplayData: TollDetails[] = [];
  displayedColumns: string[] = ['type', 'single', 'multi', 'monthly'];
  dataSource = new MatTableDataSource<TollDetails>(this.tollDisplayData);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('content') content: ElementRef;

  toll_plaza_name: string;

  constructor(@Inject(MAT_DIALOG_DATA) chargesDetails: TollPlazaResponseData,
  private uTrackService:UtrackService) {
  
    if (chargesDetails != null)
      this.tollDisplayData = [];

    let main_data = JSON.parse(chargesDetails.toll_plaza_id)
    this.toll_plaza_name = main_data.toll_name;
    let car = {} as TollDetails;
    car.vehicle_type = 'Car';
    car.single = main_data.car_single;
    car.multi = main_data.car_multi;
    car.monthly = main_data.car_monthly
    this.tollDisplayData.push(car);

    let lcv = {} as TollDetails;
    lcv.vehicle_type = 'Lcv';
    lcv.single = main_data.lcv_single;
    lcv.multi = main_data.lcv_multi;
    lcv.monthly = main_data.lcv_monthly
    this.tollDisplayData.push(lcv);

    let bus = {} as TollDetails;
    bus.vehicle_type = 'Bus';
    bus.single = main_data.bus_single;
    bus.multi = main_data.bus_multi;
    bus.monthly = main_data.bus_monthly
    this.tollDisplayData.push(bus);

    let multi_axle = {} as TollDetails;
    multi_axle.vehicle_type = 'Multi Axle';
    multi_axle.single = main_data.multiaxle_single;
    multi_axle.multi = main_data.multiaxle_multi;
    multi_axle.monthly = main_data.multiaxle_monthly
    this.tollDisplayData.push(multi_axle);

    let hcm = {} as TollDetails;
    hcm.vehicle_type = 'Hcm';
    hcm.single = main_data.hcm_single;
    hcm.multi = main_data.hcm_multi;
    hcm.monthly = main_data.hcm_monthly
    this.tollDisplayData.push(hcm);

    let four_six_axle = {} as TollDetails;
    four_six_axle.vehicle_type = 'Four Six Axle';
    four_six_axle.single = main_data.four_six_axle_single;
    four_six_axle.multi = main_data.four_six_axle_multi;
    four_six_axle.monthly = main_data.four_six_axle_monthly
    this.tollDisplayData.push(four_six_axle);

    let seven_plus_axle = {} as TollDetails;
    seven_plus_axle.vehicle_type = 'Seven Plus Axle';
    seven_plus_axle.single = main_data.seven_plus_axle_single;
    seven_plus_axle.multi = main_data.seven_plus_axle_single;
    seven_plus_axle.monthly = main_data.seven_plus_axle_single
    this.tollDisplayData.push(seven_plus_axle);

  }
  selected = 'Car';
  ngOnInit(): void {
  
    this.uTrackService.translateLanguage();
    if (this.tollDisplayData != null && this.tollDisplayData != undefined) {
      this.dataSource.data = this.tollDisplayData;
    }
    this.dataSource.sort = this.sort;
  }

}
