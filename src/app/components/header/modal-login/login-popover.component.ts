import { Component, ElementRef, EventEmitter, Input, Output, HostListener  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { AuthService, Usuario  } from './auth.service';
import { Router } from '@angular/router';
import { supabase } from '../../../services/supabase.client';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-login-popover',
  standalone: true,
  imports: [CommonModule, FormsModule],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [style({ opacity: 0 }), animate('200ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './login-popover.component.html',
  styleUrls: ['./login-popover.component.css'],
})
export class LoginPopoverComponent {

  email: string = '';
  senha: string = '';
  nome: string = '';
  confirmarSenha: string = '';
  erro: string | null = null;
  isCadastro: boolean = false;
  isRecuperarSenha: boolean = false;
  isAdmin: boolean = false;
  usuarioLogado: Usuario | null = null;
  sucesso: string = '';
  popoverAberto: boolean = true;

  @Output() fecharPopover = new EventEmitter<void>();

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private eRef: ElementRef,
    private toastService: ToastService
  ) {}

  @HostListener('document:click', ['$event'])
  onClickFora(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.popoverAberto = false;
    }
  }

  fecharPopoverOver() {
  this.popoverAberto = false;
  this.fecharPopover.emit();
}

  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario) => {
      this.usuarioLogado = usuario;
    });
  }

  toggleCadastro() {
    this.isCadastro = !this.isCadastro; // Alterna entre login e cadastro
    this.isRecuperarSenha = false;
  }

  toggleRecuperarSenha() {
    this.isRecuperarSenha = !this.isRecuperarSenha; // Alterna entre recuperação de senha e outros estados
    this.isCadastro = false; // Garante que o estado de cadastro seja desativado
  }

  // }

  async login() {
  const success = await this.authService.login(this.email, this.senha);

  if (success) {
    this.erro = '';
    this.toastService.success('Login realizado com sucesso.');
    this.fecharPopover.emit();
  } else {
    this.erro = 'E-mail ou senha inválidos.';
  }
}

async cadastrar() {
  if (this.senha !== this.confirmarSenha) {
    this.erro = 'As senhas não coincidem.';
    return;
  }

  const { error } = await supabase
    .from('users')
    .insert([
      {
        name: this.nome,
        email: this.email,
        password: this.senha, // ⚠️ Em produção: use hash (bcrypt)
        role: 'user'
      }
    ]);

  if (error) {
    if (error.code === '23505') {
      this.erro = 'Este e-mail já está cadastrado.';
    } else {
      this.erro = 'Erro ao cadastrar: ' + error.message;
    }
    return;
  }

  // Limpar campos e mensagens
  this.nome = '';
  this.email = '';
  this.senha = '';
  this.confirmarSenha = '';
  this.erro = '';
  this.sucesso = 'Cadastro realizado com sucesso!';
}


async recuperarSenha() {
  const erro = await this.authService.recuperarSenha(this.email);

  if (erro) {
    this.erro = erro;
  } else {
    this.erro = '';
    this.toastService.success('Instruções para redefinir sua senha foram enviadas.');
    this.toggleRecuperarSenha();
  }
}

logout() {
  this.authService.logout();
  window.location.href = '/';
}

}
