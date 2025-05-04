import { Component } from '@angular/core';
import { GraficoVendasComponent } from "../grafico-vendas/grafico-vendas.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-visao-geral',
  standalone: true,
  imports: [CommonModule, GraficoVendasComponent, FormsModule],
  templateUrl: './dashboard-visao-geral.component.html',
  styleUrl: './dashboard-visao-geral.component.css'
})
export class DashboardVisaoGeralComponent {
  produtos: any[] = [];

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
  
  // Exemplo de produtos
  // produtos = [
  //   { id: 1, nome: 'Camiseta', preco: 50.00, estoque: 100 },
  //   { id: 2, nome: 'Boné', preco: 30.00, estoque: 200 },
  //   { id: 3, nome: 'Jaqueta', preco: 150.00, estoque: 50 },
  // ];
  
  // Funções para adicionar, alterar, e remover produtos
  adicionarProduto() {
    // Gera um ID simples com base no timestamp (você pode mudar isso depois)
    this.produto.id = Date.now();
  
    // Calcula o desconto se ainda não foi preenchido
    if (!this.produto.desconto && this.produto.precoOriginal > 0 && this.produto.precoAtual > 0) {
      const descontoCalculado = 100 - (this.produto.precoAtual / this.produto.precoOriginal) * 100;
      this.produto.desconto = Math.round(descontoCalculado);
    }
  
    this.produtos.push({ ...this.produto });
  
    // Limpa o formulário
    this.produto = {
      id: 0,
      nome: '',
      imagem: '',
      precoOriginal: 0,
      precoAtual: 0,
      desconto: 0
    };
  }
  
  alterarProduto(produto: any) {
    console.log('Produto alterado', produto);
  }
  
  removerProduto(produtoId: number) {
    console.log('Produto removido', produtoId);
  }
}
