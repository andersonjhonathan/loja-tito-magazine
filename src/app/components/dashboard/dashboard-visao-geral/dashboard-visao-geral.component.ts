import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from '../modal-add-product/add-product.component';
import { ProductService, Product } from '../../../services/product.service';

@Component({
  selector: 'app-dashboard-visao-geral',
  standalone: true,
  imports: [CommonModule, FormsModule, HighchartsChartModule, NgbModule],
  templateUrl: './dashboard-visao-geral.component.html',
  styleUrl: './dashboard-visao-geral.component.css'
})
export class DashboardVisaoGeralComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private productService: ProductService,) { }

  produtos: Product[] = [];
  produtosPorPagina: Product[] = [];
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalPaginas: number = 0;

  ngOnInit(): void {
    this.carregarProdutos();
  }

   carregarProdutos() {
    this.productService.getProducts().subscribe(
      (produtos: Product[]) => {
        this.produtos = produtos;
        this.totalPaginas = Math.ceil(this.produtos.length / this.itensPorPagina); // Calcula o total de páginas
        this.atualizarProdutosPorPagina();
      },
      (error) => {
        console.error('Erro ao carregar produtos', error);
      }
    );
  }

  produto = {
    id: 0,
    nome: '',
    imagem: '',
    precoOriginal: 0,
    precoAtual: 0,
    desconto: 0
  };

  vendas = [
    { id: 1, cliente: 'João Silva', total: 2500, data: '2025-04-10' },
    { id: 2, cliente: 'Maria Oliveira', total: 3000, data: '2025-04-15' },
    { id: 3, cliente: 'Carlos Souza', total: 1800, data: '2025-04-20' },
  ];


  public Highcharts = Highcharts;
  public chartOptions: Highcharts.Options = {
    chart: { type: 'bar' },
    title: { text: 'Vendas por Mês' },
    xAxis: { categories: ['Janeiro', 'Fevereiro', 'Março'] },
    series: [{ name: 'Vendas', data: [65, 59, 80], type: 'bar' }]
  };

 atualizarProdutosPorPagina() {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.produtosPorPagina = this.produtos.slice(inicio, fim);
  }

  // Navegação para a página anterior
  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarProdutosPorPagina();
    }
  }

  // Navegação para a próxima página
  proximaPagina() {
    if (this.paginaAtual * this.itensPorPagina < this.produtos.length) {
      this.paginaAtual++;
      this.atualizarProdutosPorPagina();
    }
  }

  // Navegar para uma página específica
  irParaPagina(pagina: number) {
    this.paginaAtual = pagina;
    this.atualizarProdutosPorPagina();
  }

  // Função para gerar dados aleatórios de vendas
  gerarDadosAleatorios(): number[] {
    const dadosAleatorios = [];
    for (let i = 0; i < 12; i++) {
      // Gera um número aleatório entre 1000 e 5000 para simular as vendas mensais
      dadosAleatorios.push(Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);
    }
    return dadosAleatorios;
  }

  alterarProduto(produto: any) {
    console.log('Produto alterado', produto);
  }

  removerProduto(produtoId: number) {
    console.log('Produto removido', produtoId);
  }

  abrirAdicionarProduto() {
    this.modalService.open(AddProductComponent, { size: 'lg' });
  }

  excluirUsuario() {
  }

  listarVendidos() {
  }

}
