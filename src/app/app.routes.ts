// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { PageProductComponent } from './components/page-product/page-product.component';
import { HomeComponent } from '../app/components/home/home.component';
import { AllProductsComponent } from './components/all-products/all-products.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'produto/:id', component: PageProductComponent }, // Rota dinâmica
  { path: 'produtos/:categoria', component: AllProductsComponent }
];
