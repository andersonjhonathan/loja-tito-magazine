import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'https://fgauwbsvkeiogsloqnod.supabase.co/functions/v1/mercado_pago';

  constructor(private http: HttpClient) { }

  createPreference(orderData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${environment.supabaseKey}`
    });

    return this.http.post<any>(this.apiUrl, orderData, { headers });
  }
}