import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';
import { AuthService } from './auth.service';

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

  @Output() fecharPopover = new EventEmitter<void>();

  constructor(private authService: AuthService) {}

  toggleCadastro() {
    this.isCadastro = !this.isCadastro; // Alterna entre login e cadastro
  }

  toggleRecuperarSenha() {
    this.isRecuperarSenha = !this.isRecuperarSenha; // Alterna entre recuperação de senha e outros estados
    this.isCadastro = false; // Garante que o estado de cadastro seja desativado
  }

  login() {
    const loginSuccess = this.authService.login(this.email, this.senha);
    
    if (loginSuccess) {
      this.erro = '';
      alert('Login realizado com sucesso!');
      this.fecharPopover.emit();
    } else {
      this.erro = 'E-mail ou senha inválidos.';
    }
  }

  cadastrar() {
    // Lógica para cadastro
    console.log('Cadastro:', this.nome, this.email, this.senha, this.confirmarSenha);
  }

  recuperarSenha() {
    // Lógica para recuperação de senha
    console.log('Recuperar senha:', this.email);
  }
}
