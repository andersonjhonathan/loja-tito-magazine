import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ProductService, Product } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-page-product',
  standalone: true,
  imports: [CommonModule, NgxImageZoomModule, FormsModule, HttpClientModule],
  templateUrl: './page-product.component.html',
  styleUrl: './page-product.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PageProductComponent {
  produto!: Product;
  tamanhoSelecionado: string | null = null;
  personalizar: boolean = false;
  patchSelecionado = false;
  nomePersonalizado: string = '';
  numeroPersonalizado: number | null = null;
  localizacao: string = 'Detectando local...';
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private http: HttpClient,
    private router: Router,
    private productService: ProductService,
    private toastService: ToastService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarProduto(id);
    }
    this.buscarLocalizacao();
  }

  carregarProduto(id: string) {
    this.productService.getProductById(id).subscribe((produto) => {
      this.produto = produto;
    });
  }

  limitarNumero(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value.replace(/[^0-9]/g, '');
    valor = valor.slice(0, 2);
    this.numeroPersonalizado = valor ? Number(valor) : null;
    input.value = valor;
  }

  get valorTotal(): number {
    let total = this.produto?.preco_atual || 0;
    if (this.personalizar) total += 20;
    if (this.patchSelecionado) total += 15;
    return total;
  }

  async adicionarAoCarrinho() {

    if (!this.tamanhoSelecionado) {
      this.toastService.warning('Selecione um tamanho antes de adicionar ao carrinho.');
      return;
    }

    const userJson = localStorage.getItem('usuario_logado');
    if (!userJson) {
      console.error('Usuário não encontrado no localStorage');
      return;
    }
    const user = JSON.parse(userJson);

    const itemCarrinho = {
      ...this.produto,
      quantity: 1,
      userId: user.id,
      productId: this.produto.id,
      size: this.tamanhoSelecionado,
      personalizar: this.personalizar,
      patch: this.patchSelecionado,
    };

    this.loading = true;

    const precoFinal = this.personalizar ? this.produto.preco_atual + 20 : this.produto.preco_atual;

    try {
      await this.cartService.addToCart(
        itemCarrinho.userId,
        itemCarrinho.productId,
        itemCarrinho.size,
        itemCarrinho.quantity,
        itemCarrinho.personalizar,
        precoFinal
      );

      this.router.navigate(['/carrinho']);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      this.toastService.error('Erro ao adicionar ao carrinho.')
    } finally {
      this.toastService.success('Item adicionado ao carrinho!');
      this.loading = false;
    }
  }

  definirPersonalizacao(valor: boolean) {
    this.personalizar = valor;
    if (!valor) {
      this.nomePersonalizado = '';
      this.numeroPersonalizado = null;
    }
  }

  buscarLocalizacao() {
    this.http.get<any>('http://ip-api.com/json/').subscribe({
      next: (data) => {
        this.localizacao = `${data.city}, ${data.region} e Região`;
      },
      error: () => {
        this.localizacao = 'sua região';
      },
    });
  }

  ComprarProduto() {
    this.adicionarAoCarrinho();
  }
}
