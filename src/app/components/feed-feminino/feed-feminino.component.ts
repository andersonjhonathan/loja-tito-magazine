// import { CommonModule } from '@angular/common';
// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-feed-feminino',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './feed-feminino.component.html',
//   styleUrl: './feed-feminino.component.css'
// })
// export class FeedFemininoComponent {
//   camisas = [
//     {
//       nome: "Camisa Santos Home 24/25 - Umbro Versão Feminina",
//       imagem: "assets/camisas-femininas/santos-2025.jpg",
//       precoOriginal: 269.00,
//       precoAtual: 149.90,
//       desconto: 44
//     },
//     {
//       nome: "Camisa Santos Away 24/25 - Umbro Versão Feminina",
//       imagem: "assets/camisas-femininas/santos-2025-away.png",
//       precoOriginal: 269.00,
//       precoAtual: 149.90,
//       desconto: 44
//     },
//     {
//       nome: "Camisa Alemanha Away 24/25 - Versão Feminina",
//       imagem: "assets/camisas-femininas/alemanha-2025.webp",
//       precoOriginal: 269.00,
//       precoAtual: 149.90,
//       desconto: 44
//     },
//     {
//       nome: "Camisa Flamengo Titular 24/25 - Adidas Feminina",
//       imagem: "assets/camisas-femininas/flamengo-2025.jpg",
//       precoOriginal: 269.00,
//       precoAtual: 149.90,
//       desconto: 44
//     }
//   ];
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-feed-feminino',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feed-feminino.component.html',
  styleUrls: ['./feed-feminino.component.css'],
})
export class FeedFemininoComponent implements OnInit {
  femininas: Product[] = [];
  carregando = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
  this.productService.getProducts().subscribe({
    next: (produtos) => {
      console.log(produtos)
      this.femininas = produtos
      .filter(c => c.category?.toLowerCase() === 'femininas')
      .slice(0, 4);
      this.carregando = false;
    },
    error: (error) => {
      this.carregando = false;
      console.error('Erro ao carregar camisas:', error);
    }
  });
}
}
