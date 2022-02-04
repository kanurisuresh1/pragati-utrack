import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { CustomerManagementDetails, Customers } from '../Model/CustomerManagementDetails';
import { StateResponse } from '../Model/StateRessponse';
import { AllVechiclesDetails } from '../Model/GetAllVechiclesDetails';
import { AllVehicleServiceManagement } from '../Model/VechicleServiceManagementDetails';
import { FuelManagementResponse } from '../Model/FuelManagementResponse';
import { HomeLite } from '../Model/HomeLite';
import { BasicResponse } from '../Model/Basic';
import { service_master_list } from '../Model/service_master_list';
import { GetVehicleDetails } from '../Model/GetVehicleNumberDetails';
import { DriverManagementList } from '../Model/DriverManagementList';
import { DistrictResponse } from '../Model/DistrictResponse';
import { CityResponce } from '../Model/CityResponse';
import { Home } from '../Model/Home';
import { DayWiseKmReport } from '../Model/DayWiseKmResponse';
import { NewAllDeviceReportStatsResponse } from '../Model/NewAllDeviceReportStatsResponse';
import { AllDeviceReportStatus24Hours } from '../Model/All_device_Status_24_HoursKMReportResponse';
import { Twenty4HoursAnalysis } from '../Model/24HoursAnalysisResponse';
import { DatePipe } from '@angular/common';
import { GeofenceReport } from '../Model/GeofenceReport';
import { GeofenceList } from '../Model/GeofenceList';
import { MyUsersList } from '../Model/MyUsersList';
import { DriverPerformanceReport } from '../Model/DriverPerformanceReport';
import { TemperatureList } from '../Model/TemperatureReports';
import { NotificationResponse } from '../Model/NotificationResponse';
import { LessKmsReportNotificationResponse } from '../Model/LessKMSReportNotificationRespones';
import { ChangeEmailResponse } from '../Model/ChangeResponse';
import { ChangeNumberResponse } from '../Model/ChangeNumberResponse';
import { ChangePasswordResponse } from '../Model/ChangePasswordResopnse';
import { StoppageReportResponse } from '../Model/StoppageReportResponse';
import { DriverDetailsData, DriverDetails } from '../Model/DriverDetailsResponse';
import { SharedUsersResponseDetails } from '../Model/SharedUsersResponseDetails';
import { TrackHistoryReportResponse } from '../Model/TrackHistoryResponse';
import { HubManagementResponse } from '../Model/HubManagementResponse';
import { MygroupListResponse } from '../Model/MygroupListRespones';
import { CurrentDevicePositionResponse } from '../Model/CurrentDevicePositionResponse';
import { SingleCustomDeviceReportStatsResponse } from '../Model/SingleCustomDeviceReportStatsResponse';
import { ForgotPasswordResponse } from '../Model/ForgotPasswordResponse';
import { TripResponse } from '../Model/TripResponse';
import { LiveTripResponse } from '../Model/LiveTripResponse';
import { ChangeEmailActionResponse } from '../Model/ChangeEmailActionResponse';
import { ChangeMobileActionResponse } from '../Model/ChangeMobileActionResponse';
import { FAQResponse } from '../Model/FAQResponse';
import { FAQCustomerListResponse } from '../Model/FAQCustomerListResponse';
import { Router } from '@angular/router';
import { CreateGeofenceResponse } from '../Model/CreateGeofenceResponse';
import { CreateRouteResponse } from '../Model/CreateRouteResponse';
import { TempAlertListResponse } from '../Model/TempAlertListResponse';
import { SharedManagementListRepsonse } from '../Model/SharedManagementListResponse';
import { CompanyManagementDetailsResponse } from '../Model/CompanyManagementDetailsResponse';
import { CompanyManagementListResponse } from '../Model/CompanyManagementList';
import { MyProfileResponse } from '../Model/MyProfileResponse';
import { EditMyProfileRespones } from '../Model/EditMyProfileRespones';
import { MyWalletResponse } from '../Model/MyWalletResponse';
import { NewAllDeviceReportStatsV1Response } from '../Model/NewAllDeviceV1ReportStatsResponse';
import { HomeLiteV1Response } from '../Model/HomeLiteV1Response';
import { AllDeviceReportStatsCustomResponse } from '../Model/AllDeviceReportStatsCustomResponse';
import { Home_V1 } from '../Model/Home_v1_Response';
import { FuelDashboardResponse } from '../Model/FuelDashboardResponse';
import { FuelRefilResponseData } from '../Model/FuelRefilResponse';
import { FuelReportResponse } from '../Model/FuelReportResponse';
import { FastTagResponse } from '../Model/FastTagResponse';
import { TollPlazaResponse } from '../Model/TollPlazaResponse';
import { FastTagDetailsResponse } from '../Model/FastTagDetailsResponse';
import { FastTagBanksResponse } from '../Model/FastTagBanksResponse';
import { FuelStatesResponse } from '../Model/FuelStateResponse';
import { FuelPriceListResponse } from '../Model/FuelPriceListResponse';
import { GpsLockResponse } from '../Model/GpsLockResponse';
import { GetTollPlazaListStateListResponse } from '../Model/GetTollPlazaListStateListResponse';
import { GeofenceCustomAlertListResponse } from '../Model/GeofenceCustomAlertListResponse';
import { UpdateLandingPageResponse } from '../Model/UpdateLandingPageResponse';
import { EmergenceCustomerDetailsResponse } from '../Model/EmergenceCustomerDetailsResponse';
import { BusOrganisationsListResponse } from '../Model/BusOrganisationsListResponse';
import { BusCreateOrganisationResponse } from '../Model/BusCreateOrganisationResponse';
import { BusOrganisationBranchListResponse } from '../Model/BusOrganisationBranchListResponse';
import { BusCreateBrachResponse } from '../Model/BusCreateBrachResponse';
import { BusEmployeesListResponse } from '../Model/BusEmployeesListResponse';
import { BusTimilngListResponse } from '../Model/BusTimilngListResponse';
import { BusGeofenceListResponse } from '../Model/BusGeofenceListResponse';
import { BusCreateGeofenceResponse } from '../Model/BusCreateGeofenceResponse';
import { BusRouteListResponse } from '../Model/BusRouteListResponse';
import { BusCreateRouteResponse } from '../Model/BusCreateRouteResponse';
import { BusCreateTimingResponse } from '../Model/BusCreateTimingResponse';
import { BusOrganisationBranchDetailsResponse } from '../Model/BusOrganisationBranchDetailsResponse';
import { BusGeofenceDetailsResponse } from '../Model/BusGeofenceDetailsResponse';
import { FuelAlertListResponse } from '../Model/FuelAlertListResponse';
import { AlertHistoryResponse } from '../Model/AlertHistoryResponse';
import { TranslateService } from '@ngx-translate/core';
import { VehicleCertificateRenewalListResponse } from '../Model/VehicleCertificateRenewalListResponse';
import { BusRouteDetailsListResponse } from '../Model/BusRouteDetailsListResponse';
import { BusPassengersListResponse } from '../Model/BusPassengersListResponse';
import { BusCreatePassengersResponse } from '../Model/BusCreatePassengersResponse';
import { BusTripsListResponse } from '../Model/BusTripsListResponse';
import { BusCreateRoutePointResponse } from '../Model/BusCreateRoutePointResponse';
import { Home_V2 } from '../Model/Home_v2_Response';
import { AllPositionsReport, AllPositionsReportResponse } from '../Model/AllPositionsReport';
import { distanceReportResponse } from '../Model/DistanceReportResponse';
import { TemperatureReportResponse } from '../Model/TemperatureReportsResponse';
import { OverSpeedReportRespones } from '../Model/OverSpeedReport';
import { SingleDeviceReportStatusReportV1Response } from '../Model/SingleDeviceReportStatusReportV1Response';
import { SummaryReportCustomDiv } from '../Model/final_summary_report_mongo_v1';
import { stoppageTrackReportResponse } from '../Model/StoppageTrackReportResponse';
import { NewTrackHistoryDiv } from '../Model/Final-summary-report-mongo-V1';
import { finalSummaryReportMongov2 } from '../Model/final_summary_report_mongo_v2';

