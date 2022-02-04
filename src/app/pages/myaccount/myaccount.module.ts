import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyaccountRoutingModule } from './myaccount-routing.module';
import { MyaccountComponent } from './myaccount.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { MyTripsComponent } from './my-trips/my-trips.component';
import { MyGeofenceComponent } from './my-geofence/my-geofence.component';
import { MySharedUsersComponent } from './my-shared-users/my-shared-users.component';
import { MyDriversComponent } from './my-drivers/my-drivers.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';




import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PortalModule } from '@angular/cdk/portal';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { CdkTableModule } from '@angular/cdk/table';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateGroupComponent } from './my-groups/create-group/create-group.component';
import { EditGroupComponent } from './my-groups/edit-group/edit-group.component';
import { PagesModule } from '../pages.module';
import { MatTableExporterModule } from 'mat-table-exporter';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { NbTooltipModule, NbAccordionModule, NbIconModule, NbCardModule, NbMenuModule } from '@nebular/theme';
import { ChartsModule } from 'ng2-charts';
import { MatNativeDatetimeModule, MatDatetimepickerModule } from '@mat-datetimepicker/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { MiscellaneousModule } from '../miscellaneous/miscellaneous.module';
import { SharedUserDetailsComponent } from './my-shared-users/shared-user-details/shared-user-details.component';
import { AddSharedUserComponent } from './my-shared-users/add-shared-user/add-shared-user.component';
import { CreateTripComponent } from './my-trips/create-trip/create-trip.component';
import { TripDetailsComponent } from './my-trips/trip-details/trip-details.component';
import { AddOtherExpensesComponent } from './my-trips/add-other-expenses/add-other-expenses.component';
import { CreateGeofenceComponent } from './my-geofence/create-geofence/create-geofence.component';
import { GeofenceDetailsComponent } from './my-geofence/geofence-details/geofence-details.component';
import { MyTemperatureAlertsComponent } from './my-temperature-alerts/my-temperature-alerts.component';
import { AddTemperatureAlertsComponent } from './my-temperature-alerts/add-temperature-alerts/add-temperature-alerts.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { NgOtpInputModule } from 'ng-otp-input';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TagInputModule } from 'ngx-chips';
import { FastTagInformationComponent } from './fast-tag-information/fast-tag-information.component';
import { AddFastTagDetailsComponent } from './fast-tag-information/add-fast-tag-details/add-fast-tag-details.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CreateGeofenceAlertComponent } from './my-geofence/create-geofence-alert/create-geofence-alert.component';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [MyaccountComponent,
    MyProfileComponent,
    MyWalletComponent,
    MyTripsComponent,
    MyGeofenceComponent,
    MySharedUsersComponent,
    MyDriversComponent,
    MyGroupsComponent,
    CreateGroupComponent,
    EditGroupComponent,
    SharedUserDetailsComponent,
    AddSharedUserComponent,
    CreateTripComponent,
    TripDetailsComponent,
    AddOtherExpensesComponent,
    CreateGeofenceComponent,
    GeofenceDetailsComponent,
    MyTemperatureAlertsComponent,
    AddTemperatureAlertsComponent,
    FastTagInformationComponent,
    AddFastTagDetailsComponent,
    CreateGeofenceAlertComponent,
  ],
  imports: [
    CommonModule,
    MyaccountRoutingModule,
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
    ImageCropperModule
  ],
  providers: [
    MatNativeDatetimeModule,
    MatDatetimepickerModule,
  ]
})
export class MyaccountModule { }
