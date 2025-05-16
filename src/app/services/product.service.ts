import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { from, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Product {
  id: string;
  name: string;
  image_url: string;
  preco_original: number;
  preco_atual: number;
  desconto: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
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
}
