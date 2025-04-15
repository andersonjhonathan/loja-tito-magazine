import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Produto } from '../all-products/all-products.model'

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css'
})
export class AllProductsComponent implements OnInit {

  categorias = ['Masculinas', 'Femininas', 'Tênis', 'NBA', 'Versões Torcedor', 'Versões Jogador', 'Retrô', 'Kit Infantil'];

  // Mock de produtos masculinos
  produtosMasculinos: Produto[] = [
    {
      nome: 'Camisa Real Madrid Home 22/23',
      imagem: 'assets/imagens/real_home_22_23.png',
      preco: 199.90,
      precoOriginal: 279.90,
      promocao: true,
      categoria: 'Masculinas'
    },
    {
      nome: 'Camisa Real Madrid Away 23/24',
      imagem: 'assets/imagens/real_away_23_24.png',
      preco: 199.90,
      precoOriginal: 279.90,
      promocao: true,
      categoria: 'Masculinas'
    },
    {
      nome: 'Camisa Flamengo 2024',
      imagem: 'assets/imagens/flamengo_2024.png',
      preco: 159.90,
      precoOriginal: 219.90,
      promocao: false,
      categoria: 'Masculinas'
    },
    {
      nome: 'Jaqueta Adidas Masculina',
      imagem: 'assets/imagens/jaqueta_adidas.png',
      preco: 299.90,
      precoOriginal: 399.90,
      promocao: true,
      categoria: 'Masculinas'
    }
  ];

  // Mock de produtos femininos
  produtosFemininos: Produto[] = [
    {
      nome: 'Camisa Nike Feminina 2024',
      imagem: 'assets/imagens/nike_feminina_2024.png',
      preco: 179.90,
      precoOriginal: 229.90,
      promocao: true,
      categoria: 'Femininas'
    },
    {
      nome: 'Camisa Palmeiras Feminina 23/24',
      imagem: 'assets/imagens/palmeiras_feminina.png',
      preco: 199.90,
      precoOriginal: 259.90,
      promocao: false,
      categoria: 'Femininas'
    },
    {
      nome: 'Blusa Feminina Polo',
      imagem: 'assets/imagens/blusa_polo_feminina.png',
      preco: 129.90,
      precoOriginal: 159.90,
      promocao: true,
      categoria: 'Femininas'
    },
    {
      nome: 'Vestido Casual Feminino',
      imagem: 'assets/imagens/vestido_casual_feminino.png',
      preco: 249.90,
      precoOriginal: 319.90,
      promocao: false,
      categoria: 'Femininas'
    }
  ];

  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  produtosPaginados: Produto[] = [];
  paginaAtual = 1;
  itensPorPagina = 8;
  ordenacaoSelecionada = 'maisVendidos';
  categoriaSelecionada: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.atualizarProdutos();
    this.route.params.subscribe(params => {
      const categoria = params['categoria'];
      if (categoria) {
        this.filtrarPorCategoria(categoria);
      }
    });
  }

  atualizarProdutos() {
    this.categoriaSelecionada = '';
    this.produtosFiltrados = [];
    this.produtosPaginados = [];
    this.paginaAtual = 1;
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaSelecionada = categoria;
    this.paginaAtual = 1;
    
    switch (categoria.toLowerCase()) {
      case 'masculinas':
        this.produtosFiltrados = this.produtosMasculinos;
        break;
      case 'femininas':
        this.produtosFiltrados = this.produtosFemininos;
        break;
      // case 'tenis':
      //   this.produtosFiltrados = this.produtosTenis;
      //   break;
      // case 'nba':
      //   this.produtosFiltrados = this.produtosNBA;
      //   break;
      // case 'torcedor':
      //   this.produtosFiltrados = this.produtosTorcedor;
      //   break;
      // case 'jogador':
      //   this.produtosFiltrados = this.produtosJogador;
      //   break;
      // case 'retro':
      //   this.produtosFiltrados = this.produtosRetro;
      //   break;
      // case 'infantil':
      //   this.produtosFiltrados = this.produtosInfantil;
      //   break;
      default:
        this.produtosFiltrados = [];
    }
  
    this.atualizarPaginacao();
  }
  
  

  ordenarProdutos() {
    if (this.ordenacaoSelecionada === 'menorPreco') {
      this.produtosFiltrados.sort((a, b) => a.preco - b.preco);
    } else if (this.ordenacaoSelecionada === 'maiorPreco') {
      this.produtosFiltrados.sort((a, b) => b.preco - a.preco);
    }
    this.atualizarPaginacao();
  }

  get totalPaginas() {
    return Array(Math.ceil(this.produtosFiltrados.length / this.itensPorPagina)).fill(0).map((_, i) => i + 1);
  }

  irParaPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas.length) {
      this.paginaAtual = pagina;
      this.atualizarPaginacao();
    }
  }

  atualizarPaginacao() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.produtosPaginados = this.produtosFiltrados.slice(inicio, fim);
  }

navegarParaCategoria(categoria: string) {
  const categoriaUrl = categoria.toLowerCase().replace('ç', 'c').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  this.router.navigate(['/produtos', categoriaUrl]);
}

}
