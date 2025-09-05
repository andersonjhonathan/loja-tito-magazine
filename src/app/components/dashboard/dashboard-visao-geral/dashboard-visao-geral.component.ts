import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddProductComponent } from '../modal-add-product/add-product.component';
import { ProductService, Product } from '../../../services/product.service';
import { DeviceService } from '../../../services/device.service';
import { Venda, Vendas } from './model/dashboard-vendas.response'
import { ToastService } from '../../../services/toast.service';
import { ConfirmDialogComponent } from './modal-remov-product/confirm-dialog.component';
import { OrderService } from '../../../services/order.service';

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
    private deviceService: DeviceService,
    private toastService: ToastService,
    private orderService: OrderService
  ) { }

  produtos: Product[] = [];
  produtosPorPagina: Product[] = [];
  paginaAtual: number = 1;
  itensPorPagina: number = 10;
  totalPaginas: number = 0;
  isMobile: boolean = false;
  vendasPaginadas: Venda[] = [];
  selectedOrderDetails: any[] = [];
  vendasAgrupadas: Venda[] = [];
  produtosVendaSelecionada: any[] = [];
  selectedSale: Venda | null = null;
  salesList: Vendas[] = [];
  selectedSaleList: Vendas[] = [];
  paginaAtualVendas: number = 1;
  itensPorPaginaVendas: number = 10;
  totalPaginasVendas: number = 0;

  ngOnInit(): void {
    this.carregarProdutos();
    this.calcularPaginacaoVendas();
    this.carregarVendasAgrupadas();
    this.atualizarMetricas()
    this.isMobile = this.deviceService.isMobile();
    this.deviceService.isMobile$.subscribe(value => {
      this.isMobile = value;
    });
    this.productService.getAllSoldProducts().subscribe({
  next: (data) => {
    this.salesList = data;
    this.atualizarMetricas(); // chama só depois de ter os dados
    this.atualizarGraficoVendas();
  },
  error: (err) => console.error('Erro ao carregar vendas:', err)
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

 vendas: Venda[] = [];


  metricas = [
  { valor: 0, titulo: 'Pedidos no Carrinho (7 dias)', bg: 'bg-warning' },
  { valor: 0, titulo: 'Pedidos Finalizados (7 dias)', bg: 'bg-primary' },
  { valor: 'R$ 0,00', titulo: 'Vendas no Mês', bg: 'bg-success' },
  { valor: 0, titulo: 'Não Sincronizados', bg: 'bg-danger' },
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

  alterarProduto(produto: Product) {
  const modalRef = this.modalService.open(AddProductComponent, { size: 'lg' });
  modalRef.componentInstance.produto = { ...produto };

  modalRef.result.then((produtoAtualizado: Product) => {
    if (produtoAtualizado) {
      this.productService.updateProduct(produtoAtualizado.id, produtoAtualizado).subscribe({
        next: (res) => {
          console.log('Produto atualizado com sucesso', res);
          const index = this.produtos.findIndex(p => p.id === produtoAtualizado.id);
          if (index !== -1) {
            this.produtos[index] = produtoAtualizado;
            this.atualizarProdutosPorPagina();
          }
        },
        error: (err) => {
          console.error('Erro ao atualizar produto', err);
        }
      });
    }
  }).catch(() => {

  });
}

removerProduto(produtoId: string) {
  const modalRef = this.modalService.open(ConfirmDialogComponent);
  modalRef.componentInstance.message = 'Tem certeza que deseja remover este produto?';

  modalRef.result.then(
    (result) => {
      if (result === true) {
        this.productService.deleteProduct(produtoId).subscribe({
          next: () => {
            this.produtos = this.produtos.filter(p => p.id !== produtoId);
            this.totalPaginas = Math.ceil(this.produtos.length / this.itensPorPagina);
            if (this.paginaAtual > this.totalPaginas) {
              this.paginaAtual = this.totalPaginas || 1;
            }
            this.atualizarProdutosPorPagina();

            this.toastService.success('Produto removido com sucesso!');
          },
          error: (err) => {
            console.error('Erro ao remover produto', err);
            this.toastService.error('Erro ao remover produto!');
          }
        });
      }
    },
    () => {

    }
  );
}

  abrirAdicionarProduto() {
    this.modalService.open(AddProductComponent, { size: 'lg' });
  }

  // excluirUsuario() {
  // }

  // listarVendidos() {
  //   this.modalService.open(ProductsSoldComponent)
  // }

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
  const inicio = (pagina - 1) * this.itensPorPaginaVendas;
  const fim = inicio + this.itensPorPaginaVendas;
  this.vendasPaginadas = this.vendasAgrupadas.slice(inicio, fim);
}

carregarVendasAgrupadas() {
  this.orderService.buscarVendasAgrupadas().then(vendas => {
    this.vendasAgrupadas = vendas;
    this.totalPaginasVendas = Math.ceil(vendas.length / this.itensPorPaginaVendas);
    this.irParaPaginaVendas(1); // exibir primeira página
  });
}

openModal(sale: Venda): void {
  // filtra todos os itens vendidos para o mesmo cpf (cliente)
  this.selectedSaleList = this.salesList.filter(item => item.user_cpf === sale.cpf);

  // guarda dados gerais da venda selecionada
  this.selectedSale = sale;

  // abrir modal bootstrap
  const modal = document.getElementById('saleDetailModal');
  if (modal) {
    const bootstrapModal = new (window as any).bootstrap.Modal(modal);
    bootstrapModal.show();
  }
}

atualizarMetricas() {
  // Pedidos no Carrinho: status 'pendente'
  const pedidosNoCarrinho = this.salesList.filter(v => v.status === 'pendente');

  // Pedidos Finalizados: status 'pago'
  const pedidosFinalizados = this.salesList.filter(v => v.status === 'pago');

  // Vendas no Mês: todos com status 'pago' (sem considerar data)
  const vendas = this.salesList.filter(v => v.status === 'pago');

  // Soma total das vendas
  const totalVendas = vendas.reduce((acc, v) => acc + ((v.price ?? 0) * (v.quantity ?? 1)), 0);

  // Atualiza as métricas
  this.metricas = [
    { valor: pedidosNoCarrinho.length, titulo: 'Pedidos no Carrinho', bg: 'bg-warning' },
    { valor: pedidosFinalizados.length, titulo: 'Pedidos Finalizados', bg: 'bg-primary' },
    { valor: `R$ ${totalVendas.toFixed(2).replace('.', ',')}`, titulo: 'Vendas Totais', bg: 'bg-success' },
    { valor: 0, titulo: 'Não Sincronizados', bg: 'bg-danger' }, // ajuste se tiver a lógica
  ];
}


atualizarGraficoVendas() {
  if (!this.salesList || this.salesList.length === 0) return;

  const meses = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const vendasPorMes = new Array(12).fill(0);

  this.salesList.forEach(venda => {
    if (venda.status === 'pago' && venda.created_at) {
      const data = new Date(venda.created_at);
      const mes = data.getMonth(); // 0 a 11
      vendasPorMes[mes] += venda.quantity ?? 0; // soma apenas quantidade
    }
  });

  this.chartOptions = {
    chart: { type: 'bar' },
    title: { text: 'Vendas por Mês' },
    xAxis: { categories: meses },
    series: [{ name: 'Itens Vendidos', data: vendasPorMes, type: 'bar' }]
  };
}





}
