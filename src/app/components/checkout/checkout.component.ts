import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../header/modal-login/auth.service';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { PaymentService } from '../../services/payment.service';

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
  isFinalizando: boolean = false;
  valorEntrega: number = 0.00;
  freteNormal = 15.00;
  private cartSubscription: Subscription | undefined;
  metodoPagamentoSelecionado: 'cartao' | 'pix' | 'boleto' = 'cartao';
  loadingPagamento = false;

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
    private authService: AuthService,
    private orderService: OrderService,
    private paymentService: PaymentService
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

  isFormularioValido(form: any): boolean {
    if (!form) return false;

    return form.form.controls['email']?.valid &&
      form.form.controls['nome']?.valid &&
      form.form.controls['celular']?.valid &&
      form.form.controls['cpf']?.valid &&
      form.form.controls['cep']?.valid &&
      form.form.controls['numero']?.valid;
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

async finalizarCompra(form: any) {
  if (form.invalid || !this.isFormularioValido(form)) {
    Object.values(form.controls).forEach(control => (control as AbstractControl).markAsTouched());
    return;
  }

  this.loadingPagamento = true;
  this.isFinalizando = true;

  try {
    // 1️⃣ Criar pedido
    const orderPayload = {
      user_id: this.userId!,
      total: this.getTotal(),
      status: 'pendente',
      payment_method: this.metodoPagamentoSelecionado
    };
    const createdOrder = await this.orderService.createOrder(orderPayload);
    const orderId = createdOrder.id;

    // 2️⃣ Criar endereço
    const addressPayload = {
      order_id: orderId,
      cep: this.cep,
      street: this.endereco.rua,
      number: this.endereco.numero,
      complement: this.endereco.complemento,
      neighborhood: this.endereco.bairro,
      city: this.endereco.cidade,
      state: this.endereco.estado
    };
    await this.orderService.createAddress(addressPayload);

    // 3️⃣ Criar itens do pedido
    const itemsPayload = this.cartItems
      .filter(item => (item.product_id || item.products?.id) && item.quantity && item.preco_final)
      .map(item => ({
        order_id: orderId,
        product_id: item.product_id || item.products!.id,
        size: item.size || 'Único',
        quantity: item.quantity,
        price: item.preco_final
      }));
    await this.orderService.createOrderItems(itemsPayload);
    console.log('ItemsPayload final:', itemsPayload);

    // 4️⃣ Criar preferência Mercado Pago
    const mpItems = this.cartItems.map(item => ({
      title: item.products?.name || "Produto",
      quantity: item.quantity,
      unit_price: item.preco_final,
      product_id: item.product_id || item.products!.id,
      size: item.size || "Único"
    }));

    const mpPayload = {
      order_id: orderId, // ✅ Aqui usamos order_id e não user_id
      items: mpItems,
      back_urls: {
        success: "https://titomagazine.com.br/success",
        pending: "https://titomagazine.com.br/pending",
        failure: "https://titomagazine.com.br/failure"
      },
      auto_return: "approved",
      notification_url: "https://fgauwbsvkeiogsloqnod.supabase.co/functions/v1/mercado_pago/webhook",
      statement_descriptor: "Tito Magazine"
    };

    const mpResponse = await this.orderService.createMPPreference(mpPayload);

    if (mpResponse.init_point) {
      window.location.href = mpResponse.init_point;
    } else {
      alert("Erro ao gerar o checkout. Tente novamente.");
      this.loadingPagamento = false;
    }

    // ⚠️ Não limpar carrinho ou resetar formulário aqui
    // Isso será feito apenas após confirmação do pagamento via webhook

  } catch (error) {
    console.error("Erro ao finalizar compra:", error);
    alert("Ocorreu um erro ao finalizar a compra. Tente novamente.");
  } finally {
    this.isFinalizando = false;
  }
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
