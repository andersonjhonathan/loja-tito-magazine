// order.service.ts
import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private supabase: SupabaseClient;

  constructor() {
      this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    }

  async createOrder(order: {
    user_id: string;
    total: number;
    status: string;
    payment_method: string;
  }) {
    const { data, error } = await this.supabase
      .from('orders')
      .insert([order])
      .select()  // para retornar o registro criado
      .single();

    if (error) {
      console.error('[OrderService] Erro ao criar pedido:', error.message);
      throw error;
    }

    return data;
  }

  async createAddress(address: {
    order_id: number;
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  }) {
    const { data, error } = await this.supabase
      .from('addresses')
      .insert([address]);

    if (error) {
      console.error('[OrderService] Erro ao criar endereço:', error.message);
      throw error;
    }

    return data;
  }

  async createOrderItems(items: Array<{
    order_id: number;
    product_id: number | string;
    size: string;
    quantity: number;
    price: number;
  }>) {
    const { data, error } = await this.supabase
      .from('order_items')
      .insert(items);

    if (error) {
      console.error('[OrderService] Erro ao criar itens do pedido:', error.message);
      throw error;
    }

    return data;
  }

  async updateUserInfo(userId: string, cpf: string, phone: string) {
  const { data, error } = await this.supabase
    .from('users')
    .update({ cpf, phone })
    .eq('id', userId);

  if (error) {
    console.error('[OrderService] Erro ao atualizar usuário:', error.message);
    throw error;
  }

  return data;
}

async buscarVendasAgrupadas(): Promise<any[]> {
  const { data, error } = await this.supabase
    .from('vendas_agrupadas_por_cliente') // nome da view
    .select('*');

  if (error) {
    console.error('Erro ao buscar vendas agrupadas:', error);
    return [];
  }

  return data || [];
}

async getOrdersByUserId(userId: string) {
  const { data, error } = await this.supabase
    .from('order_items_view')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[OrderService] Erro ao buscar pedidos (view):', error.message);
    throw error;
  }

  return data;
}

async createMPPreference(payload: {
  user_id: string;
  items: { title: string; quantity: number; unit_price: number }[];
}): Promise<any> {
  try {
    const response = await fetch(`${environment.supabaseUrl}/functions/v1/mercado_pago`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.supabaseKey}` // usar Service Role Key
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('[OrderService] Erro ao criar preferência Mercado Pago:', text);
      throw new Error('Erro ao criar preferência Mercado Pago');
    }

    const data = await response.json();
    return data; // retorna { order_id, init_point, total, etc. }
  } catch (error: any) {
    console.error('[OrderService] createMPPreference erro:', error.message);
    throw error;
  }
}


}