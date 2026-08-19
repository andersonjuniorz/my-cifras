import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackupService } from '../../services/backup.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin',
  imports: [],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold tracking-tight mb-8">Administra&ccedil;&atilde;o</h1>

      <!-- Backend -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          Backend
        </h2>
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          @if (info()) {
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span class="text-zinc-500">Java</span>
                <p class="font-mono text-zinc-200">{{ info()?.java }}</p>
              </div>
              <div>
                <span class="text-zinc-500">Spring Boot</span>
                <p class="font-mono text-zinc-200">{{ info()?.spring }}</p>
              </div>
              <div>
                <span class="text-zinc-500">Sistema</span>
                <p class="font-mono text-zinc-200">{{ info()?.os }}</p>
              </div>
              <div>
                <span class="text-zinc-500">Uptime</span>
                <p class="font-mono text-zinc-200">{{ info()?.uptime }}</p>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Banco de Dados -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-sky-500"></span>
          Banco de Dados
        </h2>
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div class="flex flex-wrap gap-3">
            <button (click)="downloadBackup()"
                    [disabled]="baixandoBackup()"
                    class="px-5 py-2.5 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed">
              @if (baixandoBackup()) {
                Baixando...
              } @else {
                Baixar Backup SQL
              }
            </button>
            <label class="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors cursor-pointer disabled:opacity-40">
              <input type="file" accept=".sql" class="hidden" (change)="restoreBackup($event)"
                     [disabled]="restaurando()" />
              @if (restaurando()) {
                Restaurando...
              } @else {
                Restaurar Backup SQL
              }
            </label>
          </div>
          @if (msgBackup()) {
            <p class="mt-3 text-sm" [class]="msgBackup()?.sucesso ? 'text-emerald-400' : 'text-red-400'">
              {{ msgBackup()?.texto }}
            </p>
          }
        </div>
      </section>
    </div>
  `,
})
export class AdminComponent {
  private readonly http = inject(HttpClient);
  private readonly backupService = inject(BackupService);

  info = signal<{ java: string; spring: string; os: string; uptime: string } | null>(null);
  baixandoBackup = signal(false);
  restaurando = signal(false);
  msgBackup = signal<{ texto: string; sucesso: boolean } | null>(null);

  constructor() {
    this.http.get<{ java: string; spring: string; os: string; uptime: string }>(
      `${environment.apiUrl}/api/admin/info`
    ).subscribe({
      next: (data) => this.info.set(data),
      error: () => {},
    });
  }

  downloadBackup() {
    this.baixandoBackup.set(true);
    this.msgBackup.set(null);
    this.backupService.backup().subscribe({
      next: (blob) => {
        this.baixandoBackup.set(false);
        this.msgBackup.set({ texto: 'Backup baixado com sucesso.', sucesso: true });
        this.salvarArquivo(blob, 'mycifras_backup.sql');
      },
      error: () => {
        this.baixandoBackup.set(false);
        this.msgBackup.set({ texto: 'Erro ao baixar backup.', sucesso: false });
      },
    });
  }

  restoreBackup(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.restaurando.set(true);
    this.msgBackup.set(null);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ mensagem: string }>(`${environment.apiUrl}/api/admin/restore-backup`, formData)
      .subscribe({
        next: (res) => {
          this.restaurando.set(false);
          this.msgBackup.set({ texto: res.mensagem, sucesso: true });
        },
        error: (err) => {
          this.restaurando.set(false);
          const msg = err.error?.mensagem || 'Erro ao restaurar backup.';
          this.msgBackup.set({ texto: msg, sucesso: false });
        },
      });
    input.value = '';
  }

  private salvarArquivo(blob: Blob, nome: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nome;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
