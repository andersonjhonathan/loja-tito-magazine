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
