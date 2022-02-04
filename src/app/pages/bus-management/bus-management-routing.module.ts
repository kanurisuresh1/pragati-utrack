import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchesComponent } from './branches/branches.component';
import { BusGeofencesComponent } from './bus-geofences/bus-geofences.component';
import { BusManagementComponent } from './bus-management.component';
import { BusNotificationsComponent } from './bus-notifications/bus-notifications.component';
import { BusPassengersComponent } from './bus-passengers/bus-passengers.component';
import { BusRoutesComponent } from './bus-routes/bus-routes.component';
import { BusTimingsComponent } from './bus-timings/bus-timings.component';
import { BusTripsComponent } from './bus-trips/bus-trips.component';
import { BusesComponent } from './buses/buses.component';
import { EmployeesComponent } from './employees/employees.component';
import { OrganisationsComponent } from './organisations/organisations.component';


const routes: Routes = [
  {
    path: '',
    component: BusManagementComponent,
    children: [

      {
        path: 'organisations',
        component: OrganisationsComponent,

      },

      {
        path: 'branches',
        component: BranchesComponent,

      },

      {
        path: 'employees',
        component: EmployeesComponent,

      },

      {
        path: 'geofence',
        component: BusGeofencesComponent
      },

      {
        path: 'bus_routes',
        component: BusRoutesComponent,

      },

      {
        path: 'bus_trips',
        component: BusTripsComponent,
      },
      {
        path: 'passengers',
        component: BusPassengersComponent,

      },

      {
        path: 'bus_timings',
        component: BusTimingsComponent,

      },

      {
        path: 'bus_notifications',
        component: BusNotificationsComponent,

      },
      {
        path: 'buses',
        component: BusesComponent
      },




    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusManagementRoutingModule { }
