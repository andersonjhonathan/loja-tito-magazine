import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-feed-masculino',
  imports: [CommonModule, RouterModule],
  templateUrl: './feed-masculino.component.html',
  styleUrl: './feed-masculino.component.css'
})
export class FeedMasculinoComponent {
  camisas = [
    {
      id: 1,
      nome: "Camisa Flamengo Titular 25/26 - Versão Torcedor Lançamento",
      imagem: "assets/camisas-masculinas/flamengo-2025.png",
      precoOriginal: 269.00,
      precoAtual: 149.90,
      desconto: 44
    },
    {
      id: 2,
      nome: "Camisa Santos FC Home 24/25 + #10 Neymar Jr - Umbro Torcedor",
      imagem: "assets/camisas-masculinas/santos-2025.jpg",
      precoOriginal: 269.00,
      precoAtual: 179.90,
      desconto: 33
    },
    {
      id: 3,
      nome: "Camisa Cruzeiro 25/26 Treino Clara - Adidas Versão Torcedor",
      imagem: "assets/camisas-masculinas/cruzeiro-2025.jpg",
      precoOriginal: 269.00,
      precoAtual: 149.90,
      desconto: 44
    },
    {
      id: 4,
      nome: "Camisa Inter Miami II 25/26 - Adidas Torcedor Masculina Lançamento",
      imagem: "assets/camisas-masculinas/inter-miami-2025.jpg",
      precoOriginal: 269.00,
      precoAtual: 149.90,
      desconto: 44
    }  
  ];
  
}
