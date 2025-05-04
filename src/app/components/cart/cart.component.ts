import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { BenefitsComponent } from "../benefits/benefits.component";

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, BenefitsComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  items: any[] = [];

  constructor(
    private cartService: CartService, 
    private router: Router) 
    {}

  ngOnInit() {
    this.items = this.cartService.getItems();
  }

  calcularTotal(): number {
    return this.items.reduce((total, item) => total + (item.precoPromocional * item.quantidade), 0);
  }
  
  calcularEconomia(): number {
    return this.items.reduce((economia, item) => economia + ((item.precoOriginal - item.precoPromocional) * item.quantidade), 0);
  }
  
  incrementar(item: any) {
    item.quantidade++;
  }
  
  decrementar(item: any) {
    if (item.quantidade > 1) item.quantidade--;
  }

  removerItem(index: number) {
    this.cartService.removeItem(index);
    this.items = this.cartService.getItems(); 
  }

  todosOsProdutos(){
    this.router.navigate(['/produtos', 'Masculinas']);
  }
  
}
