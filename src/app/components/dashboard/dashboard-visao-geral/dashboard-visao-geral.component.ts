import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from '../modal-add-product/add-product.component';
import { ProductService, Product } from '../../../services/product.service';
import { DeviceService } from '../../../services/device.service';
import { Venda } from './model/dashboard-vendas.response'

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
    private productService: ProductService,
    private deviceService: DeviceService
  ) { }

  produtos: Product[] = [];
  produtosPorPagina: Product[] = [];
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalPaginas: number = 0;
  isMobile: boolean = false;
  vendasPaginadas: Venda[] = [];

  paginaAtualVendas: number = 1;
  itensPorPaginaVendas: number = 10;
  totalPaginasVendas: number = 0;

  ngOnInit(): void {
    this.carregarProdutos();
    this.calcularPaginacaoVendas();
    this.isMobile = this.deviceService.isMobile();
    this.deviceService.isMobile$.subscribe(value => {
      this.isMobile = value;
    });
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

  vendas: Venda[] = [
  { id: 1, cliente: 'João Silva', total: 2500, data: '2025-04-10' },
  { id: 2, cliente: 'Maria Oliveira', total: 3000, data: '2025-04-15' },
  { id: 3, cliente: 'Carlos Souza', total: 1800, data: '2025-04-20' },
  { id: 4, cliente: 'Ana Costa', total: 2750, data: '2025-04-22' },
  { id: 5, cliente: 'Bruno Lima', total: 3200, data: '2025-04-25' },
  { id: 6, cliente: 'Fernanda Dias', total: 2100, data: '2025-04-28' },
  { id: 7, cliente: 'Ricardo Gomes', total: 1950, data: '2025-05-01' },
  { id: 8, cliente: 'Patrícia Rocha', total: 3400, data: '2025-05-03' },
  { id: 9, cliente: 'Lucas Martins', total: 2850, data: '2025-05-05' },
  { id: 10, cliente: 'Juliana Alves', total: 2300, data: '2025-05-07' },
  { id: 11, cliente: 'Rafael Teixeira', total: 2600, data: '2025-05-10' },
  { id: 12, cliente: 'Camila Fernandes', total: 3100, data: '2025-05-12' },
  { id: 13, cliente: 'Eduardo Nunes', total: 1700, data: '2025-05-14' },
  { id: 14, cliente: 'Larissa Melo', total: 2900, data: '2025-05-16' },
  { id: 15, cliente: 'Thiago Barbosa', total: 2050, data: '2025-05-18' }
];


  metricas = [
    { valor: 3, titulo: 'Pedidos no Carrinho (7 dias)', bg: 'bg-warning' },
    { valor: 7, titulo: 'Pedidos Finalizados (7 dias)', bg: 'bg-primary' },
    { valor: 'R$ 16.852,00', titulo: 'Vendas no Mês', bg: 'bg-success' },
    { valor: 6, titulo: 'Não Sincronizados', bg: 'bg-danger' },
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

  calcularPaginacaoVendas() {
  const inicio = (this.paginaAtualVendas - 1) * this.itensPorPaginaVendas;
  const fim = inicio + this.itensPorPaginaVendas;
  this.vendasPaginadas = this.vendas.slice(inicio, fim);
  this.totalPaginasVendas = Math.ceil(this.vendas.length / this.itensPorPaginaVendas);
}

paginaAnteriorVendas() {
  if (this.paginaAtualVendas > 1) {
    this.paginaAtualVendas--;
    this.calcularPaginacaoVendas();
  }
}

proximaPaginaVendas() {
  if (this.paginaAtualVendas < this.totalPaginasVendas) {
    this.paginaAtualVendas++;
    this.calcularPaginacaoVendas();
  }
}

irParaPaginaVendas(pagina: number) {
  this.paginaAtualVendas = pagina;
  this.calcularPaginacaoVendas();
}

}
