import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
//import { LoginComponent } from './pages/login/login.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { ForgotpasswordComponent } from './pages/forgotpassword/forgotpassword.component';
import { ExecutiveOverviewComponent } from './pages/executive-overview/executive-overview.component';
import { UsermanagementComponent } from './pages/usermanagement/usermanagement.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { StockManagementComponent } from './pages/stock-management/stock-management.component';
import { PurchaseRequisitionComponent } from './purchase-requisition/purchase-requisition.component';
import { TicketManagementComponent } from './pages/ticket-management/ticket-management.component';
import { InventoryAnalyticsComponent } from './pages/inventory-analytics/inventory-analytics.component';
import { PurchaseOrderComponent } from './pages/purchase-order/purchase-order.component';
import { GoodsReceiptNoteComponent } from './pages/goods-receipt-note/goods-receipt-note.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'registration',
    component: RegistrationComponent
  },
  {
    path: 'forgot',
    component: ForgotpasswordComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'analytics', pathMatch: 'full' },

      // Core Views
      { path: 'analytics', component: ExecutiveOverviewComponent },
      { path: 'inventory-analytics', component: InventoryAnalyticsComponent },
      { path: 'users', component: UsermanagementComponent },

      // Case-sensitivity issues ozhivakkaan:
      { path: 'products', component: ProductManagementComponent },
      { path: 'purchase-order', component: PurchaseOrderComponent },
      { path: 'Products', redirectTo: 'products', pathMatch: 'full' },


      { path: 'Products', redirectTo: 'products', pathMatch: 'full' },

      { path: 'stock', component: StockManagementComponent },
      { path: 'Stock', redirectTo: 'stock', pathMatch: 'full' },

      { path: 'purchase-requisition', component: PurchaseRequisitionComponent },
      { path: 'goods-receipt-note', component: GoodsReceiptNoteComponent },
      { path: 'settings', component: TicketManagementComponent }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }

];
