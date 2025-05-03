import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private storageKey = 'carrinho_produtos';
  private items: any[] = [];

  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.carregarCarrinho();
  }

  private isBrowser: boolean = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

  private salvarCarrinho() {
    if (this.isBrowser) {
      localStorage.setItem(this.storageKey, JSON.stringify(this.items));
      this.cartSubject.next(this.items);
    }
  }
  
  private carregarCarrinho() {
    if (this.isBrowser) {
      const dadosSalvos = localStorage.getItem(this.storageKey);
      if (dadosSalvos) {
        this.items = JSON.parse(dadosSalvos);
        this.cartSubject.next(this.items);
      }
    }
  }

  addToCart(product: any) {
    this.items.push(product);
    this.salvarCarrinho();
  }

  getItems() {
    return [...this.items];
  }

  clearCart() {
    this.items = [];
    this.salvarCarrinho();
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.salvarCarrinho();
  }
}
