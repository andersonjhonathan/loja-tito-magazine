// // auth.service.ts
// import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   // Usamos BehaviorSubject para garantir que o estado inicial esteja disponível
//   private isAdminSubject = new BehaviorSubject<boolean>(false);
//   isAdmin$ = this.isAdminSubject.asObservable();

//   constructor() {}

//   // Método para logar o usuário e definir o estado de admin
//   login(email: string, senha: string): boolean {
//     const emailAdmin = 'admin@teste.com';
//     const senhaAdmin = 'admin123';
//     const emailMock = 'teste@teste.com';
//     const senhaMock = '123456';

//     if (email === emailMock && senha === senhaMock) {
//       this.isAdminSubject.next(false);
//       return true;
//     } else if (email === emailAdmin && senha === senhaAdmin) {
//       this.isAdminSubject.next(true);
//       return true;
//     } else {
//       this.isAdminSubject.next(false);
//       return false;
//     }
//   }
// }

// auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { supabase } from '../../../services/supabase.client';

export interface Usuario {
  id: string;
  name: string;
  email: string;
  role: string;
}

const USUARIO_STORAGE_KEY = 'usuario_logado';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor() {
    this.restaurarUsuarioLogado(); // Restaurar usuário no início
  }

  async login(email: string, senha: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role')
      .eq('email', email)
      .eq('password', senha) // Em produção: usar senha hasheada
      .single();

    if (error || !data) {
      return false;
    }

    const usuario: Usuario = data;

    this.usuarioSubject.next(usuario);
    this.isAdminSubject.next(usuario.role === 'admin');
    localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuario));

    return true;
  }

  logout() {
    this.usuarioSubject.next(null);
    this.isAdminSubject.next(false);
    localStorage.removeItem(USUARIO_STORAGE_KEY);
  }

  getUsuarioLogado(): any {
  const usuario = localStorage.getItem('usuario_logado');
  return usuario ? JSON.parse(usuario) : null;
}

  getUsuarioAtual(): Usuario | null {
    return this.usuarioSubject.getValue();
  }

  private restaurarUsuarioLogado() {
    const usuarioSalvo = localStorage.getItem(USUARIO_STORAGE_KEY);
    if (usuarioSalvo) {
      try {
        const usuario: Usuario = JSON.parse(usuarioSalvo);
        this.usuarioSubject.next(usuario);
        this.isAdminSubject.next(usuario.role === 'admin');
      } catch (e) {
        localStorage.removeItem(USUARIO_STORAGE_KEY); // Se inválido, remove
      }
    }
  }

  async cadastrar(nome: string, email: string, senha: string): Promise<string | null> {
    const { error } = await supabase.from('users').insert({
      name: nome,
      email,
      password: senha, // Em produção: usar bcrypt
      role: 'user',
    });

    return error ? error.message : null;
  }

  async recuperarSenha(email: string): Promise<string | null> {
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    return error || !data ? 'E-mail não encontrado.' : null;
  }
}

