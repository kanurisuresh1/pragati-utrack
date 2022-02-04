import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { ReportsAndChartsComponent } from './reports-and-charts/reports-and-charts.component';
import { GPSLockComponent } from './gpslock/gpslock.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { FleetManagementComponent } from './fleet-management/fleet-management.component';
import { LiveTrackComponent } from './dashboard/live-track/live-track.component';
// import { TrackHistoryComponent } from './dashboard/track-history/track-history.component';
import { TrackHistoryComponent } from './reports-and-charts/track-history/track-history.component';
import { StoppageReportComponent } from './reports-and-charts/stoppage-report/stoppage-report.component';
import { TrackReportComponent } from './reports-and-charts/track-report/track-report.component';
import { DistanceReportComponent } from './reports-and-charts/distance-report/distance-report.component';
import { DaywiseKmReportComponent } from './reports-and-charts/daywise-km-report/daywise-km-report.component';
import { DailySummaryKmReportComponent } from './reports-and-charts/daily-summary-km-report/daily-summary-km-report.component';
import { Twenty4HoursKmReportComponent } from './reports-and-charts/twenty4-hours-km-report/twenty4-hours-km-report.component';
import { Twenty4HoursAnalysisComponent } from './reports-and-charts/twenty4-hours-analysis/twenty4-hours-analysis.component';
import { GeofenceReportComponent } from './reports-and-charts/geofence-report/geofence-report.component';
import { DriverPerformanceComponent } from './reports-and-charts/driver-performance/driver-performance.component';
import { TrackNearestVechileComponent } from './reports-and-charts/track-nearest-vechile/track-nearest-vechile.component';
import { ChartsComponent } from './reports-and-charts/charts/charts.component';
import { TemperatureReportsComponent } from './reports-and-charts/temperature-reports/temperature-reports.component';
import { FuelReportsComponent } from './reports-and-charts/fuel-reports/fuel-reports.component';
import { ServicingManagementComponent } from './fleet-management/servicing-management/servicing-management.component';
import { FuelManagementComponent } from './fleet-management/fuel-management/fuel-management.component';
import { DriverManagementComponent } from './fleet-management/driver-management/driver-management.component';
import { TyreManagementComponent } from './fleet-management/tyre-management/tyre-management.component';
import { SparePartManagementComponent } from './fleet-management/spare-part-management/spare-part-management.component';
import { AlertmanagementComponent } from './fleet-management/alertmanagement/alertmanagement.component';
import { KilometerSummerymanagementComponent } from './fleet-management/kilometer-summerymanagement/kilometer-summerymanagement.component';
import { CustomermanagementComponent } from './fleet-management/customermanagement/customermanagement.component';
import { ExpansesManagementComponent } from './fleet-management/expanses-management/expanses-management.component';
import { TripManagementComponent } from './fleet-management/trip-management/trip-management.component';
import { HubManagementComponent } from './fleet-management/hub-management/hub-management.component';
import { AboutUsComponent } from './others/help/about-us/about-us.component';
import { VechiclesDetailsComponent } from './fleet-management/vechicles-details/vechicles-details.component';
import { CustomerDetailsComponent } from './fleet-management/customermanagement/customer-details/customer-details.component';
import { VehicleNumberDetailsComponent } from './fleet-management/vechicles-details/vehicle-number-details/vehicle-number-details.component';
import { DriverListComponent } from './fleet-management/driver-management/driver-list/driver-list.component';
import { AddDriverComponent } from './fleet-management/driver-management/add-driver/add-driver.component';
import { TermsAndConditionsComponent } from './others/help/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './others/help/privacy-policy/privacy-policy.component';
import { ProductWarrentyComponent } from './others/help/product-warrenty/product-warrenty.component';
import { ServicesAndReportsComponent } from './others/help/services-and-reports/services-and-reports.component';
import { WhyUtrackComponent } from './others/help/why-utrack/why-utrack.component';
import { AdvantagesComponent } from './others/help/advantages/advantages.component';
import { IndustriesComponent } from './others/help/industries/industries.component';
import { HowToUseComponent } from './others/help/how-to-use/how-to-use.component';
import { FAQSComponent } from './others/help/faqs/faqs.component';
import { DashboardReportComponent } from './reports-and-charts/dashboard-report/dashboard-report.component';
import { CreateGroupComponent } from './Myaccount/my-groups/create-group/create-group.component';
import { EditGroupComponent } from './Myaccount/my-groups/edit-group/edit-group.component';
import { MyExecutiveComponent } from './others/help/my-executive/my-executive.component';
import { DriverDetailsComponent } from './fleet-management/driver-management/driver-details/driver-details.component';
import { SharedUserDetailsComponent } from './Myaccount/my-shared-users/shared-user-details/shared-user-details.component';
import { AddSharedUserComponent } from './Myaccount/my-shared-users/add-shared-user/add-shared-user.component';
import { AddHubManagementComponent } from './fleet-management/hub-management/add-hub-management/add-hub-management.component';
import { HubDetailsComponent } from './fleet-management/hub-management/hub-details/hub-details.component';
import { CreateTripComponent } from './Myaccount/my-trips/create-trip/create-trip.component';
import { TripDetailsComponent } from './Myaccount/my-trips/trip-details/trip-details.component';
import { CreateGeofenceComponent } from './Myaccount/my-geofence/create-geofence/create-geofence.component';
import { GeofenceDetailsComponent } from './Myaccount/my-geofence/geofence-details/geofence-details.component';
import { PlanDetailsComponent } from './purchases/buy-plans/plan-details/plan-details.component';
import { PurchasedPlanDetailsComponent } from './purchases/buy-plans/purchased-plan-details/purchased-plan-details.component';
import { PurchasedPlanHistoryComponent } from './purchases/buy-plans/purchased-plan-history/purchased-plan-history.component';
import { ProductDetailsComponent } from './purchases/buy-products/product-details/product-details.component';
import { OrderDetailsComponent } from './purchases/my-orders/order-details/order-details.component';

