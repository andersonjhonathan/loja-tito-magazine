import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsletterService {
  private apiUrl = 'https://fgauwbsvkeiogsloqnod.supabase.co/functions/v1/newsletter';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYXV3YnN2a2Vpb2dzbG9xbm9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTQ1NDMsImV4cCI6MjA2Mjk3MDU0M30.elX5Ot0xEXfal4lZYdSgQZlCGrpPPS9FB-WonBZAgPQ' // substitua pela sua anon key
  });

  constructor(private http: HttpClient) {}

  inscrever(email: string): Observable<any> {
    return this.http.post(this.apiUrl, { email }, { headers: this.headers });
  }
}
