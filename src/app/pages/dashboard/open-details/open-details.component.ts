import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { HomeData } from '../../../@theme/components/Model/Home';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatRadioChange } from '@angular/material/radio';
import { UtrackService } from '../../../@theme/components/Services/Utrack.service';
import { TripResponseData } from '../../../@theme/components/Model/TripResponse';
import { ShareTripLinkComponent } from '../share-trip-link/share-trip-link.component';
import { TranslateService } from '@ngx-translate/core';
import { EmergencyContactDetailsComponent } from '../emergency-contact-details/emergency-contact-details.component';

@Component({
  selector: 'ngx-open-details',
  templateUrl: './open-details.component.html',
  styleUrls: ['./open-details.component.scss']
})
export class OpenDetailsComponent implements OnInit {
  panelOpenState = false;
  isHome:boolean=true;
  isReports:boolean=false;
  isFleet:boolean=false;
  vehicle_data: HomeData
  vehicle_number: string
  vehicle_type: string

  isShowEmergency: boolean = false;

  vehicle_lattitude: string
  vehicle_longitude: string
  device_link_id: string


  vehicle_type_image: string
  vehicle_type_color: string

  constructor(@Inject(MAT_DIALOG_DATA) vehicleNumber: HomeData,
    private routes: Router,
    public dialogRef: MatDialogRef<OpenDetailsComponent>,
    private modalService: NgbModal,
    private uTrackService: UtrackService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  
  ) {
    this.vehicle_data = JSON.parse(vehicleNumber.vehicle_number);
  
  }


  ngOnInit(): void {
    this.uTrackService.isUserValid();

    this.uTrackService.translateLanguage();
    this.vehicle_number = this.vehicle_data.vehicle_number
    this.vehicle_type = this.vehicle_data.vehicle_type
    this.device_link_id = this.vehicle_data.device_link_id
    this.vehicle_lattitude = this.vehicle_data.latitude
    this.vehicle_longitude = this.vehicle_data.longitude

    if (this.vehicle_type == "IDCard") {
      this.isShowEmergency = true;
    } else {
      this.isShowEmergency = false;
    }
    this.updateVehicleType();
    this.trip_list()
  }

  home(){
    this.isHome = !this.isHome;
    this.isReports = false;
    this.isFleet = false;
  }

  reports(){
    this.isHome = false;
    this.isReports = !this.isReports;
    this.isFleet = false;
  }

  fleet(){
    this.isHome = false;
    this.isReports = false;
    this.isFleet = !this.isFleet;
  }

