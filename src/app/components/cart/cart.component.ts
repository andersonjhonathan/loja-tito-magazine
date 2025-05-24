import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { Router, RouterModule } from '@angular/router';
import { BenefitsComponent } from "../benefits/benefits.component";
import { AuthService } from '../header/modal-login/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  standalone: true,
  selector: 'app-cart',
  imports: [CommonModule, BenefitsComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {
  items: any[] = [];
  userId: string = '';
  isLoggedIn: boolean = false;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  async ngOnInit() {
    const user = this.authService.getUsuarioLogado();

    if (user && user.id) {
      this.userId = user.id;
      this.isLoggedIn = true;

      // Itens do carrinho (com productId, size, quantity etc)
      const cartItems = await this.cartService.getCartItems(this.userId) || [];

      // Agora você pode buscar os detalhes de cada produto pelo productId
      const itemsCompletos = await Promise.all(
        cartItems.map(async (item) => {
          const produto = await this.cartService.getProductById(item.product_id);
          return {
            ...item,
            nome: produto.name,
            imagemPrincipal: produto.image_url,
            precoOriginal: produto.preco_original,
            precoPromocional: produto.preco_atual,
          };
        })
      );

      this.items = itemsCompletos;
    } else {
      this.isLoggedIn = false;
    }
  }


  async removerItem(itemId: string) {
    if (!this.isLoggedIn) return;
    await this.cartService.removeItem(itemId);
    this.items = this.items.filter(item => item.id !== itemId);
    this.toastService.info('Item removido do carrinho.');
  }


  async incrementar(item: any) {
    if (!this.isLoggedIn) return;

    const novaQuantidade = item.quantity + 1;
    await this.cartService.addToCart(this.userId, item.product_id, item.size, novaQuantidade);

    item.quantity = novaQuantidade;
  }

  async decrementar(item: any) {
    if (!this.isLoggedIn || item.quantity <= 1) return;

    const novaQuantidade = item.quantity - 1;
    await this.cartService.addToCart(this.userId, item.product_id, item.size, novaQuantidade);

    item.quantity = novaQuantidade;
  }


  todosOsProdutos() {
    this.router.navigate(['/produtos', 'Masculinas']);
  }

  calcularTotal(): number {
    if (!this.items || this.items.length === 0) return 0;
    return this.items.reduce((total, item) => {
      const preco = Number(item.precoPromocional) || 0;
      const qtd = Number(item.quantity) || 0; // Corrigido aqui
      return total + (preco * qtd);
    }, 0);
  }

  calcularEconomia(): number {
    if (!this.items || this.items.length === 0) return 0;
    return this.items.reduce((economia, item) => {
      const precoOriginal = Number(item.precoOriginal) || 0;
      const precoPromocional = Number(item.precoPromocional) || 0;
      const qtd = Number(item.quantity) || 0; // Corrigido aqui
      return economia + ((precoOriginal - precoPromocional) * qtd);
    }, 0);
  }


}

