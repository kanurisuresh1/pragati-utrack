import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { HeaderInteractorService } from '../../../../@theme/components/Services/header-interactor.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { TripDetailResponse, VehicleServiceListEntity, TripExpensesListEntity, VehicleFuelListEntity, TripStopListEntity } from '../../../../@theme/components/Model/TripDetailResponse';
import * as $ from 'jquery';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AddOtherExpensesComponent } from '../add-other-expenses/add-other-expenses.component';
import { BasicResponse } from '../../../../@theme/components/Model/Basic';
import { NbToastrService } from '@nebular/theme';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { UtrackService } from '../../../../@theme/components/Services/Utrack.service';

@Component({
  selector: 'ngx-trip-details',
  templateUrl: './trip-details.component.html',
  styleUrls: ['./trip-details.component.scss']
})
export class TripDetailsComponent implements OnInit {

  trip_stop_list: TripStopListEntity[]=[]
  IntermediatDisplayedColumn: string[] = [
    'trip_id',
    'Stop_Name',
    'Odometer_Reading',
    'Visited_Date',
    'Actions'
  ];
  TripStopListdataSource = new MatTableDataSource<TripStopListEntity>(this.trip_stop_list)


  vehicle_service_list: VehicleServiceListEntity[]=[]
  ServicingDisplayedColumn: string[] = [
    'trip_id',
    'servicing_Date',
    'Amount',
    'Odometer',
    'Service_Center_Name',
    'Services',
    'Servicing_Notes',
    'Actions'
  ];
  VehicleServiceListdataSource = new MatTableDataSource<VehicleServiceListEntity>(this.vehicle_service_list)

  vehicle_fuel_list: VehicleFuelListEntity[]=[]
  FuelExpensesDisplayedColumn: string[] = [
    'trip_id',
    'fuel_Date',
    'Odometer_Reading',
    'Quantity',
    'Price_Per_Liter',
    'Total_Price',
    'Filling_Station',
    'Filling_Notes',
    'Actions'
  ];
  vehicleFuelListdataSource = new MatTableDataSource<VehicleFuelListEntity>(this.vehicle_fuel_list)


  trip_expenses_list: TripExpensesListEntity[]=[]
  OtherExpensesDisplayedColumn: string[] = [
    'trip_id',
    'other_Date',
    'expense_type',
    'Amount',
    'Expense_Notes',
    'Actions'
  ];
  TripExpensesListdataSource = new MatTableDataSource<TripExpensesListEntity>(this.trip_expenses_list)


  @ViewChild('TableOneSort', { static: true }) intermediatelist: MatSort;
  @ViewChild('TableTwoSort', { static: true }) VehicleServiceList: MatSort;
  @ViewChild('TableThreeSort', { static: true }) vehicleFuelList: MatSort;
  @ViewChild('TableFourSort', { static: true }) TripExpensesList: MatSort;



  map: google.maps.Map<HTMLElement>;
  tripId: any;
  status: string;
  datepipe = new DatePipe('en-us');
  start_date_time: string;
  createDate: string;
  end_date_time: string;
  trip_name: string;
  start_location: string;
  end_location: string;
  vehicle_number: null;
  start_odometer_reading: string;
  end_odometer_reading: string;
  deviceIMEInumber: string;
  trip_notes: string;
  visitedStatus: any;
  

  constructor(private headerService: HeaderInteractorService, 
    private http: HttpClient,private location: Location,private routes: Router,
    private activatedRoute: ActivatedRoute,private dialog: MatDialog,
    private toasterService: NbToastrService,
    private uTrackService: UtrackService
   ) { 
      this.activatedRoute.params.subscribe(params => {
        this.tripId = params.trip_id;
      });
  
    }

