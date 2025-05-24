// src/app/components/toast/toast.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;">
      <div 
        *ngIf="toast" 
        class="toast show align-items-center text-white border-0 mb-2"
        [ngClass]="{
          'bg-success': toast.type === 'success',
          'bg-danger': toast.type === 'error',
          'bg-warning text-dark': toast.type === 'warning',
          'bg-info': toast.type === 'info'
        }"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body">
            {{ toast.message }}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" (click)="toast = null"></button>
        </div>
      </div>
    </div>
  `
})
export class ToastComponent implements OnInit {
  toast: Toast | null = null;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toast$.subscribe(toast => {
      this.toast = toast;

      // Ocultar o toast automaticamente após 3 segundos
      setTimeout(() => {
        this.toast = null;
      }, 3000);
    });
  }
}
