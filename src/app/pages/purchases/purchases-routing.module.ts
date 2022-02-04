import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchasesComponent } from './purchases.component';
import { BuyPlansComponent } from './buy-plans/buy-plans.component';
import { BuyProductsComponent } from './buy-products/buy-products.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';


const routes: Routes = [
  {
    path: '',
    component: PurchasesComponent,
    children: [ {
      path: 'buyplans',
      component: BuyPlansComponent,
    }, {
      path: 'buyproducts',
      component: BuyProductsComponent,
    }, {
      path: 'myorders',
      component: MyOrdersComponent,
    }, 
  ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesRoutingModule { }
