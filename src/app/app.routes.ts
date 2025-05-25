import { Routes } from '@angular/router';
import { PageProductComponent } from './components/page-product/page-product.component';
import { HomeComponent } from './components/home/home.component'; 
import { AllProductsComponent } from './components/all-products/all-products.component';
import { CartComponent } from './components/cart/cart.component';
import { DashboardVisaoGeralComponent } from './components/dashboard/dashboard-visao-geral/dashboard-visao-geral.component';
import { CheckoutComponent } from './components/checkout/checkout.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { renderMode: 'no-prerender' } },
  { path: 'produto/:id', component: PageProductComponent, data: { renderMode: 'no-prerender' } },
  { path: 'produtos/:categoria', component: AllProductsComponent },
  { path: 'carrinho', component: CartComponent },
  { path: 'dashboard', component: DashboardVisaoGeralComponent },
  { path: 'checkout', component: CheckoutComponent}
];
