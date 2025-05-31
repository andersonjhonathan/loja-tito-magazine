import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-feed-masculino',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feed-masculino.component.html',
  styleUrls: ['./feed-masculino.component.css'],
})
export class FeedMasculinoComponent implements OnInit {
  masculinas: Product[] = [];
  carregando = true;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.checkScreen();
    this.productService.getProducts().subscribe({
      next: (produtos) => {
        console.log(produtos)
        this.masculinas = produtos
          .filter(c => c.category?.toLowerCase() === 'masculinas')
          .slice(0, 4);
        this.carregando = false;
      },
      error: (error) => {
        this.carregando = false;
        console.error('Erro ao carregar camisas:', error);
      }
    });
  }

  isMobile: boolean = false;

  @HostListener('window:resize')
  onResize() {
    this.checkScreen();
  }

  private checkScreen() {
    this.isMobile = window.innerWidth <= 768;
  }
}







