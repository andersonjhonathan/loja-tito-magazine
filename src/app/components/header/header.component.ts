import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { LoginPopoverComponent } from './modal-login/login-popover.component';
import { AuthService, Usuario } from './modal-login/auth.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

declare var bootstrap: any;

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, LoginPopoverComponent, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('loginBtn') loginButton!: ElementRef;
  @ViewChild('loginBtnMobile') loginButtonMobile!: ElementRef;
  @ViewChild('offcanvasMenu') offcanvasMenu!: ElementRef;
  isAdmin: boolean = false;
  mostrarPopoverDesktop: boolean = false;
  mostrarPopoverMobile: boolean = false;
  popoverPosition: { top: string; left: string } | null = null;
  popoverPositionMobile: { top: string; left: string } | null = null;
  quantidadeCarrinho: number = 0;
  usuarioLogado: Usuario | null = null;
  private navigationSub!: Subscription;
  searchTerm: string = '';

  constructor(private authService: AuthService, private router: Router, private cartService: CartService) { }
  private authSubscription: Subscription | null = null;


  ngOnInit() {
    this.checkScreen();
    // Inscrever-se para mudanças no estado de admin
    this.authSubscription = this.authService.isAdmin$.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });

    this.authService.usuario$.subscribe((usuario) => {
      this.usuarioLogado = usuario;

      if (usuario && usuario.id) {
        this.cartService.loadCart(usuario.id);
      }
    });

    this.cartService.cart$.subscribe(items => {
      this.quantidadeCarrinho = items.length;
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

  ngOnDestroy() {
    // Limpar a assinatura ao destruir o componente
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.navigationSub) {
      this.navigationSub.unsubscribe();
    }

  }

  togglePopover(tipo: 'desktop' | 'mobile') {
    if (tipo === 'desktop') {
      this.mostrarPopoverDesktop = !this.mostrarPopoverDesktop;

      if (this.mostrarPopoverDesktop && this.loginButton?.nativeElement?.getBoundingClientRect) {
        const rect = this.loginButton.nativeElement.getBoundingClientRect();
        this.popoverPosition = {
          top: `${rect.bottom + window.scrollY + 10}px`,
          left: `${rect.left + window.scrollX}px`
        };
      }

      // Garante que o popover mobile esteja fechado
      this.mostrarPopoverMobile = false;

    } else if (tipo === 'mobile') {
      this.mostrarPopoverMobile = !this.mostrarPopoverMobile;

      if (this.mostrarPopoverMobile && this.loginButtonMobile?.nativeElement?.getBoundingClientRect) {
        const rect = this.loginButtonMobile.nativeElement.getBoundingClientRect();
        this.popoverPositionMobile = {
          top: `${rect.bottom + window.scrollY + 10}px`,
          left: `${rect.left + window.scrollX}px`
        };
      }

      // Garante que o popover desktop esteja fechado
      this.mostrarPopoverDesktop = false;
    }
  }

  navegarComFechamento(caminho: string) {
  const offcanvasEl = this.offcanvasMenu.nativeElement;
  const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl) || new bootstrap.Offcanvas(offcanvasEl);

  // Fecha o offcanvas
  offcanvas.hide();

  // Inicia a navegação
  this.router.navigate([caminho]);

  // Aguarda a navegação terminar
  this.navigationSub = this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      setTimeout(() => {
        // Remove qualquer backdrop que tenha sobrado
        document.querySelectorAll('.offcanvas-backdrop.show').forEach(el => el.remove());

        // Corrige estilo do body
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('padding-right');

        // Garante que o Offcanvas esteja limpo
        offcanvas.dispose();

        this.navigationSub.unsubscribe();
      }, 300); // tempo ideal para animação acabar
    }
  });
}


  search() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/produtos'], {
        queryParams: { search: this.searchTerm.trim() },
      });
    }
  }

  IrParaCarrinho() {
    this.router.navigate(['/carrinho']);
  }

  navegarParaDashboard() {
    this.router.navigate(['/dashboard']);
  }

  logout() {
    this.authService.logout();
  }

}
