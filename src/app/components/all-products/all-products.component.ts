import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-all-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './all-products.component.html',
  styleUrl: './all-products.component.css'
})
export class AllProductsComponent implements OnInit {

  categorias = ['Masculinas', 'Femininas', 'Tênis', 'NBA', 'Versões Torcedor', 'Versões Jogador', 'Retrô', 'Kit Infantil'];

  produtos: Product[] = [];
  produtosFiltrados: Product[] = [];
  produtosPaginados: Product[] = [];
  paginaAtual = 1;
  itensPorPagina = 8;
  ordenacaoSelecionada = 'maisVendidos';
  categoriaSelecionada: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe((produtos: Product[]) => {
      this.produtos = produtos;
      this.route.params.subscribe(params => {
        const categoria = params['categoria'];
        if (categoria) {
          this.filtrarPorCategoria(categoria);
        }
      });
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

    this.produtosFiltrados = this.produtos.filter(produto => 
      produto.category.toLowerCase() === categoria.toLowerCase()
    );

    this.ordenarProdutos();
  }

  ordenarProdutos() {
    if (this.ordenacaoSelecionada === 'menorPreco') {
      this.produtosFiltrados.sort((a, b) => a.preco_atual - b.preco_atual);
    } else if (this.ordenacaoSelecionada === 'maiorPreco') {
      this.produtosFiltrados.sort((a, b) => b.preco_atual - a.preco_atual);
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

