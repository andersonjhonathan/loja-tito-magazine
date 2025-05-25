import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../header/modal-login/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  parcelasDisponiveis: { parcelas: number; valorParcela: number }[] = [];
  mensagemErroCep = '';
  exibirEntrega = false;
  cartItems: any[] = [];
  userId: string | null = null;
  cep = '';
  valorEntrega: number = 0.00;
  freteNormal = 15.00;
  private cartSubscription: Subscription | undefined;

  endereco: {
    rua: string;
    bairro: string;
    cidade: string;
    estado: string;
    numero: string;
    complemento: string;
  } = {
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
      numero: '',
      complemento: ''
    };

  frete = {
    valor: 0,
    tipo: 'Frete Grátis'
  };

  cliente = {
    email: '',
    nome: '',
    celular: '',
    cpf: ''
  };

  pagamento = {
    numeroCartao: '',
    nomeCartao: '',
    validadeCartao: '',
    cvvCartao: '',
    parcelasCartao: null,
    salvarInfo: false
  };

  constructor(
    private http: HttpClient,
    private cartService: CartService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    const usuario = this.authService.getUsuarioLogado();
    this.userId = usuario ? usuario.id : null;

    if (this.userId) {
      // Assina o BehaviorSubject para ouvir mudanças do carrinho em tempo real
      this.cartSubscription = this.cartService.cart$.subscribe(items => {
        this.cartItems = items;
        this.calcularParcelas();
      });

      // Carrega o carrinho inicial
      this.cartService.loadCart(this.userId);
    }
  }

  ngOnDestroy() {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }


  buscarEnderecoPorCep() {
    const cepLimpo = this.cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      this.exibirEntrega = false;
      this.mensagemErroCep = 'CEP inválido.';
      this.resetarEndereco();
      return;
    }

    this.http.get(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe({
      next: (data: any) => {
        if (data.erro) {
          this.exibirEntrega = false;
          this.mensagemErroCep = 'CEP não encontrado.';
          this.resetarEndereco();
          return;
        }

        this.endereco.rua = data.logradouro || '';
        this.endereco.bairro = data.bairro || '';
        this.endereco.cidade = data.localidade || '';
        this.endereco.estado = data.uf || '';
        this.mensagemErroCep = '';
        this.exibirEntrega = true;
      },
      error: () => {
        this.exibirEntrega = false;
        this.mensagemErroCep = 'Erro ao buscar CEP. Tente novamente.';
        this.resetarEndereco();
      }
    });
  }

  resetarEndereco() {
    this.endereco = {
      rua: '',
      bairro: '',
      cidade: '',
      estado: '',
      numero: '',
      complemento: ''
    };
  }

  finalizarCompra(form: any) {
    if (form.invalid) {
      Object.values(form.controls).forEach((control: any) => {
        control.markAsTouched();
      });
      return;
    }

    console.log('Dados do cliente:', this.cliente);
    console.log('Endereço:', this.endereco);
    console.log('Pagamento:', this.pagamento);

    alert('Compra finalizada com sucesso!');

    form.resetForm();
    this.resetarEndereco();
    this.exibirEntrega = false;
    this.cep = '';
    this.mensagemErroCep = '';
  }

  async loadCart() {
    if (!this.userId) return;
    await this.cartService.loadCart(this.userId);
    this.cartService.cart$.subscribe(items => {
      this.cartItems = items;
    });

  }

  atualizarFrete(tipo: string) {
    if (tipo === 'normal') {
      this.valorEntrega = this.freteNormal;  // Frete normal
    } else if (tipo === 'gratis') {
      this.valorEntrega = 0.00;  // Frete grátis
    }
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => {
      const preco = Number(String(item.preco_final).replace(',', '.')) || 0;
      const qtd = Number(item.quantity) || 0;
      return total + (preco * qtd);
    }, 0);
  }

  getTotal(): number {
    return this.getSubtotal() + this.valorEntrega;
  }

  calcularParcelas() {
    const total = this.getTotal();
    this.parcelasDisponiveis = [];

    for (let i = 1; i <= 6; i++) {
      this.parcelasDisponiveis.push({
        parcelas: i,
        valorParcela: total / i
      });
    }
  }

}
