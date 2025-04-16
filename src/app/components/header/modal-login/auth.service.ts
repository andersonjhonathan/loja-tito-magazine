// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Usamos BehaviorSubject para garantir que o estado inicial esteja disponível
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor() {}

  // Método para logar o usuário e definir o estado de admin
  login(email: string, senha: string): boolean {
    const emailAdmin = 'admin@teste.com';
    const senhaAdmin = 'admin123';
    const emailMock = 'teste@teste.com';
    const senhaMock = '123456';

    if (email === emailMock && senha === senhaMock) {
      this.isAdminSubject.next(false);
      return true;
    } else if (email === emailAdmin && senha === senhaAdmin) {
      this.isAdminSubject.next(true);
      return true;
    } else {
      this.isAdminSubject.next(false);
      return false;
    }
  }
}
