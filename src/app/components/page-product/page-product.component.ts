import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-page-product',
  standalone: true,
  imports: [CommonModule, NgxImageZoomModule, FormsModule],
  templateUrl: './page-product.component.html',
  styleUrl: './page-product.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PageProductComponent {
  produto: any;
  tamanhoSelecionado: string | null = null;
  personalizar: boolean = false;
  patchSelecionado = false;
  nomePersonalizado: string = '';
  numeroPersonalizado: number | null = null;

  constructor(
    private route: ActivatedRoute, 
    private cartService: CartService
  ) {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarProduto(id);
  }

  carregarProduto(id: number) {
    const produtos = [
      {
        id: 1,
        nome: "Camisa Flamengo Titular 25/26 - Versão Torcedor Lançamento",
        imagemPrincipal: "assets/camisas-masculinas/flamengo-2025.png",
        imagens: [
          "assets/camisas-masculinas/flamengo-2025.png",
          "assets/camisas-masculinas/flamengo-2025.png"
        ],
        precoOriginal: 269.00,
        precoPromocional: 149.90,
        desconto: 44,
        tamanhos: ["P", "M", "G", "GG"],
        codigo: "FLA-2025",
        descricao: "Camisa oficial do Flamengo para a temporada 25/26. Tecido leve, respirável e ideal para torcedores apaixonados."
      },
      {
        id: 2,
        nome: "Camisa Santos FC Home 24/25 + #10 Neymar Jr - Umbro Torcedor",
        imagemPrincipal: "assets/camisas-masculinas/santos-2025.jpg",
        imagens: [
          "assets/camisas-masculinas/santos-2025.jpg"
        ],
        precoOriginal: 269.00,
        precoPromocional: 179.90,
        desconto: 33,
        tamanhos: ["P", "M", "G", "GG"],
        codigo: "SAN-2025",
        descricao: "Camisa oficial do Santos FC com personalização do Neymar Jr. Produto licenciado Umbro."
      },
      {
        id: 3,
        nome: "Camisa Cruzeiro 25/26 Treino Clara - Adidas Versão Torcedor",
        imagemPrincipal: "assets/camisas-masculinas/cruzeiro-2025.jpg",
        imagens: [
          "assets/camisas-masculinas/cruzeiro-2025.jpg"
        ],
        precoOriginal: 269.00,
        precoPromocional: 149.90,
        desconto: 44,
        tamanhos: ["P", "M", "G", "GG"],
        codigo: "CRU-2025",
        descricao: "Camisa de treino oficial do Cruzeiro para a temporada 25/26. Estilo e conforto para o torcedor celeste."
      },
      {
        id: 4,
        nome: "Camisa Inter Miami II 25/26 - Adidas Torcedor Masculina Lançamento",
        imagemPrincipal: "assets/camisas-masculinas/inter-miami-2025.jpg",
        imagens: [
          "assets/camisas-masculinas/inter-miami-2025.jpg"
        ],
        precoOriginal: 269.00,
        precoPromocional: 149.90,
        desconto: 44,
        tamanhos: ["P", "M", "G", "GG"],
        codigo: "INT-2025",
        descricao: "A nova camisa do Inter Miami com visual moderno e elegante. Sinta-se como Messi em campo!"
      }
    ];

    this.produto = produtos.find(p => p.id === id);
  }

  limitarNumero(event: Event) {
    const input = event.target as HTMLInputElement;
    let valor = input.value;
  
    valor = valor.replace(/[^0-9]/g, '');

    if (valor.length > 2) {
      valor = valor.slice(0, 2);
    }

    this.numeroPersonalizado = valor ? Number(valor) : null;
    input.value = valor;
  }
  

  get valorTotal(): number {
    let total = this.produto?.precoPromocional || 0;
    if (this.personalizar) total += 20;
    if (this.patchSelecionado) total += 15;
    return total;
  }
  
  adicionarAoCarrinho() {
    const itemCarrinho = {
      ...this.produto,
      quantidade: 1,
      tamanho: this.tamanhoSelecionado,
      personalizar: this.personalizar,
      patch: this.patchSelecionado,
    };
  
    this.cartService.addToCart(itemCarrinho);
    alert('Produto adicionado ao carrinho!');
  }

  definirPersonalizacao(valor: boolean) {
    this.personalizar = valor;
  
    if (!valor) {
      this.nomePersonalizado = '';
      this.numeroPersonalizado = null;
    }
  }
  
}
