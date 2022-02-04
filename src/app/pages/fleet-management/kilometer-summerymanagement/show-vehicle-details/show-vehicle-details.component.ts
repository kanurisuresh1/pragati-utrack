import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AllDeviceReport, DetailEntityToday } from '../../../../@theme/components/Model/NewAllDeviceV1ReportStatsResponse';
import { DateUtils } from '../../../../@theme/components/Services/date_utils';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-show-vehicle-details',
  templateUrl: './show-vehicle-details.component.html',
  styleUrls: ['./show-vehicle-details.component.scss']
})

export class ShowVehicleDetailsComponent implements OnInit {

  ELEMENT_DATA: DetailEntityToday[] = []

  displayedColumns: string[] = ['id', 'Date','weekDayName','Distance', 'Travel_Time', 'Max_Speed', 'Avg_Speed'];
  dataSource = new MatTableDataSource<DetailEntityToday>(this.ELEMENT_DATA)

  public vehicle_data: any;
  public vehicle_type: string;
  public vehicle_number: string;
  public MonthDatelistimage: string;
  public device_link_id: string;

  constructor(
    private uTrackService: UtrackService,
    @Inject(MAT_DIALOG_DATA) vehicleNumber: AllDeviceReport,
    private routes: Router,
    public dialogRef: MatDialogRef<ShowVehicleDetailsComponent>,
    private activatedRoute: ActivatedRoute,
  ) {
    this.vehicle_data = JSON.parse(vehicleNumber.vehicle_number)
  }

  ngOnInit(): void {
    this.vehicledata();
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.vehicle_number = this.vehicle_data.vehicle_number
    this.vehicle_type = this.vehicle_data.vehicle_type
    this.device_link_id = this.vehicle_data.device_link_id
    this.updateVehicleType();
  }

  updateVehicleType() {
    switch (this.vehicle_type) {
      case "Car":
        this.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_car.png";
        break;
      case "Bus":
        this.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_bus.png";
        break;
      case "Truck":
        this.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_truck.png";
        break;
      case "Auto":
        this.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_auto.png";
        break;
      case "Bike":
        this.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_bike.png";
        break;
      case "Mobile":
        this.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_mobile.png";
        break;
      case "IDCard":
        this.MonthDatelistimage = "assets/images/data_list_icons/marker_type_green_id.png";
        break;
      case "Scooty":
        this.MonthDatelistimage = "assets/images/data_list_icons/marker_type_scooty_green.png";
        break;
      case "Train":
        this.MonthDatelistimage = "assets/images/data_list_icons/marker_type_train_green.png";
        break;
    }
  }

  vehicledata() {
    this.ELEMENT_DATA = this.vehicle_data.this_month.detail
    this.dataSource.data = this.ELEMENT_DATA
  }

  trackHistory(report_date_formatted) {
    this.routes.navigate([`web/track_history`, this.device_link_id, DateUtils.getServerDate(report_date_formatted)])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }
}