@Injectable({
  providedIn: 'root',
})

export class UtrackService {
  public USER_ID = localStorage.getItem('USER_ID');
  pipe = new DatePipe('en-US');

  constructor(private http: HttpClient, private routes: Router,
    private translate: TranslateService,) { }

  translateLanguage() {

    let language_code = localStorage.getItem('LANGUAGE');
    if (language_code === null || language_code === undefined || language_code === '') {
      language_code = 'en';
    }
    this.translate.setDefaultLang(language_code);
  }

  isUserValid() {
    // if (this.USER_ID == null || this.USER_ID === '') {
    //   this.routes.navigate(['/login']);
    // }
  }

  isLogged() {
    console.log(this.USER_ID)
    if (this.USER_ID == null || this.USER_ID === '' || this.USER_ID === undefined) {
      this.routes.navigate(['/login']);
      return false;
    } else {
      return true;
    }
  }

  getCustomerManagementDetails() {

    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.get<Customers>(environment.apiBaseUrl + 'customer_list?user_id=' + this.USER_ID + '&user_type=Customer&device_token=Web', { headers });
  }

  getStates() {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.get<StateResponse>(environment.apiBaseUrl + 'state_list', { headers });
  }

  get_fuel_state_list() {
    const formData = new FormData();
    formData.append('fuel_state_id', '1');
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<FuelStatesResponse>(environment.apiBaseUrl + 'get_fuel_state_list', formData, { headers });
  }

