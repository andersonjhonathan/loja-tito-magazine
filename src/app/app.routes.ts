// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PageProductComponent } from './components/page-product/page-product.component';
import { HomeComponent } from '../app/components/home/home.component';
import { AllProductsComponent } from './components/all-products/all-products.component';
import { CartComponent } from './components/cart/cart.component';
import { DashboardVisaoGeralComponent } from './components/dashboard/dashboard-visao-geral/dashboard-visao-geral.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'produto/:id', component: PageProductComponent }, // Rota dinâmica
  { path: 'produtos/:categoria', component: AllProductsComponent },
  { path: 'carrinho', component: CartComponent },
  { path: 'dashboard', component: DashboardVisaoGeralComponent},
];
