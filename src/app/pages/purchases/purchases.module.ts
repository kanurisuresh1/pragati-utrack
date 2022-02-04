import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchasesRoutingModule } from './purchases-routing.module';
import { PurchasesComponent } from '../purchases/purchases.component';
import { BuyPlansComponent } from './buy-plans/buy-plans.component';
import { BuyProductsComponent } from './buy-products/buy-products.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { PlanDetailsComponent } from './buy-plans/plan-details/plan-details.component';
import { PurchasedPlanDetailsComponent } from './buy-plans/purchased-plan-details/purchased-plan-details.component';
import { PurchasedPlanHistoryComponent } from './buy-plans/purchased-plan-history/purchased-plan-history.component';
import { ProductDetailsComponent } from './buy-products/product-details/product-details.component';
import { OrderDetailsComponent } from './my-orders/order-details/order-details.component';


@NgModule({
  declarations: [PurchasesComponent, BuyPlansComponent, BuyProductsComponent, MyOrdersComponent, PlanDetailsComponent, PurchasedPlanDetailsComponent, PurchasedPlanHistoryComponent, ProductDetailsComponent, OrderDetailsComponent],
  imports: [
    CommonModule,
    PurchasesRoutingModule
  ]
})
export class PurchasesModule { }
