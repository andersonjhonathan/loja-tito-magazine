import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../header/modal-login/auth.service';

@Component({
  selector: 'app-order-detail',
  imports: [CommonModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  pedidosAgrupados: any[] = [];
  loading = true;

  statusColors: any = {
    pending: 'text-warning',
    paid: 'text-success',
    cancelled: 'text-danger'
  };

  constructor(
    private orderService: OrderService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    try {
      const user = this.authService.getUsuarioLogado();
      if (!user) {
        this.loading = false;
        return;
      }

       const pedidos = await this.orderService.getOrdersByUserId(user.id);

      // 🔹 Agrupar pedidos por "order_id" (já que a view retorna 1 linha por item)
      const map = new Map<number, any>();

      pedidos.forEach((linha: any) => {
        if (!map.has(linha.order_id)) {
          map.set(linha.order_id, {
            id: linha.order_id,
            external_reference: linha.external_reference,
            status: linha.status,
            total: 0,
            payment_method: linha.payment_method,
            created_at: linha.created_at,
            address: {
              street: linha.street,
              number: linha.number,
              city: linha.city,
              state: linha.state,
              cep: linha.cep
            },
            items: []
          });
        }

        const pedido = map.get(linha.order_id);
        pedido.items.push({
          product_id: linha.product_id,
          product_name: linha.product_name, // se a view já retorna
          size: linha.size,
          quantity: linha.quantity,
          price: linha.price
        });
        pedido.total += linha.price * linha.quantity;
      });

      this.pedidosAgrupados = Array.from(map.values());
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      this.loading = false;
    }
  }
}