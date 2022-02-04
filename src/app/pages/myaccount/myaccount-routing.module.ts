import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyaccountComponent } from './myaccount.component';
import { MyWalletComponent } from './my-wallet/my-wallet.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyTripsComponent } from './my-trips/my-trips.component';
import { MyGeofenceComponent } from './my-geofence/my-geofence.component';
import { MySharedUsersComponent } from './my-shared-users/my-shared-users.component';
import { MyDriversComponent } from './my-drivers/my-drivers.component';
import { MyGroupsComponent } from './my-groups/my-groups.component';
import { DriverListComponent } from '../fleet-management/driver-management/driver-list/driver-list.component';


const routes: Routes = [
  {
    path:'',
    component:MyaccountComponent,
    children:[
      {
        path: 'myprofile',
        component: MyProfileComponent,
      },  
      {
        path: 'mywallet',
        component: MyWalletComponent,
      },
      {
        path: 'mytrips',
        component: MyTripsComponent,
      },
      {
        path: 'mygeofence',
        component: MyGeofenceComponent,
      },
      {
        path:'mysharedusers',
        component:MySharedUsersComponent,
      },
      {
        path:'mydrivers',
        component:DriverListComponent
      },
      {
        path:'mygroups',
        component:MyGroupsComponent
      },
      
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyaccountRoutingModule { }
