import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NewsletterService } from '../../services/newsletter.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
email: string = '';
  mensagem: string = '';

  constructor(private newsletterService: NewsletterService) {}

  inscreverNewsletter() {
    if (!this.email) return;

    this.newsletterService.inscrever(this.email).subscribe({
      next: () => {
        this.mensagem = 'Inscrição realizada com sucesso!';
        this.email = '';
      },
      error: (err) => {
        if (err.code === '23505') {
          this.mensagem = 'Este e-mail já está cadastrado.';
        } else {
          this.mensagem = 'Erro ao se inscrever. Tente novamente.';
        }
        console.error(err);
      }
    });
  }
}
