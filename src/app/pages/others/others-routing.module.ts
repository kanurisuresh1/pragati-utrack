import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OthersComponent } from './others.component';
import { SettingsComponent } from './settings/settings.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { HelpComponent } from './help/help.component';
import { ReferAndEarnComponent } from './refer-and-earn/refer-and-earn.component';


const routes: Routes = [{
  path:'',
  component:OthersComponent,
  children:[
    {
      
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'contactus',
        component: ContactUsComponent,
      },
      {
        path:'help',
        component:HelpComponent
  
      },
      {
        path:'refernearn',
        component:ReferAndEarnComponent
  
      },
    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OthersRoutingModule { }
