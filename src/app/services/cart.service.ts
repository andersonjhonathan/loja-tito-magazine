// cart.service.ts
import { Injectable } from '@angular/core';
import { ProductService } from '../services/product.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartItemsSubject.asObservable();

  constructor(private productService: ProductService) { }

  async loadCart(userId: string) {
    const items = await this.getCartItems(userId);
    this.cartItemsSubject.next(items || []);
  }

  async addToCart(
    userId: string, 
    productId: string, 
    size: string, 
    quantity: number,
    personalizar?: boolean,
    preco_final?: number
  ) {
  // Tenta buscar o item existente no carrinho com base em user_id, product_id e size
  const { data: existingItems, error: selectError } = await this.productService.client
    .from('cart_items')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('size', size)
    .eq('personalizar', personalizar ?? false);

  if (selectError) {
    console.error('Erro ao verificar item no carrinho:', selectError);
    return;
  }

  if (existingItems && existingItems.length > 0) {
    // Atualiza a quantidade se já existir
    const { error: updateError } = await this.productService.client
      .from('cart_items')
      .update({ quantity, personalizar, preco_final })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('personalizar', personalizar ?? false);

    if (updateError) {
      console.error('Erro ao atualizar item no carrinho:', updateError);
    }
  } else {
    // Insere novo item se ainda não existir
    const { error: insertError } = await this.productService.client
      .from('cart_items')
      .insert([{ 
        user_id: userId, 
        product_id: productId, 
        size, 
        quantity, 
        personalizar: personalizar ?? false, 
        preco_final 
      }]);

    if (insertError) {
      console.error('Erro ao adicionar item no carrinho:', insertError);
    }
  }

  // Atualiza o estado do carrinho no front-end
  await this.loadCart(userId);
}



  async getCartItems(userId: string) {
    const { data, error } = await this.productService.client
      .from('cart_items')
      .select(`
        id,
        product_id,
        size,
        quantity,
        preco_final,
        personalizar,
        products (
          name,
          image_url,
          preco_original,
          preco_atual
        )
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao buscar carrinho:', error);
    }
    return data;
  }

  async removeItem(id: string) {
    const { error } = await this.productService.client
      .from('cart_items')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao remover item do carrinho:', error);
    }
  }

  async clearCart(userId: string) {
    const { error } = await this.productService.client
      .from('cart_items')
      .delete()
      .eq('user_id', userId);

    if (error) {
      console.error('Erro ao limpar carrinho:', error);
    }
  }

  async getProductById(productId: string) {
    const { data, error } = await this.productService.client
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) throw error;
    return data;
  }

}
