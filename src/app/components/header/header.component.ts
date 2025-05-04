import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LoginPopoverComponent } from './modal-login/login-popover.component';
import { AuthService } from './modal-login/auth.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginPopoverComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('loginBtn', { static: false }) loginButton!: ElementRef;
  isAdmin: boolean = false;
  mostrarPopover = false;
  popoverPosition = { top: '0px', left: '0px' };
  quantidadeCarrinho: number = 0;
  
  constructor(private authService: AuthService, private router: Router, private cartService: CartService) {}
  private authSubscription: Subscription | null = null;


  ngOnInit() {
    // Inscrever-se para mudanças no estado de admin
    this.authSubscription = this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    this.cartService.cart$.subscribe(items => {
      this.quantidadeCarrinho = items.length;
    });
  }

  ngOnDestroy() {
    // Limpar a assinatura ao destruir o componente
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    
  }
  
  togglePopover() {
    this.mostrarPopover = !this.mostrarPopover;
  
    if (this.mostrarPopover && this.loginButton?.nativeElement?.getBoundingClientRect) {
      const rect = this.loginButton.nativeElement.getBoundingClientRect();
      this.popoverPosition = {
        top: `${rect.bottom + window.scrollY + 10}px`,
        left: `${rect.left + window.scrollX}px`
      };
    }
  }

  IrParaCarrinho() {
    this.router.navigate(['/carrinho']);
  }

  navegarParaDashboard() {
    this.router.navigate(['/dashboard']);
  }
  
}
