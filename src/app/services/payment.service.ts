import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://fgauwbsvkeiogsloqnod.supabase.co/functions/v1/mercado_pago';

  constructor(private http: HttpClient) {}

  createPreference(orderData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, orderData);
  }
}