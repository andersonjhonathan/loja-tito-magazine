import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; 

export interface Product {
  id: string;
  name: string;
  image_url: string;
  image_urls: any; // Tipo genérico para lidar com a estrutura JSON
  preco_original: number;
  preco_atual: number;
  desconto: number;
  category: string;
  description: string;
  size: string[];
  tamanhos?: string[];
}


@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  get client() {
    return this.supabase;
  }

  getProducts(): Observable<Product[]> {
    return from(this.supabase.from('products').select('*')).pipe(
      map((result: any) => {
        if (result.error) {
          throw result.error; // Se houver erro, lança exceção
        }
        return result.data || []; // Retorna os dados ou um array vazio
      })
    );
  }

  getProductById(id: string): Observable<Product> {
  return from(
    this.supabase
      .from('products')
      .select('id, name, size, image_url, image_urls, preco_original, preco_atual, desconto, category, description')
      .eq('id', id)
      .single()  // Retorna um único produto
  ).pipe(
    map((result: any) => {
      if (result.error) {
        throw result.error;
      }

      const produto = result.data;

      // Verificando se 'size' é um array e, caso contrário, transformando-o
      if (Array.isArray(produto.size)) {
        produto.tamanhos = produto.size; 
      } else if (typeof produto.size === 'string') {
        produto.tamanhos = produto.size.split(','); 
      } else {
        produto.tamanhos = []; 
      }

      delete produto.size; 

      return produto as Product;
    })
  );
}





}
