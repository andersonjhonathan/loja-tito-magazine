import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';  // Importação correta para o gráfico

@Component({
  selector: 'app-grafico-vendas',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],  // Usando a diretiva baseChart
  templateUrl: './grafico-vendas.component.html',
})
export class GraficoVendasComponent {
  public barChartLabels: string[] = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  // Gerando dados aleatórios para cada mês
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.barChartLabels,
    datasets: [
      { 
        data: this.gerarDadosAleatorios(), // Gerando os dados aleatórios
        label: 'Vendas (R$)',
      }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
    scales: {
      x: {},
      y: { beginAtZero: true }
    }
  };

  // Função para gerar dados aleatórios de vendas
  gerarDadosAleatorios(): number[] {
    const dadosAleatorios = [];
    for (let i = 0; i < 12; i++) {
      // Gera um número aleatório entre 1000 e 5000 para simular as vendas mensais
      dadosAleatorios.push(Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000);
    }
    return dadosAleatorios;
  }
}
