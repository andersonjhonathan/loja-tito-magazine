import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-feed-feminino',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feed-feminino.component.html',
  styleUrl: './feed-feminino.component.css'
})
export class FeedFemininoComponent {
  camisas = [
    {
      nome: "Camisa Santos Home 24/25 - Umbro Versão Feminina",
      imagem: "assets/camisas-femininas/santos-2025.jpg",
      precoOriginal: 269.00,
      precoAtual: 149.90,
      desconto: 44
    },
    {
      nome: "Camisa Santos Away 24/25 - Umbro Versão Feminina",
      imagem: "assets/camisas-femininas/santos-2025-away.png",
      precoOriginal: 269.00,
      precoAtual: 149.90,
      desconto: 44
    },
    {
      nome: "Camisa Alemanha Away 24/25 - Versão Feminina",
      imagem: "assets/camisas-femininas/alemanha-2025.webp",
      precoOriginal: 269.00,
      precoAtual: 149.90,
      desconto: 44
    },
    {
      nome: "Camisa Flamengo Titular 24/25 - Adidas Feminina",
      imagem: "assets/camisas-femininas/flamengo-2025.jpg",
      precoOriginal: 269.00,
      precoAtual: 149.90,
      desconto: 44
    }
  ];
}
