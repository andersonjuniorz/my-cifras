import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListaService } from '../../services/lista.service';
import { Lista } from '../../models/lista.model';

@Component({
  selector: 'app-lista-list',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 class="text-2xl font-bold tracking-tight">Listas</h1>
        <a routerLink="/listas/nova"
           class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm">
          <span>+</span> Nova Lista
        </a>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text"
               placeholder="Buscar lista..."
               [ngModel]="busca()"
               (ngModelChange)="busca.set($event)"
               (keyup.enter)="buscar()"
               class="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
        <button (click)="buscar()"
                class="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors">
          Buscar
        </button>
      </div>

      @if (carregando()) {
        <div class="text-center py-16 text-zinc-600">Carregando listas...</div>
      } @else if (listas().length === 0) {
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <div class="text-4xl mb-4 text-zinc-700">&#9776;</div>
          <p class="text-zinc-500 mb-4">
            {{ busca() ? 'Nenhuma lista encontrada.' : 'Nenhuma lista criada ainda.' }}
          </p>
          @if (!busca()) {
            <a routerLink="/listas/nova"
               class="inline-block px-5 py-2 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm">
              Criar primeira lista
            </a>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          @for (lista of listas(); track lista.id) {
            <a [routerLink]="['/listas', lista.id]"
               class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors group">
              <div class="flex items-start justify-between">
                <div class="min-w-0">
                  <h3 class="font-semibold group-hover:text-amber-400 transition-colors">{{ lista.nome }}</h3>
                  @if (lista.descricao) {
                    <p class="text-sm text-zinc-500 truncate mt-1">{{ lista.descricao }}</p>
                  }
                </div>
                <span class="shrink-0 ml-3 text-xs px-2 py-0.5 rounded-full font-medium bg-zinc-800 text-zinc-400">
                  {{ (lista.cifras?.length || 0) }} {{ (lista.cifras?.length || 0) === 1 ? 'cifra' : 'cifras' }}
                </span>
              </div>
              @if (lista.criadoEm) {
                <div class="mt-3 text-xs text-zinc-600">
                  Criada em {{ formatarData(lista.criadoEm) }}
                </div>
              }
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class ListaListComponent implements OnInit {
  private readonly listaService = inject(ListaService);

  listas = signal<Lista[]>([]);
  carregando = signal(true);
  busca = signal('');

  ngOnInit() {
    this.carregarListas();
  }

  carregarListas() {
    this.carregando.set(true);
    this.listaService.listar().subscribe({
      next: (data) => {
        this.listas.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  buscar() {
    const termo = this.busca().trim();
    if (!termo) {
      this.carregarListas();
      return;
    }
    this.carregando.set(true);
    this.listaService.buscar(termo).subscribe({
      next: (data) => {
        this.listas.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
