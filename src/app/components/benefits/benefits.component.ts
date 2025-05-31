import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-benefits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './benefits.component.html',
  styleUrl: './benefits.component.css'
})
export class BenefitsComponent {
  beneficios = [
    {
      titulo: 'Compra Segura',
      descricao: 'Ambiente seguro para pagamentos online',
      imagem: 'assets/icons/compra-segura.png',
    },
    {
      titulo: 'Frete Grátis',
      descricao: 'Envio rápido com código de rastreio',
      imagem: 'assets/icons/entrega.png',
    },
    {
      titulo: 'Suporte Profissional',
      descricao: 'Equipe de suporte todos os dias',
      imagem: 'assets/icons/atendimento.png',
    },
    {
      titulo: 'Satisfação ou Reembolso',
      descricao: 'Devolvemos seu dinheiro rapidamente',
      imagem: 'assets/icons/reembolso.png',
    },
  ];
}
