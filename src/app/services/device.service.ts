import { Injectable, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private mobileSubject = new BehaviorSubject<boolean>(this.checkIsMobile());
  isMobile$ = this.mobileSubject.asObservable();

  constructor() {
    window.addEventListener('resize', () => {
      this.mobileSubject.next(this.checkIsMobile());
    });
  }

  private checkIsMobile(): boolean {
    return window.innerWidth <= 768;
  }

  // Para acesso direto
  isMobile(): boolean {
    return this.mobileSubject.value;
  }
}