import { NewTrackHistoryComponent } from './dashboard/new-track-history/new-track-history.component';
import { FullVechicleDetailsComponent } from './reports-and-charts/full-vechicle-details/full-vechicle-details.component';
import { MyTemperatureAlertsComponent } from './Myaccount/my-temperature-alerts/my-temperature-alerts.component';
import { CompanyManagementComponent } from './fleet-management/company-management/company-management.component';
import { AddCompanyManagementComponent } from './fleet-management/company-management/add-company-management/add-company-management.component';
import { CompanyManagementDetailsComponent } from './fleet-management/company-management/company-management-details/company-management-details.component';
import { SharedManagementComponent } from './fleet-management/shared-management/shared-management.component';
import { CreateRouteComponent } from './fleet-management/my-route/create-route/create-route.component';
import { RouteDetailsComponent } from './fleet-management/my-route/route-details/route-details.component';
import { MyRouteComponent } from './fleet-management/my-route/my-route.component';
import { FuelDashboardComponent } from './dashboard/fuel-dashboard/fuel-dashboard.component';
import { TemperatureDashboardComponent } from './dashboard/temperature-dashboard/temperature-dashboard.component';
import { FastTagInformationComponent } from './Myaccount/fast-tag-information/fast-tag-information.component';
import { TollPlazaTransactionsComponent } from './dashboard/toll-plaza-transactions/toll-plaza-transactions.component';
import { FuelPriceInfoComponent } from './dashboard/fuel-price-info/fuel-price-info.component';
import { CreateBranchComponent } from './bus-management/branches/create-branch/create-branch.component';
import { CreateEmployeeComponent } from './bus-management/employees/create-employee/create-employee.component';
import { CreateBusGeofenceComponent } from './bus-management/bus-geofences/create-bus-geofence/create-bus-geofence.component';
import { AlertAndNotificationsComponent } from './alert-and-notifications/alert-and-notifications.component';
import { LessKmStopDataNotReceiveComponent } from './alert-and-notifications/less-km-stop-data-not-receive/less-km-stop-data-not-receive.component';
import { MyGeofenceComponent } from './Myaccount/my-geofence/my-geofence.component';
import { FuelAlertsComponent } from './alert-and-notifications/fuel-alerts/fuel-alerts.component';
import { VehicleCertificateRenewalAlertsComponent } from './alert-and-notifications/vehicle-certificate-renewal-alerts/vehicle-certificate-renewal-alerts.component';
import { BusBranchdetailsComponent } from './bus-management/branches/bus-branchdetails/bus-branchdetails.component';
import { BusRoutesDetailsComponent } from './bus-management/bus-routes/bus-routes-details/bus-routes-details.component';
import { BusTimingDetailsComponent } from './bus-management/bus-timings/bus-timing-details/bus-timing-details.component';
import { AllPositionsReportComponent } from './reports-and-charts/all-positions-report/all-positions-report.component';
import { OverSpeedReportComponent } from './reports-and-charts/over-speed-report/over-speed-report.component';
import { MyTripsComponent } from './Myaccount/my-trips/my-trips.component';
const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'livetrack',
        component: LiveTrackComponent,
      },
      // Dashboard Popup data
      {
        path: 'livetrack/:device_link_id',
        component: LiveTrackComponent,
      },
      {
        path: 'summary_report',
        component: TrackHistoryComponent,
      },
      {
        path: 'summary_report/:device_link_id',
        component: TrackHistoryComponent,
      },
      {
        path: 'track_history',
        component: NewTrackHistoryComponent,
      },
      // Dashboard Popup data
      {
        path: 'track_history/:device_link_id',
        component: NewTrackHistoryComponent,
      },

      {
        path: 'track_history/:device_link_id/:report_date_formatted',
        component: NewTrackHistoryComponent,
      },

      {
        path: 'fuel_dashboard',
        component: FuelDashboardComponent,
      },

      {
        path: 'temperature_dashboard',
        component: TemperatureDashboardComponent,
      },

      {
        path: 'shared-management',
        component: SharedManagementComponent,
      },
      {
        path: 'toll-plaza-info',
        component: TollPlazaTransactionsComponent,
      },

      {
        path: 'fuel-price-info',
        component: FuelPriceInfoComponent,
      },

      // Temperature Dashboard Internals
      { path: 'temperature_dashboard/temperature_alerts', component: MyTemperatureAlertsComponent },
      { path: 'temperature_dashboard/temperature_reports', component: TemperatureReportsComponent },
      { path: 'temperature_dashboard/temperature_notifications', component: MyTemperatureAlertsComponent },


      // {
      //   path: 'temperature-reports',
      //   component: TemperatureReportsComponent,
      // },

      { path: 'reports_charts', component: ReportsAndChartsComponent },

      // Reports and Charts Internal Links

      { path: 'reports_charts/stoppage-report', component: StoppageReportComponent },
      { path: 'reports_charts/track-report', component: TrackReportComponent },
      { path: 'reports_charts/distance-report', component: DistanceReportComponent },

      // Dashboard Popup data
      { path: 'reports_charts/stoppage-report/:device_link_id', component: StoppageReportComponent },
      { path: 'reports_charts/track-report/:device_link_id', component: TrackReportComponent },
      { path: 'reports_charts/distance-report/:device_link_id', component: DistanceReportComponent },

      { path: 'reports_charts/full-vechicle-details', component: VechiclesDetailsComponent },
      { path: 'reports_charts/daywise-km-report', component: DaywiseKmReportComponent },
      { path: 'reports_charts/daywise-km-report/:device_link_id', component: DaywiseKmReportComponent },
      { path: 'reports_charts/daily-summary-km-report', component: DailySummaryKmReportComponent },
      { path: 'reports_charts/24hours-km-report', component: Twenty4HoursKmReportComponent },
      { path: 'reports_charts/24hours-analysis', component: Twenty4HoursAnalysisComponent },
      { path: 'reports_charts/geofence-report', component: GeofenceReportComponent },
      { path: 'reports_charts/driver-performance', component: DriverPerformanceComponent },

      { path: 'reports_charts/track-nearest-vechicle', component: TrackNearestVechileComponent },
      { path: 'reports_charts/charts', component: ChartsComponent },
      { path: 'reports_charts/summary_report', component: TrackHistoryComponent },
      { path: 'reports_charts/temperature-reports', component: TemperatureReportsComponent },
      { path: 'reports_charts/temperature-reports/:device_link_id', component: TemperatureReportsComponent },
      { path: 'reports_charts/fuel-reports', component: FuelReportsComponent },
      { path: 'reports_charts/fuel-reports/:device_link_id', component: FuelReportsComponent },
      { path: 'reports_charts/dashboard-report', component: DashboardReportComponent },
      { path: 'reports_charts/kilometer-summary-management', component: KilometerSummerymanagementComponent },
      { path: 'reports_charts/all-positions-report', component: AllPositionsReportComponent },
      { path: 'reports_charts/over-speed-report', component: OverSpeedReportComponent },

      // full vehicle details link
      { path: 'reports_charts/vehicle-details/:device_link_id/:vehicle_number', component: VehicleNumberDetailsComponent },

      { path: 'gpslock', component: GPSLockComponent },

      { path: 'fleet-management', component: FleetManagementComponent },

      // Fleet Management Internal Links
      { path: 'fleet-management/service-management', component: ServicingManagementComponent },
      { path: 'fleet-management/fuel-management', component: FuelManagementComponent },
      { path: 'fleet-management/driver-management', component: DriverManagementComponent },
      { path: 'fleet-management/tyre-management', component: TyreManagementComponent },
      { path: 'fleet-management/spare-parts-management', component: SparePartManagementComponent },
      // { path: 'fleet-management/alert-management', component: AlertmanagementComponent },
      { path: 'fleet-management/alert_notifications', component: AlertAndNotificationsComponent },
      { path: 'fleet-management/my-trips', component: MyTripsComponent },
      { path: 'fleet-management/kilometer-summary-management', component: KilometerSummerymanagementComponent },
      { path: 'fleet-management/customer-management', component: CustomermanagementComponent },
      { path: 'fleet-management/expanses-management', component: ExpansesManagementComponent },
      { path: 'fleet-management/trip-management', component: TripManagementComponent },
      { path: 'fleet-management/hub-management', component: HubManagementComponent },
      { path: 'fleet-management/vechicle-management', component: VechiclesDetailsComponent },
      { path: 'fleet-management/customer-details/:customer_id', component: CustomerDetailsComponent },

      { path: 'fleet-management/vehicle-details/:device_link_id/:vehicle_number', component: VehicleNumberDetailsComponent },
      { path: 'fleet-management/driver-management/driver-list', component: DriverListComponent },
      { path: 'fleet-management/driver-management/add-driver', component: AddDriverComponent },
      { path: 'fleet-management/driver-management/edit-driver/:user_id', component: AddDriverComponent },
      { path: 'fleet-management/driver-management/driver-details/:user_id', component: DriverDetailsComponent },
      { path: 'fleet-management/hub-management/add-hub', component: AddHubManagementComponent },
      { path: 'fleet-management/hub-management/edit-hub/:hub_id', component: AddHubManagementComponent },
      { path: 'fleet-management/hub-management/hub-details/:hub_id', component: HubDetailsComponent },
      { path: 'fleet-management/routes', component: MyRouteComponent },
      { path: 'fleet-management/create-route', component: CreateRouteComponent },
      {
        path: 'fleet-management/route-details/:route_name/:start_location/:end_location/:distance/:travel_time_mins',
        component: RouteDetailsComponent,
      },


      // Company Management
      { path: 'fleet-management/company-management', component: CompanyManagementComponent },
      { path: 'fleet-management/company-management/add-company', component: AddCompanyManagementComponent },
      {
        path: 'fleet-management/company-management/edit-company/:company_id',
        component: AddCompanyManagementComponent,
      },
      {
        path: 'fleet-management/company-management/company-details/:company_id',
        component: CompanyManagementDetailsComponent,
      },
      {
        path: 'fleet-management/company-management/company-details/:company_id/edit-company/:company_id',
        component: AddCompanyManagementComponent,
      },

      // Shared Management
      { path: 'fleet-management/shared-management', component: SharedManagementComponent },

      {
        path: 'myaccount',
        loadChildren: () => import('./Myaccount/myaccount.module')
          .then(m => m.MyaccountModule),
      },

      // MyAccount Internal Paths
      {
        path: 'myaccount/my-executive',
        component: MyExecutiveComponent,
      },

      { path: 'myaccount/create-group', component: CreateGroupComponent },


      // Use this later
      // { path: 'myaccount/mygroups/edit-group/:group_id', component: CreateGroupComponent },
      {
        path: 'myaccount/mygroups/edit-group', component: EditGroupComponent,
      },

      { path: 'myaccount/driver-details/:user_id', component: DriverDetailsComponent },
      { path: 'myaccount/edit-driver/:user_id', component: AddDriverComponent },
      { path: 'myaccount/shared-user-details/:user_id', component: SharedUserDetailsComponent },
      { path: 'myaccount/mysharedusers/add-shared-user', component: AddSharedUserComponent },
      { path: 'myaccount/edit-shared-user/:user_id', component: AddSharedUserComponent },

      { path: 'myaccount/create-trip', component: CreateTripComponent },
      { path: 'myaccount/trip-details/:trip_id', component: TripDetailsComponent },

      { path: 'myaccount/create-geofence', component: CreateGeofenceComponent },
      { path: 'myaccount/edit-geofence/:geofence_id/:latitude/:longitude/:radius/:location_name/:geofence_name', component: CreateGeofenceComponent },

      {
        path: 'myaccount/geofence-details/:latitude/:longitude/:radius/:location_name/:geofence_name',
        component: GeofenceDetailsComponent,
      },

      // { path: 'myaccount/MyTemperatureAlerts', component: MyTemperatureAlertsComponent },
      { path: 'myaccount/fast-tag-info', component: FastTagInformationComponent },
      {
        path: 'purchases',
        loadChildren: () => import('./purchases/purchases.module')
          .then(m => m.PurchasesModule),
      },

      { path: 'purchases/plan-details', component: PlanDetailsComponent },

      { path: 'purchases/purchased-plan-details', component: PurchasedPlanDetailsComponent },

      { path: 'purchases/purchased-plan-history', component: PurchasedPlanHistoryComponent },

      { path: 'purchases/product-details', component: ProductDetailsComponent },

      { path: 'purchases/order-details', component: OrderDetailsComponent },

      // { path: 'notifications', component: NotificationsComponent },

      { path: 'alert_notifications', component: AlertAndNotificationsComponent },
      { path: 'alert_notifications/basic_notifications', component: NotificationsComponent },
      { path: 'alert_notifications/less_km_alerts', component: LessKmStopDataNotReceiveComponent },
      { path: 'alert_notifications/stopped_time_alerts', component: LessKmStopDataNotReceiveComponent },
      { path: 'alert_notifications/data_not_received_alerts', component: LessKmStopDataNotReceiveComponent },
      { path: 'alert_notifications/temperature_alerts', component: MyTemperatureAlertsComponent },
      { path: 'alert_notifications/geofence_alerts', component: MyGeofenceComponent },
      { path: 'alert_notifications/create-geofence', component: CreateGeofenceComponent },
      { path: 'alert_notifications/edit-geofence/:geofence_id/:latitude/:longitude/:radius/:location_name/:geofence_name', component: CreateGeofenceComponent },
      {
        path: 'alert_notifications/geofence-details/:latitude/:longitude/:radius/:location_name/:geofence_name',
        component: GeofenceDetailsComponent,
      },
      { path: 'alert_notifications/fuel_alerts', component: FuelAlertsComponent },
      { path: 'alert_notifications/ignition_change_alerts', component: FuelAlertsComponent },
      { path: 'alert_notifications/low_battery_alerts', component: FuelAlertsComponent },
      { path: 'alert_notifications/service_reminder_alerts', component: NotificationsComponent },
      { path: 'alert_notifications/trip_management_alerts', component: NotificationsComponent },
      { path: 'alert_notifications/driver_change_alerts', component: NotificationsComponent },
      { path: 'alert_notifications/vehicle_certificate_renewal_alerts', component: VehicleCertificateRenewalAlertsComponent },
      { path: 'alert_notifications/vehicle-details/:device_link_id/:vehicle_number', component: VehicleNumberDetailsComponent },

      {
        path: 'others',
        loadChildren: () => import('./others/others.module')
          .then(m => m.OthersModule),
      },
      // Others/Help Internal child links
      { path: 'help/terms_conditions', component: TermsAndConditionsComponent },
      { path: 'help/privacy_policy', component: PrivacyPolicyComponent },
      { path: 'help/product_warranty', component: ProductWarrentyComponent },
      { path: 'help/about_us', component: AboutUsComponent },
      { path: 'help/services_and_reports', component: ServicesAndReportsComponent },
      { path: 'help/why_utrack', component: WhyUtrackComponent },
      { path: 'help/advantages', component: AdvantagesComponent },
      { path: 'help/industries', component: IndustriesComponent },
      { path: 'help/faqs', component: FAQSComponent },
      { path: 'help/how_to_use', component: HowToUseComponent },
      { path: 'help/my_executive', component: MyExecutiveComponent },

      {
        path: 'bus_management',
        loadChildren: () => import('./bus-management/bus-management.module').then(m => m.BusManagementModule)
      },

      {
        path: 'bus_management/branches/create_branch',
        component: CreateBranchComponent
      },

      {
        path: 'bus_management/branches/edit_branch/:bus_organisation_branch_id',
        component: CreateBranchComponent
      },

      {
        path: 'bus_management/branches/branch_details/:bus_organisation_branch_id',
        component: BusBranchdetailsComponent
      },

      {
        path: 'bus_management/employees/create_employee',
        component: CreateEmployeeComponent
      },

      {
        path: 'bus_management/geofence/create_geofence',
        component: CreateBusGeofenceComponent
      },

      {
        path: 'bus_management/geofence/edit_geofence/:geofence_id',
        component: CreateBusGeofenceComponent
      },

      {
        path: 'bus_management/bus_routes/bus_route_details/:bus_route_id',
        component: BusRoutesDetailsComponent
      },

      {
        path: 'bus_management/bus_timings/bus_timing_details/:bus_route_timing_id',
        component: BusTimingDetailsComponent
      },

      {
        path: 'miscellaneous',
        loadChildren: () => import('./miscellaneous/miscellaneous.module')
          .then(m => m.MiscellaneousModule),
      },


      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },

      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {

}