  get_fuel_price_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<FuelPriceListResponse>(environment.apiBaseUrl + 'get_fuel_price_list', formData, { headers });
  }

  getDistricts(state_id) {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('state_id', state_id);
    return this.http.get<DistrictResponse>(environment.apiBaseUrl + 'district_list', { params });
  }

  getCities(district_id) {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('district_id', district_id);
    return this.http.get<CityResponce>(environment.apiBaseUrl + 'city_list', { params });
  }

  my_profile() {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_token', 'Web')
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<MyProfileResponse>(environment.apiBaseUrl + 'my_profile', { params });
  }

  edit_profile(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<EditMyProfileRespones>(environment.apiBaseUrl + 'edit_profile', formData, { headers });
  }

  my_wallet_transactions() {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_token', 'Web')
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<MyWalletResponse>(environment.apiBaseUrl + 'my_wallet_transactions', { params });
  }

  my_referrals() {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_token', 'Web')
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<MyWalletResponse>(environment.apiBaseUrl + 'my_referrals', { params });
  }

  customer_add(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'customer_add', formData, { headers });
  }

  customer_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'customer_edit', formData, { headers });
  }

  // Vehicle Details List
  getAllVechiclesDetails() {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<AllVechiclesDetails>(environment.apiBaseUrl + 'get_all_vehicle_details', { params });
  }
  // Edit Vehicle Details List
  getVehiclesDetails(device_link_id) {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('device_link_id', device_link_id);

    return this.http.get<GetVehicleDetails>(environment.apiBaseUrl + 'get_vehicle_details', { params });
  }


  getAllVehicleServiceDetails() {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      // .set('device_link_id', "90")
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<AllVehicleServiceManagement>(environment.apiBaseUrl +
      'vehicle_service_list?&device_token=Web', { params });
  }



  getFuelDetails() {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_link_id', '')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'));
    return this.http.get<FuelManagementResponse>(environment.apiBaseUrl +
      'vehicle_fuel_listing?&device_token=Web', { params });

  }

  vehicle_fuel_add(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'vehicle_fuel_add', formData, { headers });
  }

  vehicle_fuel_delete(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'vehicle_fuel_delete', formData, { headers });
  }

  // Service Management Start
  vehicle_service_add(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'vehicle_service_add', formData, { headers });
  }

  vehicle_service_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'vehicle_service_edit', formData, { headers });
  }

  vehicle_service_delete(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'vehicle_service_delete', formData, { headers });
  }



  getHomeLite() {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'));
    return this.http.get<HomeLite>(environment.apiBaseUrl + 'home_lite', { params });
  }

  home_lite_v1() {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'));
    return this.http.get<HomeLiteV1Response>(environment.apiBaseUrl + 'home_lite_v1', { params });
  }

  getHomeWebService() {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web');
    return this.http.get<Home>(environment.apiBaseUrl + 'home', { params });
  }

  service_master_list() {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web');
    return this.http.get<service_master_list>(environment.apiBaseUrl + 'service_master_list', { params });
  }

  vehicle_detail_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'vehicle_detail_edit', formData, { headers });
  }

  vehicle_image_add(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'vehicle_image_add', formData, { headers });
  }

  vehicle_image_delete(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'vehicle_image_delete', formData, { headers });
  }


  // Driver Management

  // my_users_list() {

  //   const headers = {
  //     'X-Api-Key': environment.X_API_KEY,
  //   }
  //   return this.http.get<DriverManagementList>(environment.apiBaseUrl +
  //     'my_users_list?user_id=' + this.USER_ID + '&user_type=Customer&device_token=Web&type=1', { headers })
  // }

  assign_driver_to_vehicle(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'assign_driver_to_vehicle', formData, { headers });
  }

  remove_driver_from_vehicle(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'remove_driver_from_vehicle', formData, { headers });
  }

  // Reports And Charts
  // Day wise Km Report
  // Live Track Also

  single_custom_device_report_stats_v1(stringStartDate, stringEndData, device_link_id) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('from_date', stringStartDate)
      .set('to_date', stringEndData)
      .set('device_link_id', device_link_id);
    return this.http.get<SingleCustomDeviceReportStatsResponse>(environment.apiBaseUrl + 'single_custom_device_report_stats_v1', { params });
  }

  // Dashboard Report
  home_v1() {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web');
    return this.http.get<Home_V1>(environment.apiBaseUrl + 'home_v1', { params });
  }

  home_v2() {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web');
    return this.http.get<Home_V2>(environment.apiBaseUrl + 'home_v2', { params });
  }

  // Daily Summary Report
  new_all_device_report_stats(report_date) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('report_date', report_date);
    return this.http.get<NewAllDeviceReportStatsResponse>(environment.apiBaseUrl +
      'new_all_device_report_stats', { params });
  }

  new_all_device_report_stats_v1(report_date) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('report_date', report_date);
    return this.http.get<NewAllDeviceReportStatsV1Response>(environment.apiBaseUrl +

      'new_all_device_report_stats_v1', { params });
  }

  all_device_report_stats_custom_v1(from_date, to_date) {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem("USER_ID"))
      .set('device_token', "Web")
      .set('user_type', "Customer")
      .set('from_date', from_date)
      .set('to_date', to_date)
      .set('X-Api-Key', environment.X_API_KEY)
    return this.http.get<AllDeviceReportStatsCustomResponse>(environment.apiBaseUrl +

      'all_device_report_stats_custom_v1', { params });
  }

  // 24 hours KM Report
  all_device_report_stats_24_hours() {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'));
    return this.http.get<AllDeviceReportStatus24Hours>(environment.apiBaseUrl +
      'all_device_report_stats_24_hours_v1', { params });
  }

  analysis_report(device_link_id, from_date, to_date) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('device_link_id', device_link_id)
      .set('from_date', from_date)
      .set('to_date', to_date);

    return this.http.get<Twenty4HoursAnalysis>(environment.apiBaseUrl + 'analysis_report_v1', { params });
  }


  // maheswari Reports Code

  getdaywisekmDetails(device_link_id, from_date, to_date) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('from_date', from_date)
      .set('to_date', to_date)
      .set('device_link_id', device_link_id);
    return this.http.get<DayWiseKmReport>(environment.apiBaseUrl + 'single_custom_device_report_stats_v1', { params });
  }

  geofence_report(device_id, geofence_id, from_date_time, to_date_time) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('to_date_time', to_date_time)
      .set('from_date_time', from_date_time)
      .set('geofence_id', geofence_id)
      .set('device_id', device_id);
    return this.http.get<GeofenceReport>(environment.apiBaseUrl + 'geofence_report_v1', { params });
  }

  geofence_list() {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'));
    return this.http.get<GeofenceList>(environment.apiBaseUrl + 'geofence_list', { params });
  }

  driver_performance_report(driver_id, from_date, to_date) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('driver_id', driver_id)
      .set('from_date', from_date)
      .set('to_date', to_date);
    return this.http.get<DriverPerformanceReport>(environment.apiBaseUrl + 'driver_performance_report_v1', { params });
  }

  my_users_list() {
    const params = new HttpParams()
      .set('device_token', 'Web')
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('type', '1');
    return this.http.get<MyUsersList>(environment.apiBaseUrl + 'my_users_list', { params });
  }


  my_shared_users_list() {
    const params = new HttpParams()
      .set('device_token', 'Web')
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('type', '0');
    return this.http.get<MyUsersList>(environment.apiBaseUrl + 'my_users_list', { params });
  }


  temp_report(device_link_id, from_date, to_date) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('to_date', to_date)
      .set('from_date', from_date)
      .set('device_link_id', device_link_id)
      .set('order_by', 'fixtime')
      .set('time_diff', '30');
    return this.http.get<TemperatureList>(environment.apiBaseUrl + 'temp_report', { params });
  }

  // Suresh Code 12-08-2020

  // My Groups
  group_list() {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<MygroupListResponse>(environment.apiBaseUrl + 'group_list', { params });
  }

  getNotifocationListDetails(page_index) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('page_index', page_index);
    return this.http.get<NotificationResponse>(environment.apiBaseUrl + 'user_notifications_list', { params });
  }


  getNotifocationLessKmsReportDetails(page_index, alert_type) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('alert_type', alert_type)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('page_index', page_index);
    return this.http.get<LessKmsReportNotificationResponse>(environment.apiBaseUrl +
      'less_kms_report_stats', { params });
  }


  update_landing_page(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };

    return this.http.post<UpdateLandingPageResponse>(environment.apiBaseUrl + 'update_landing_page', formData, { headers });
  }

  // Settings
  // Change Email

  change_email(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };

    return this.http.post<ChangeEmailResponse>(environment.apiBaseUrl + 'change_email', formData, { headers });
  }



  change_email_action(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };

    return this.http.post<ChangeEmailActionResponse>(environment.apiBaseUrl +
      'change_email_action', formData, { headers });
  }

  // Change Password
  change_password(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };

    return this.http.post<ChangePasswordResponse>(environment.apiBaseUrl + 'change_password', formData, { headers });
  }

  // Change Number
  change_mobile(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };

    return this.http.post<ChangeNumberResponse>(environment.apiBaseUrl + 'change_mobile', formData, { headers });
  }


  change_mobile_action(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };

    return this.http.post<ChangeMobileActionResponse>(environment.apiBaseUrl +
      'change_mobile_action', formData, { headers });
  }
  // Stoppage Report

  new_track_report_web_mongo(device_link_id, from_date, to_date, time_diff, enable_consecutive) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('to_date', to_date)
      .set('from_date', from_date)
      .set('device_link_id', device_link_id)
      .set('order_by', 'fixtime')
      .set('time_diff', time_diff)
      .set('enable_locations', '1')
      .set('enable_consecutive', enable_consecutive);
    return this.http.get<StoppageReportResponse>(environment.apiBaseUrl + 'new_track_report_web_mongo', { params });
  }


  // stoppageTrackReport


  stoppage_track_report(device_link_id, from_date, to_date, show_value) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('to_date', to_date)
      .set('from_date', from_date)
      .set('device_link_id', device_link_id)
      .set('show_stopped', show_value)
    return this.http.get<stoppageTrackReportResponse>(environment.apiBaseUrl + 'stoppage_track_report', { params });
  }


  //distance_report

  distance_report(device_link_id, from_date, to_date, time_diff) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('to_date', to_date)
      .set('from_date', from_date)
      .set('device_link_id', device_link_id)
      .set('interval_in_mins', time_diff)
    return this.http.get<distanceReportResponse>(environment.apiBaseUrl + 'distance_report', { params });
  }

  // Temperature Report

  new_track_report_web_mongo_temperature(device_link_id, from_date, to_date, time_diff, enable_consecutive) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('to_date', to_date)
      .set('from_date', from_date)
      .set('device_link_id', device_link_id)
      .set('order_by', 'fixtime')
      .set('time_diff', time_diff)
      .set('enable_locations', '1')
      .set('enable_consecutive', enable_consecutive);
    return this.http.get<TemperatureReportResponse>(environment.apiBaseUrl + 'new_track_report_web_mongo_temperature', { params });
  }
  new_track_report_web_mongo_fuel_v1(device_link_id, from_date, to_date, time_split) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('to_date', to_date)
      .set('from_date', from_date)
      .set('device_link_id', device_link_id)
      .set('time_split', time_split)
    return this.http.get<FuelReportResponse>(environment.apiBaseUrl + 'new_track_report_web_mongo_fuel_v1', { params });

  }

  //AllPositionReport

  new_track_report_web_mongo_raw_report(device_link_id, from_date, to_date, time_diff) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('to_date', to_date)
      .set('from_date', from_date)
      .set('device_link_id', device_link_id)
      .set('order_by', 'fixtime')
      .set('time_diff', time_diff)
      .set('enable_locations', '1')
      .set('enable_consecutive', '0');
    return this.http.get<AllPositionsReport>(environment.apiBaseUrl + 'new_track_report_web_mongo_raw_report', { params });
  }


  //OverSpeedReport

  final_summary_report_mongo_over_speed(device_link_id, from_date, to_date, speed_limit) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('to_date', to_date)
      .set('from_date', from_date)
      .set('device_link_id', device_link_id)
      .set('order_by', 'fixtime')
      .set('speed_limit', speed_limit)
    return this.http.get<OverSpeedReportRespones>(environment.apiBaseUrl + 'final_summary_report_mongo_over_speed', { params });
  }


  // Add Driver
  create_my_user(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'create_my_user', formData, { headers });
  }


  driver_detail(driver_id) {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('driver_id', driver_id);
    return this.http.get<DriverDetails>(environment.apiBaseUrl + 'driver_detail', { params });
  }

  // Shared User Detail

  shared_user_detail(share_user_id) {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('share_user_id', share_user_id);
    return this.http.get<DriverDetails>(environment.apiBaseUrl + 'shared_user_detail', { params });
  }
  // Driver Delete

  remove_from_my_users(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'remove_from_my_users', formData, { headers });
  }


  user_managed_device_list(other_user_id) {

    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY)
      .set('other_user_id', other_user_id);
    return this.http.get<SharedUsersResponseDetails>(environment.apiBaseUrl + 'user_managed_device_list', { params });
  }


  // Assigned or Not
  assign_user_to_device(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'assign_user_to_device', formData, { headers });
  }
  remove_device_users(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'remove_device_users', formData, { headers });
  }

  // Track Report And RAW Data

  final_summary_report_mongo(device_link_id, from_date, to_date, time_diff, enable_consecutive) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('from_date', from_date)
      .set('to_date', to_date)
      .set('device_link_id', device_link_id)
      .set('order_by', 'fixtime')
      .set('time_diff', time_diff)
      .set('enable_locations', '1')
      .set('enable_consecutive', enable_consecutive);
    return this.http.get<TrackHistoryReportResponse>(environment.apiBaseUrl + 'final_summary_report_mongo', { params });
  }

  // track History 

  final_summary_report_mongo_v1_data(device_link_id, from_date, to_date, time_diff, enable_consecutive) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('from_date', from_date)
      .set('to_date', to_date)
      .set('device_link_id', device_link_id)
      .set('order_by', 'fixtime')
      .set('time_diff', time_diff)
      .set('enable_locations', '1')
      .set('enable_consecutive', enable_consecutive);
    return this.http.get<NewTrackHistoryDiv>(environment.apiBaseUrl + 'final_summary_report_mongo_v1', { params });
  }

  // summary Report live track track history  used

  final_summary_report_mongo_v2(device_link_id, from_date, to_date, time_diff, enable_locations, enable_consecutive) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('from_date', from_date)
      .set('to_date', to_date)
      .set('device_link_id', device_link_id)
      .set('order_by', 'fixtime')
      .set('time_diff', time_diff)
      .set('enable_locations', enable_locations)
      .set('enable_consecutive', enable_consecutive)
      .set('exclude_wrong_distance', '1');
    return this.http.get<finalSummaryReportMongov2>(environment.apiBaseUrl + 'final_summary_report_mongo_v2', { params });
  }

  // summary Report

  final_summary_report_mongo_v1(device_link_id, from_date, to_date, time_diff, enable_consecutive) {
    const params = new HttpParams()
      .set('user_id', this.USER_ID)
      .set('X-Api-Key', environment.X_API_KEY)
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('from_date', from_date)
      .set('to_date', to_date)
      .set('device_link_id', device_link_id)
      .set('order_by', 'fixtime')
      .set('time_diff', time_diff)
      .set('enable_locations', '1')
      .set('enable_consecutive', enable_consecutive);
    return this.http.get<SummaryReportCustomDiv>(environment.apiBaseUrl + 'final_summary_report_mongo_v1', { params });
  }

  // Kilometer Report

  single_device_report_stats_v1(device_link_id, report_date) {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem('USER_ID'))
      .set('device_token', 'Web')
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_link_id', device_link_id)
      .set('report_date', report_date)
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<SingleDeviceReportStatusReportV1Response>(environment.apiBaseUrl +
      'single_device_report_stats_v1', { params });

  }


  // Hub Management

  hub_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<HubManagementResponse>(environment.apiBaseUrl + 'hub_list', formData, { headers });
  }


  hub_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'hub_create', formData, { headers });
  }

  hub_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'hub_edit', formData, { headers });
  }

  hub_delete(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'hub_delete', formData, { headers });
  }

  hub_detail(formData) {

    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<HubManagementResponse>(environment.apiBaseUrl + 'hub_detail', formData, { headers });
  }


  // Live Track
  current_device_position_v1(device_link_id, device_id) {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem('USER_ID'))
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_id', device_id)
      .set('device_link_id', device_link_id)
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY);

    return this.http.get<CurrentDevicePositionResponse>(environment.apiBaseUrl + 'current_device_position_v1', { params });

  }

  // Group Details
  group_detail(group_id) {

    const params = new HttpParams()
      .set('user_id', localStorage.getItem('USER_ID'))
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('group_id', group_id)
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<MygroupListResponse>(environment.apiBaseUrl + 'group_detail', { params });
  }

  group_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'group_create', formData, { headers });
  }

  group_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'group_edit', formData, { headers });
  }

  // Forgot Password

  reset_password(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'reset_password', formData, { headers });
  }


  forgot_password(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<ForgotPasswordResponse>(environment.apiBaseUrl + 'forgot_password', formData, { headers });
  }

  customer_signup(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'customer_signup', formData, { headers });
  }

  // Share Location TRIP

  trip_share_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<LiveTripResponse>(environment.apiBaseUrl + 'trip_share_create', formData, { headers });
  }


  trip_list(device_link_id) {

    const params = new HttpParams()
      .set('user_id', localStorage.getItem('USER_ID'))
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('device_link_id', device_link_id)
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<TripResponse>(environment.apiBaseUrl + 'trip_list', { params });
  }


  // HOW TO USE
  contact_info_settings() {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem('USER_ID'))
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<FAQResponse>(environment.apiBaseUrl + 'contact_info_settings', { params });
  }

  // FAQ's
  faq_customer_list() {
    const params = new HttpParams()
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<FAQCustomerListResponse>(environment.apiBaseUrl + 'faq_customer_list', { params });
  }


  geofence_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<CreateGeofenceResponse>(environment.apiBaseUrl + 'geofence_create', formData, { headers });
  }



  geofence_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'geofence_edit', formData, { headers });
  }

  geofence_delete(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'geofence_delete', formData, { headers });
  }
  // create Route

  route_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<CreateRouteResponse>(environment.apiBaseUrl + 'route_create', formData, { headers });
  }


  temp_alert_list(formData) {

    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<TempAlertListResponse>(environment.apiBaseUrl + 'temp_alert_list', formData, { headers });
  }

  geofence_custom_alert_list() {
    const formData = new FormData();
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    formData.append('user_id', localStorage.getItem('USER_ID'));
    return this.http.post<GeofenceCustomAlertListResponse>(environment.apiBaseUrl + 'geofence_custom_alert_list', formData, { headers });
  }

  temp_alert_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'temp_alert_create', formData, { headers });
  }

  temp_alert_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'temp_alert_edit', formData, { headers });
  }

  geofence_custom_alert_add(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'geofence_custom_alert_add', formData, { headers });
  }

  geofence_custom_alert_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'geofence_custom_alert_edit', formData, { headers });
  }

  geofence_custom_alert_delete(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'geofence_custom_alert_delete', formData, { headers });
  }

  // Company Management
  // Company Management List

  my_company_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<CompanyManagementListResponse>(environment.apiBaseUrl +
      'my_company_list', formData, { headers });
  }

  // Company Create

  my_company_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'my_company_create', formData, { headers });
  }

  // Company Edit
  my_company_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'my_company_edit', formData, { headers });
  }

  // Company Delete
  my_company_delete(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'my_company_delete', formData, { headers });
  }

  // Company Details
  my_company_detail(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<CompanyManagementDetailsResponse>(environment.apiBaseUrl +
      'my_company_detail', formData, { headers });
  }

  // Shared Management
  // Shared Management List
  shared_links_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<SharedManagementListRepsonse>(environment.apiBaseUrl +
      'shared_links_list', formData, { headers });
  }

  // Share Link Status Change
  share_link_status_change(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'share_link_status_change', formData, { headers });
  }

  // Share Link Extend Time Change
  extend_share_link_expire_time(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl +
      'extend_share_link_expire_time', formData, { headers });
  }

  // Update Screen Load Status
  update_screen_load_status(screen_name) {
    const params = new HttpParams()
      .set('user_id', localStorage.getItem('USER_ID'))
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('is_map', 'Yes')
      .set('screen_name', screen_name)
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'update_screen_load_status', { params });
  }

  //Share Link
  share_live_link(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };

    return this.http.post<BasicResponse>(environment.apiBaseUrl +
      'share_live_link', formData, { headers });
  }

  get_vehicle_fuel_refill(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };

    return this.http.post<FuelRefilResponseData>(environment.apiBaseUrl + 'get_vehicle_fuel_refill ', formData, { headers });
  }

  get_vehicle_fuel_summary(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };

    return this.http.post<FuelDashboardResponse>(environment.apiBaseUrl + 'get_vehicle_fuel_summary   ', formData, { headers });
  }

  get_vehicle_fasttag_transactions(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<FastTagResponse>(environment.apiBaseUrl + 'get_vehicle_fasttag_transactions', formData, { headers });
  }

  get_toll_plaza_list_state_list() {
    const formData = new FormData();
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<GetTollPlazaListStateListResponse>(environment.apiBaseUrl + 'get_toll_plaza_list_state_list', formData, { headers });
  }


  get_toll_plaza_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<TollPlazaResponse>(environment.apiBaseUrl + 'get_toll_plaza_list', formData, { headers });
  }

  get_fast_tag_account(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<FastTagDetailsResponse>(environment.apiBaseUrl + 'get_fast_tag_account', formData, { headers });
  }

  add_fast_tag_account(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'add_fast_tag_account', formData, { headers });
  }

  edit_fast_tag_account(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'edit_fast_tag_account', formData, { headers });
  }

  remove_fast_tag_account(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'remove_fast_tag_account', formData, { headers });
  }

  get_fast_tag_bank_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<FastTagBanksResponse>(environment.apiBaseUrl + 'get_fast_tag_bank_list', formData, { headers });
  }

  gps_lock_verify_otp(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };

    return this.http.post<GpsLockResponse>(environment.apiBaseUrl + 'gps_lock_verify_otp', formData, { headers });
  }

  gps_lock_status_change(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'gps_lock_status_change', formData, { headers });
  }

  customer_device_detail(device_link_id) {

    const params = new HttpParams()
      .set('user_id', localStorage.getItem('USER_ID'))
      .set('user_type', localStorage.getItem('USER_TYPE'))
      .set('device_token', 'Web')
      .set('device_link_id', device_link_id)
      .set('X-Api-Key', environment.X_API_KEY);
    return this.http.get<EmergenceCustomerDetailsResponse>(environment.apiBaseUrl + 'customer_device_detail', { params });
  }

  set_emergency_contact(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'set_emergency_contact', formData, { headers });
  }


  // Bus Organisations List
  bus_organisation_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusOrganisationsListResponse>(environment.busApiBaseUrl + 'bus_organisation_list', formData, { headers });
  }

  bus_organisation_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateOrganisationResponse>(environment.busApiBaseUrl + 'bus_organisation_create', formData, { headers });
  }

  bus_organisation_update(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateOrganisationResponse>(environment.busApiBaseUrl + 'bus_organisation_update', formData, { headers });
  }

  bus_organisation_branch_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusOrganisationBranchListResponse>(environment.busApiBaseUrl + 'bus_organisation_branch_list', formData, { headers });
  }

  bus_organisation_branch_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateBrachResponse>(environment.busApiBaseUrl + 'bus_organisation_branch_create', formData, { headers });
  }

  bus_organisation_branch_update(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateBrachResponse>(environment.busApiBaseUrl + 'bus_organisation_branch_update', formData, { headers });
  }

  bus_organisation_branch_detail(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusOrganisationBranchDetailsResponse>(environment.busApiBaseUrl + 'bus_organisation_branch_detail', formData, { headers });
  }

  bus_staff_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusEmployeesListResponse>(environment.busApiBaseUrl + 'bus_staff_list', formData, { headers });
  }

  create_bus_staff(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.busApiBaseUrl + 'create_bus_staff', formData, { headers });
  }



  bus_geofence_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusGeofenceListResponse>(environment.busApiBaseUrl + 'bus_geofence_list', formData, { headers });
  }

  bus_geofence_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateGeofenceResponse>(environment.busApiBaseUrl + 'bus_geofence_create', formData, { headers });
  }

  bus_geofence_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateGeofenceResponse>(environment.busApiBaseUrl + 'bus_geofence_edit', formData, { headers });
  }

  bus_geofence_detail(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusGeofenceDetailsResponse>(environment.busApiBaseUrl + 'bus_geofence_detail', formData, { headers });
  }

  bus_route_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusRouteListResponse>(environment.busApiBaseUrl + 'bus_route_list', formData, { headers });
  }

  bus_route_detail(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusRouteDetailsListResponse>(environment.busApiBaseUrl + 'bus_route_detail', formData, { headers });
  }

  bus_route_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateRouteResponse>(environment.busApiBaseUrl + 'bus_route_create', formData, { headers });
  }


  bus_route_point_remove(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.busApiBaseUrl + 'bus_route_point_remove', formData, { headers });
  }

  bus_route_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateRouteResponse>(environment.busApiBaseUrl + 'bus_route_edit', formData, { headers });
  }

  bus_route_point_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateRoutePointResponse>(environment.busApiBaseUrl + 'bus_route_point_create', formData, { headers });
  }

  bus_route_point_update(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateRoutePointResponse>(environment.busApiBaseUrl + 'bus_route_point_update', formData, { headers });
  }

  bus_route_timing_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateTimingResponse>(environment.busApiBaseUrl + 'bus_route_timing_create', formData, { headers });
  }

  bus_route_timing_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreateTimingResponse>(environment.busApiBaseUrl + 'bus_route_timing_edit', formData, { headers });
  }

  bus_route_timing_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusTimilngListResponse>(environment.busApiBaseUrl + 'bus_route_timing_list', formData, { headers });
  }

  bus_trip_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusTripsListResponse>(environment.busApiBaseUrl + 'bus_trip_list', formData, { headers });
  }

  bus_passenger_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusPassengersListResponse>(environment.busApiBaseUrl + 'bus_passenger_list', formData, { headers });
  }

  bus_passenger_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreatePassengersResponse>(environment.busApiBaseUrl + 'bus_passenger_create', formData, { headers });
  }

  bus_passenger_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BusCreatePassengersResponse>(environment.busApiBaseUrl + 'bus_passenger_edit', formData, { headers });
  }

  alert_history(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<AlertHistoryResponse>(environment.apiBaseUrl + 'alert_history', formData, { headers });
  }

  alert_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<FuelAlertListResponse>(environment.apiBaseUrl + 'alert_list', formData, { headers });
  }


  alert_create(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'alert_create', formData, { headers });
  }

  alert_edit(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<BasicResponse>(environment.apiBaseUrl + 'alert_edit', formData, { headers });
  }

  certificate_renewal_alert_list(formData) {
    const headers = {
      'X-Api-Key': environment.X_API_KEY,
    };
    return this.http.post<VehicleCertificateRenewalListResponse>(environment.apiBaseUrl + 'certificate_renewal_alert_list', formData, { headers });
  }
}