  liveTrack() {
    // this.routes.navigate(["web/livetrack"])
    this.routes.navigate([`web/livetrack`, this.device_link_id]);
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  summaryReport() {
    // this.routes.navigate(["web/trackhistory"])
    this.routes.navigate([`web/summary_report`, this.device_link_id])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  trackHistory() {
    this.routes.navigate([`web/track_history`, this.device_link_id])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  vehicleDetails() {
    // this.routes.navigate(["web/fleet-management/vechicle-management"])
    this.routes.navigate([`web/fleet-management/vehicle-details`, this.device_link_id, this.vehicle_number])
    this.dialogRef.close()
  }


  vehicleServicing() {
    this.routes.navigate(["web/fleet-management/service-management"])
    this.dialogRef.close()
  }


  fuelManagement() {
    this.routes.navigate(["web/fleet-management/fuel-management"])
    this.dialogRef.close()
  }


  stoppageReport() {
    // this.routes.navigate(["web/reports_charts/stop-page-report"])
    this.routes.navigate([`web/reports_charts/stoppage-report`, this.device_link_id])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  daywiseReport() {
    // this.routes.navigate(["web/reports_charts/stop-page-report"])
    this.routes.navigate([`web/reports_charts/daywise-km-report`, this.device_link_id])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  dailySummaryKMReport() {
    // this.routes.navigate(["web/reports_charts/stop-page-report"])
    this.routes.navigate([`web/reports_charts/daily-summary-km-report`,])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  twenty4HoursKMReport() {
    // this.routes.navigate(["web/reports_charts/stop-page-report"])
    this.routes.navigate([`web/reports_charts/24hours-km-report`,])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  twenty4HoursAnalysisReport(){
    this.routes.navigate([`web/reports_charts/24hours-analysis`])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  geofenceKMReport() {
    // this.routes.navigate(["web/reports_charts/stop-page-report"])
    this.routes.navigate([`web/reports_charts/geofence-report`,])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  trackNearestvechicleKMReport() {
    // this.routes.navigate(["web/reports_charts/stop-page-report"])
    this.routes.navigate([`web/reports_charts/track-nearest-vechicle`,])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  fuelReport(){
    this.routes.navigate([`web/reports_charts/fuel-reports`, this.device_link_id])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()
  }

  temperatureReport(){
    this.routes.navigate([`web/reports_charts/temperature-reports`, this.device_link_id])
    { relativeTo: this.activatedRoute }
    this.dialogRef.close()

  }
  trackReport() {
    // this.routes.navigate(["web/reports_charts/track-report"])
    this.routes.navigate([`web/reports_charts/track-report`, this.device_link_id])
    this.dialogRef.close()
  }


  distanceReport() {
    // this.routes.navigate(["web/reports_charts/distance-report"])
    this.routes.navigate([`web/reports_charts/distance-report`, this.device_link_id])
    this.dialogRef.close()
  }


  updateVehicleType() {

    switch (this.vehicle_data.vehicle_type) {
      case "Car":

        switch (this.vehicle_data.vehicle_motion_status) {
          case "0": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_yellow_car.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#F3C623'
            break;

          case "1": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_red_car.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#dd3333'

            break;

          case "2": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_green_car.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#68b437'

            break;
        }


        break;

      case "Bus":
        switch (this.vehicle_data.vehicle_motion_status) {
          case "0": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_yellow_bus.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#F3C623'

            break;

          case "1": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_red_bus.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#dd3333'

            break;

          case "2": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_green_bus.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#68b437'

            break;
        }
        break;

      case "Truck":
        switch (this.vehicle_data.vehicle_motion_status) {
          case "0": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_yellow_truck.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#F3C623'

            break;

          case "1": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_red_truck.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#dd3333'

            break;

          case "2": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_green_truck.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#68b437'

            break;
        }
        break;

      case "Auto":

        switch (this.vehicle_data.vehicle_motion_status) {
          case "0": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_yellow_auto.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#F3C623'

            break;

          case "1": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_red_auto.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#dd3333'

            break;

          case "2": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_green_auto.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#68b437'

            break;
        }
        break;

      case "Bike":

        switch (this.vehicle_data.vehicle_motion_status) {
          case "0": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_yellow_bike.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#F3C623'

            break;

          case "1": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_red_bike.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#dd3333'

            break;

          case "2": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_green_bike.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#68b437'

            break;
        }
        break;

      case "Mobile":

        switch (this.vehicle_data.vehicle_motion_status) {
          case "0": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_yellow_mobile.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#F3C623'

            break;

          case "1": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_red_mobile.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#dd3333'

            break;

          case "2": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_green_mobile.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#68b437'

            break;
        }
        break;

      case "IDCard":

        switch (this.vehicle_data.vehicle_motion_status) {
          case "0": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_yellow_id.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#F3C623'

            break;

          case "1": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_red_id.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#dd3333'

            break;

          case "2": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_green_id.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#68b437'

            break;
        }
        break;

      case "Train":

        switch (this.vehicle_data.vehicle_motion_status) {
          case "0": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_yellow_train.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#F3C623'

            break;

          case "1": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_red_train.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#dd3333'

            break;

          case "2": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_green_train.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#68b437'

            break;
        }
        break;

      case "Scooty":

        switch (this.vehicle_data.vehicle_motion_status) {
          case "0": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_yellow_scooty.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#F3C623'

            break;

          case "1": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_red_scooty.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#dd3333'

            break;

          case "2": this.vehicle_data.vehicle_motion_status_image = "assets/images/data_list_icons/marker_type_green_scooty.png";
            this.vehicle_type_image = this.vehicle_data.vehicle_motion_status_image
            this.vehicle_type_color = this.vehicle_data.vehicle_motion_status_color = '#68b437'

            break;
        }
        break;

    }

  }

  trip: TripResponseData[] = []

  trip_list() {
    this.uTrackService.trip_list(this.device_link_id).subscribe(response => {
      if (response.status && response.data.length > 0) {
        this.trip = response.data
        this.isTrip_data = true;
      } else {
        this.isTrip_data = false;
      }
    })
  }


  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }

  onChange(value) {
    this.live_dutation_value = value
  }

  onTripChange(value) {
    this.trip_value = value
  }

  isLive: boolean = false
  isTrip: boolean = false
  isTrip_data: boolean = false
  radioValue: number
  live_dutation_value: string = '60'
  trip_value: string

  radioChange(event: MatRadioChange) {
    this.radioValue = event.value
    switch (event.value) {

      case "1": this.isLive = false;
        this.isTrip = false
        break;

      case "2": this.isLive = true;
        this.isTrip = false
        break;

      case "3": this.isTrip = true
        this.isLive = false;
        break;
    }
  }

  shareLocation() {
    this.modalService.dismissAll('Closed')

    if (this.radioValue == undefined || this.radioValue == null) {
      this.radioValue = 1;
    }

    if (this.radioValue == 1) {

      const dialogReference = this.dialog.open(ShareTripLinkComponent, {
        height: '45%',
        width: '55%',
        data: {
          dataKey: JSON.stringify('http://maps.google.com/maps?daddr=' + this.vehicle_lattitude + ',' + this.vehicle_longitude),
          vehicle_num: JSON.stringify(this.vehicle_number)
        },
      });
      dialogReference.afterClosed().subscribe(result => {
        dialogReference.close();
      });
    }

    if (this.radioValue == 2) {
      this.radioValue = 1;
      this.isLive = false;
      this.isTrip = false;
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem('USER_ID'));
      formData.append('device_token', 'Web');
      formData.append('user_type', localStorage.getItem('USER_TYPE'));
      formData.append('type', 'Live');
      formData.append('live_duration', this.live_dutation_value);
      formData.append('device_link_id', this.device_link_id);
      formData.append('trip_id', '0');

      this.uTrackService.trip_share_create(formData).subscribe(response => {
        const dialogReference = this.dialog.open(ShareTripLinkComponent, {
          height: '45%',
          width: '55%',
          data: {
            dataKey: JSON.stringify(response.data.share_url),
            vehicle_num: JSON.stringify(this.vehicle_number)
          },
        });
        dialogReference.afterClosed().subscribe(result => {
          dialogReference.close();
        });

      });
    }

    if (this.radioValue == 3) {
      this.radioValue = 1;
      this.isLive = false;
      this.isTrip = false;
      if (!this.isTrip_data) {
        alert('No Trips Found');
      } else {

        const formData = new FormData();
        formData.append('user_id', localStorage.getItem('USER_ID'));
        formData.append('device_token', 'Web');
        formData.append('user_type', localStorage.getItem('USER_TYPE'));
        formData.append('type', 'Trip');
        formData.append('live_duration', '0');
        formData.append('device_link_id', this.device_link_id);
        formData.append('trip_id', this.trip_value);

        this.uTrackService.trip_share_create(formData).subscribe(response => {
          const dialogReference = this.dialog.open(ShareTripLinkComponent, {
            height: '45%',
            width: '55%',
            data: {
              dataKey: JSON.stringify(response.data.share_url),
              vehicle_num: JSON.stringify(this.vehicle_number)
            },
          });
          dialogReference.afterClosed().subscribe(result => {
            dialogReference.close();
          });


        });
      }
    }
  }

  emergencyContactDialog() {
    const dialogReference = this.dialog.open(EmergencyContactDetailsComponent, {
      height: '75%',
      width: '50%',
      data: {
        device_link_id: JSON.stringify(this.device_link_id)
      },
    });
    dialogReference.afterClosed().subscribe(result => {
      dialogReference.close();
    });
  }
}
