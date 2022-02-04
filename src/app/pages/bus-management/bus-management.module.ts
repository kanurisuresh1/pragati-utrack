import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusManagementRoutingModule } from './bus-management-routing.module';
import { OrganisationsComponent } from './organisations/organisations.component';
import { BranchesComponent } from './branches/branches.component';
import { EmployeesComponent } from './employees/employees.component';
import { BusRoutesComponent } from './bus-routes/bus-routes.component';
import { BusTimingsComponent } from './bus-timings/bus-timings.component';
import { BusesComponent } from './buses/buses.component';
import { StudentsComponent } from './students/students.component';
import { BusNotificationsComponent } from './bus-notifications/bus-notifications.component';
import { BusManagementComponent } from './bus-management.component';
import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatNativeDatetimeModule, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { NbMenuModule, NbTooltipModule, NbAccordionModule, NbIconModule, NbCardModule } from '@nebular/theme';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MatTableExporterModule } from 'mat-table-exporter';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NgOtpInputModule } from 'ng-otp-input';
import { ChartsModule } from 'ng2-charts';
import { TagInputModule } from 'ngx-chips';
import { NgxEchartsModule } from 'ngx-echarts';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { MiscellaneousModule } from '../miscellaneous/miscellaneous.module';
import { HttpLoaderFactory } from '../pages.module';
import { AgmCoreModule } from '@agm/core';
import { CreateBranchComponent } from './branches/create-branch/create-branch.component';
import { CreateOrganisationComponent } from './organisations/create-organisation/create-organisation.component';
import { CreateEmployeeComponent } from './employees/create-employee/create-employee.component';
import { CreateBusTimingComponent } from './bus-timings/create-bus-timing/create-bus-timing.component';
import { BusGeofencesComponent } from './bus-geofences/bus-geofences.component';
import { CreateBusGeofenceComponent } from './bus-geofences/create-bus-geofence/create-bus-geofence.component';
import { CreateBusRouteComponent } from './bus-routes/create-bus-route/create-bus-route.component';
import { BusBranchdetailsComponent } from './branches/bus-branchdetails/bus-branchdetails.component';
import { BusRoutesDetailsComponent } from './bus-routes/bus-routes-details/bus-routes-details.component';
import { BusTimingDetailsComponent } from './bus-timings/bus-timing-details/bus-timing-details.component';
import { BusPassengersComponent } from './bus-passengers/bus-passengers.component';
import { CreateBusPassengerComponent } from './bus-passengers/create-bus-passenger/create-bus-passenger.component';
import { BusTripsComponent } from './bus-trips/bus-trips.component';
import { CreateBusTripComponent } from './bus-trips/create-bus-trip/create-bus-trip.component';
import { CreateBusRoutePointComponent } from './bus-routes/create-bus-route-point/create-bus-route-point.component';
import { AgmDirectionModule } from 'agm-direction';

@NgModule({
  declarations: [BusManagementComponent,
    OrganisationsComponent,
    BranchesComponent,
    EmployeesComponent,
    BusRoutesComponent,
    BusTimingsComponent,
    BusesComponent, StudentsComponent,
    BusNotificationsComponent,
    CreateOrganisationComponent, CreateBranchComponent, CreateEmployeeComponent,
    CreateBusTimingComponent, BusGeofencesComponent, CreateBusGeofenceComponent,
    CreateBusRouteComponent,
    BusBranchdetailsComponent,
    BusRoutesDetailsComponent,
    BusTimingDetailsComponent,
    BusPassengersComponent,
    CreateBusPassengerComponent,
    BusTripsComponent,
    CreateBusTripComponent,
    CreateBusRoutePointComponent],
  imports: [
    CommonModule,
    BusManagementRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    MiscellaneousModule,
    FormsModule,
    ReactiveFormsModule,
    A11yModule,
    ClipboardModule,
    CdkStepperModule,
    CdkTableModule,
    CdkTreeModule,
    DragDropModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    PortalModule,
    ScrollingModule,
    MatTableExporterModule,
    HttpClientModule,
    NgHttpLoaderModule.forRoot(),
    NbTooltipModule,
    NbAccordionModule,
    ChartsModule,
    NbIconModule,
    MatNativeDatetimeModule,
    MatDatetimepickerModule,
    NgxEchartsModule,
    NbCardModule,
    NgxMatSelectSearchModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    NgOtpInputModule,
    TagInputModule,
    ImageCropperModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDCiXdCAmivYYCHOl3yDmePcYYfcSxODR0',
      libraries: ["places"]
    }),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDCiXdCAmivYYCHOl3yDmePcYYfcSxODR0',
    }),
    AgmDirectionModule,
  ]
})
export class BusManagementModule { }
