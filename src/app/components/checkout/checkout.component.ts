import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../header/modal-login/auth.service';
import { Subscription } from 'rxjs';
import { OrderService } from '../../services/order.service';


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
    private orderService: OrderService
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
    // Validação básica dos dados do cliente e endereço
    const clienteValido = this.cliente.email && this.cliente.nome && this.cliente.celular && this.cliente.cpf;
    const enderecoValido = this.cep && this.endereco.numero;

    if (!clienteValido || !enderecoValido) {
      return false;
    }

    if (this.metodoPagamentoSelecionado === 'cartao') {
      // Para cartão, valida campos obrigatórios do cartão e o form geral
      return form.valid &&
        this.pagamento.numeroCartao.trim() !== '' &&
        this.pagamento.nomeCartao.trim() !== '' &&
        this.pagamento.validadeCartao.trim() !== '' &&
        this.pagamento.cvvCartao.trim() !== '' &&
        this.pagamento.parcelasCartao !== null;
    } else {
      // Para pix e boleto, não precisa dos dados do cartão, só valida o form principal menos os campos de cartão
      return form.form.controls['email']?.valid &&
        form.form.controls['nome']?.valid &&
        form.form.controls['celular']?.valid &&
        form.form.controls['cpf']?.valid &&
        form.form.controls['cep']?.valid &&
        form.form.controls['numero']?.valid;
    }
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
      Object.values(form.controls).forEach(control => {
        (control as AbstractControl).markAsTouched();
      });
      return;
    }
    this.isFinalizando = true;

    try {
      // 1. Criar pedido sem endereço e itens
      const orderPayload = {
        user_id: this.userId!,
        total: this.getTotal(),
        status: 'pendente',
        payment_method: this.metodoPagamentoSelecionado
      };
      const createdOrder = await this.orderService.createOrder(orderPayload);
      const orderId = createdOrder.id;

      // 2. Criar endereço com order_id
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

      // 3. Criar itens do pedido
      const itemsPayload = this.cartItems.map(item => ({
        order_id: orderId,
        product_id: item.product_id || item.products?.id,  // ajuste conforme
        size: item.size,
        quantity: item.quantity,
        price: item.preco_final
      }));
      await this.orderService.createOrderItems(itemsPayload);

      const usuario = JSON.parse(localStorage.getItem('usuario_logado') || '{}');
      const userId = usuario?.id;

      await this.orderService.updateUserInfo(userId, this.cliente.cpf, this.cliente.celular);

      const usuarioStr = localStorage.getItem('usuario_logado');
      if (usuarioStr) {
        const usuario = JSON.parse(usuarioStr);
        await this.cartService.clearCart(usuario.id);
        this.cartItems = []
      }

      alert('Compra finalizada com sucesso!');
      form.resetForm();
      this.resetarEndereco();
      this.exibirEntrega = false;
      this.cep = '';
      this.mensagemErroCep = '';
      this.pagamento = {
        numeroCartao: '',
        nomeCartao: '',
        validadeCartao: '',
        cvvCartao: '',
        parcelasCartao: null,
        salvarInfo: false
      };

    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert('Ocorreu um erro ao finalizar a compra. Tente novamente.');
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
