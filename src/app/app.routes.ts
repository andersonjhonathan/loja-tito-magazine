import { Routes } from '@angular/router';
import { PageProductComponent } from './components/page-product/page-product.component';
import { HomeComponent } from './components/home/home.component'; 
import { AllProductsComponent } from './components/all-products/all-products.component';
import { CartComponent } from './components/cart/cart.component';
import { DashboardVisaoGeralComponent } from './components/dashboard/dashboard-visao-geral/dashboard-visao-geral.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { SuccessComponent } from './components/success/success.component';
import { PendingComponent } from './components/pending/pending.component';
import { FailureComponent } from './components/failure/failure.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { renderMode: 'no-prerender' } },
  { path: 'produtos', component: AllProductsComponent},
  { path: 'produto/:id', component: PageProductComponent, data: { renderMode: 'no-prerender' } },
  { path: 'produtos/:categoria', component: AllProductsComponent },
  { path: 'carrinho', component: CartComponent },
  { path: 'dashboard', component: DashboardVisaoGeralComponent },
  { path: 'checkout', component: CheckoutComponent},
  { path: 'success', component: SuccessComponent},
  { path: 'pending', component: PendingComponent},
  { path: 'failure', component: FailureComponent},
  { path: 'detalhe-dos-pedidos', component: OrderDetailComponent}
];