  ngOnInit(): void {
    this.uTrackService.isUserValid();
    this.uTrackService.translateLanguage();
    this.headerService.updateHeaderTitle('HEADER_NAMES.Trip Detailes');

    this.TripStopListdataSource.sort = this.intermediatelist;
    this.VehicleServiceListdataSource.sort = this.VehicleServiceList;
    this.vehicleFuelListdataSource.sort = this.vehicleFuelList;
    this.TripExpensesListdataSource.sort = this.TripExpensesList;


    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: {
        lat: 17.438557777777778,
        lng: 78.39158222222223
      },
      disableDefaultUI: true,
      mapTypeControl: false,
      fullscreenControl: true,
      zoomControl: true,
    });
    this.getTripDetailesList();
  }

  back() {
    this.location.back()
  }


  tripStart() {
    if (confirm('Are you sure want to Start Trip?')) {
      const headers = {
        'X-Api-Key': environment.X_API_KEY,
      }
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('trip_id', this.tripId);
      formData.append('device_token', "Web");
      this.http.post<BasicResponse>(environment.apiBaseUrl + 'trip_start', formData, { headers }).subscribe(response => {
        if (response.status) {
          this.toasterService.success('Pragati Utrack', response.message)
          window.location.reload();
        } else {
          this.toasterService.danger('Pragati Utrack', response.message)
        }
      })
    }
  }

  tripDelete() {
    if (confirm('Are you sure want to Delete Trip?')) {
      const headers = {
        'X-Api-Key': environment.X_API_KEY,
      }
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('trip_id', this.tripId);
      formData.append('device_token', "Web");
      this.http.post<BasicResponse>(environment.apiBaseUrl + 'trip_delete', formData, { headers }).subscribe(response => {
        if (response.status) {
          this.toasterService.success('Pragati Utrack', response.message)
          window.location.reload();
        } else {
          this.toasterService.danger('Pragati Utrack', response.message)
        }
      })
    }
  }

  tripCancel() {
    if (confirm('Are you sure want to Cancel Trip?')) {
      const headers = {
        'X-Api-Key': environment.X_API_KEY,
      }
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('trip_id', this.tripId);
      formData.append('device_token', "Web");
      this.http.post<BasicResponse>(environment.apiBaseUrl + 'trip_cancel', formData, { headers }).subscribe(response => {
        if (response.status) {
          this.toasterService.success('Pragati Utrack', response.message)
          window.location.reload();
        } else {
          this.toasterService.danger('Pragati Utrack', response.message)
        }
      })
    }
  }

  tripEnd() {
    if (confirm('Are you sure want to End Trip?')) {
      const headers = {
        'X-Api-Key': environment.X_API_KEY,
      }
      const formData = new FormData();
      formData.append('user_id', localStorage.getItem("USER_ID"));
      formData.append('trip_id', this.tripId);
      formData.append('device_token', "Web");
      this.http.post<BasicResponse>(environment.apiBaseUrl + 'trip_end', formData, { headers }).subscribe(response => {
        if (response.status) {
          this.toasterService.success('Pragati Utrack', response.message)
          window.location.reload();
        } else {
          this.toasterService.danger('Pragati Utrack', response.message)
        }
      })
    }
  }

  getTripDetailesList() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('trip_id', this.tripId)
      .set('device_token', "Web")
      .set('X-Api-Key', environment.X_API_KEY)
    this.http.get<TripDetailResponse>(environment.apiBaseUrl + 'trip_detail', { params }).subscribe(response => {
      if (response.status) {

        console.log(response.data)
        this.createDate = response.data.added_date;
        this.start_date_time = response.data.start_date_time;
        this.end_date_time = response.data.end_date_time;
        this.trip_name = response.data.trip_name;
        this.start_location = response.data.start_location;
        this.end_location = response.data.end_location;
        this.vehicle_number = response.data.vehicle_number;
        this.start_odometer_reading = response.data.start_odometer_reading;
        this.end_odometer_reading = response.data.end_odometer_reading;
        this.deviceIMEInumber = response.data.device_link_id;
        this.trip_notes = response.data.trip_notes;
        this.status=response.data.status

        if (this.createDate == "0000-00-00 00:00:00" || this.createDate == null) {
          this.createDate = "- - -"
        } else {
          this.createDate =
            this.datepipe.transform(new Date(this.createDate), 'dd MMM yyyy hh:mm:ss a');
        }

        if (this.start_date_time == "0000-00-00 00:00:00" || this.start_date_time == null) {
          this.start_date_time = "- - -"
        } else {
          this.start_date_time =
            this.datepipe.transform(new Date(this.start_date_time), 'dd MMM yyyy hh:mm:ss a');
        }

        if (this.end_date_time == "0000-00-00 00:00:00" || this.end_date_time == null) {
          this.end_date_time = "- - -"
        } else {
          this.end_date_time =
            this.datepipe.transform(new Date(this.end_date_time), 'dd MMM yyyy hh:mm:ss a');
        }

        if (this.status == "Inprogress") {
          $("#trip_start").hide();
          $("#trip_send_report_mail").hide();
          $("#trip_send_report").hide();
          $("#trip_end").show();
          $("#trip_delete").hide();
          $("#trip_cancel").hide();
          $("#trip_share").show();
      }

      if (this.status == "Upcoming") {
          $("#trip_start").show();
          $("#trip_send_report_mail").hide();
          $("#trip_send_report").hide();
          $("#trip_end").hide();
          $("#trip_delete").show();
          $("#trip_cancel").show();
          $("#trip_share").hide();
      }
      if (this.status == "Overdue") {
          $("#trip_start").show();
          $("#trip_send_report_mail").hide();
          $("#trip_send_report").hide();
          $("#trip_end").hide();
          $("#trip_delete").show();
          $("#trip_cancel").show();
          $("#trip_share").hide();
      }

      if (this.status == "Ended") {
          $("#trip_start").hide();
          $("#trip_send_report_mail").show();
          $("#trip_send_report").show();
          $("#trip_end").hide();
          $("#trip_delete").hide();
          $("#trip_cancel").hide();
          $("#trip_share").hide();
      }

      if (this.status == "Cancelled") {
          $("#trip_start").hide();
          $("#trip_send_report_mail").show();
          $("#trip_send_report").show();
          $("#trip_end").hide();
          $("#trip_delete").hide();
          $("#trip_cancel").hide();
          $("#trip_share").hide();
      }

      this.trip_stop_list=response.data.trip_stop_list
      this.TripStopListdataSource.data = this.trip_stop_list;

      this.trip_stop_list.forEach((row) => {
        row.VisitedDatetime=this.datepipe.transform(new Date(row.visited_date_time), 'dd MMM yyyy');

             this.visitedStatus=row.visited_status
             
        if (this.visitedStatus == 0) {
          row.showDataZero=true
        }else{
          row.showDataZero=false
        }

        if (this.visitedStatus == 1) {
          row.showDataOne=true
        }else{
          row.showDataOne=false
        }


      })
    
      this.vehicle_service_list=response.data.vehicle_service_list
      this.VehicleServiceListdataSource.data = this.vehicle_service_list;

      this.vehicle_service_list.forEach((row) => {
        row.serviceDate=this.datepipe.transform(new Date(row.added_date), 'dd MMM yyyy');
      })

      this.vehicle_fuel_list=response.data.vehicle_fuel_list
      this.vehicleFuelListdataSource.data = this.vehicle_fuel_list;

      this.vehicle_fuel_list.forEach((row) => {
        row.fillingDate=this.datepipe.transform(new Date(row.filling_date), 'dd MMM yyyy');
      })

      this.trip_expenses_list=response.data.trip_expenses_list
      console.log(this.trip_expenses_list)
      this.TripExpensesListdataSource.data = this.trip_expenses_list;

      this.trip_expenses_list.forEach((row) => {
        row.expenseDate=this.datepipe.transform(new Date(row.expense_date), 'dd MMM yyyy');
      })
        
      } 
    })
  }

  

  AddOtherExpenses() {
    let dialogReference = this.dialog.open(AddOtherExpensesComponent, {
      height: '95%',
      width: '62%',
    })
    dialogReference.afterClosed().subscribe(result => {

    })
  }
  

}
