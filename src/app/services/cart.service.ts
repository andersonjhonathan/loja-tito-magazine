// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   private storageKey = 'carrinho_produtos';
//   private items: any[] = [];

//   private cartSubject = new BehaviorSubject<any[]>([]);
//   cart$ = this.cartSubject.asObservable();

//   constructor() {
//     this.carregarCarrinho();
//   }

//   private isBrowser: boolean = typeof window !== 'undefined' && typeof localStorage !== 'undefined';

//   private salvarCarrinho() {
//     if (this.isBrowser) {
//       localStorage.setItem(this.storageKey, JSON.stringify(this.items));
//       this.cartSubject.next(this.items);
//     }
//   }

//   private carregarCarrinho() {
//     if (this.isBrowser) {
//       const dadosSalvos = localStorage.getItem(this.storageKey);
//       if (dadosSalvos) {
//         this.items = JSON.parse(dadosSalvos);
//         this.cartSubject.next(this.items);
//       }
//     }
//   }

//   addToCart(product: any) {
//     this.items.push(product);
//     this.salvarCarrinho();
//   }

//   getItems() {
//     return [...this.items];
//   }

//   clearCart() {
//     this.items = [];
//     this.salvarCarrinho();
//   }

//   removeItem(index: number) {
//     this.items.splice(index, 1);
//     this.salvarCarrinho();
//   }
// }

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

  // async addToCart(userId: string, productId: string, size: string, quantity: number) {
  //   const { data, error } = await this.productService.client
  //     .from('cart_items')
  //     .insert([{ user_id: userId, product_id: productId, size, quantity }]);

  //   if (error) {
  //     console.error('Erro ao adicionar ao carrinho:', error);
  //   }
  //   await this.loadCart(userId);
  //   return data;
  // }

  async addToCart(userId: string, productId: string, size: string, quantity: number) {
  // Tenta buscar o item existente no carrinho com base em user_id, product_id e size
  const { data: existingItems, error: selectError } = await this.productService.client
    .from('cart_items')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .eq('size', size);

  if (selectError) {
    console.error('Erro ao verificar item no carrinho:', selectError);
    return;
  }

  if (existingItems && existingItems.length > 0) {
    // Atualiza a quantidade se já existir
    const { error: updateError } = await this.productService.client
      .from('cart_items')
      .update({ quantity })
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size);

    if (updateError) {
      console.error('Erro ao atualizar item no carrinho:', updateError);
    }
  } else {
    // Insere novo item se ainda não existir
    const { error: insertError } = await this.productService.client
      .from('cart_items')
      .insert([{ user_id: userId, product_id: productId, size, quantity }]);

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
