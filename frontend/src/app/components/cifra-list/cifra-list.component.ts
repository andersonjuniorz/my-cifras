import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CifraService } from '../../services/cifra.service';
import { Cifra } from '../../models/cifra.model';

@Component({
  selector: 'app-cifra-list',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 class="text-2xl font-bold tracking-tight">Cifras</h1>
        <a routerLink="/cifras/novo"
           class="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm">
          <span>+</span> Nova Cifra
        </a>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <input type="text"
               placeholder="Buscar por titulo ou artista..."
               [ngModel]="busca()"
               (ngModelChange)="busca.set($event)"
               (keyup.enter)="buscar()"
               class="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors" />
        <button (click)="buscar()"
                class="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors">
          Buscar
        </button>
      </div>

      <div class="flex gap-2 mb-6 flex-wrap">
        @for (inst of instrumentos; track inst.valor) {
          <button (click)="filtrarPorInstrumento(inst.valor)"
                  [class]="filtroAtivo() === inst.valor
                    ? 'px-3 py-1.5 text-xs font-medium rounded-full transition-colors ' + inst.classeAtivo
                    : 'px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors'">
            {{ inst.label }}
          </button>
        }
        <button (click)="toggleFiltroFavoritos()"
                [class]="filtroFavoritos()
                  ? 'px-3 py-1.5 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 transition-colors'
                  : 'px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700 transition-colors'">
          &#9829; Favoritos
          </button>
          @if (filtroAtivo() || filtroFavoritos()) {
            <button (click)="limparFiltro()"
                    class="px-3 py-1.5 text-xs font-medium rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors">
              Limpar filtro
            </button>
          }
      </div>

      @if (carregando()) {
        <div class="text-center py-16 text-zinc-600">Carregando cifras...</div>
      } @else if (cifras().length === 0) {
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <div class="text-4xl mb-4 text-zinc-700">&#9835;</div>
          <p class="text-zinc-500 mb-4">
            {{ busca() || filtroAtivo() ? 'Nenhuma cifra encontrada.' : 'Nenhuma cifra salva ainda.' }}
          </p>
          @if (!busca() && !filtroAtivo()) {
            <a routerLink="/cifras/novo"
               class="inline-block px-5 py-2 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm">
              Criar primeira cifra
            </a>
          }
        </div>
      } @else {
        <div class="space-y-2">
          @for (cifra of cifras(); track cifra.id) {
            <div class="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 hover:border-zinc-700 transition-colors group">
              <a [routerLink]="['/cifras', cifra.id]" class="min-w-0 flex-1">
                <div class="flex items-center gap-3">
                  <h3 class="font-semibold truncate group-hover:text-amber-400 transition-colors">{{ cifra.titulo }}</h3>
                  <span class="shrink-0 text-xs px-2 py-0.5 rounded-full font-medium"
                        [class]="instrumentoClass(cifra.instrumento)">
                    {{ instrumentoLabel(cifra.instrumento) }}
                  </span>
                </div>
                <p class="text-sm text-zinc-500 truncate mt-0.5">{{ cifra.artista }} &middot; Tom {{ cifra.tom }}</p>
              </a>
              <div class="shrink-0 ml-4 flex items-center gap-2">
                @if (cifra.criadoEm) {
                  <span class="text-xs text-zinc-600 hidden sm:block">{{ formatarData(cifra.criadoEm) }}</span>
                }
                <button (click)="toggleFavorito(cifra); $event.stopPropagation(); $event.preventDefault()"
                        class="text-lg transition-colors px-1"
                        [class]="cifra.favorito ? 'text-amber-400 hover:text-amber-300' : 'text-zinc-700 hover:text-zinc-500'">
                  {{ cifra.favorito ? '&#9829;' : '&#9825;' }}
                </button>
                <span class="text-zinc-700 group-hover:text-amber-400 transition-colors">&rsaquo;</span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class CifraListComponent implements OnInit {
  private readonly cifraService = inject(CifraService);

  cifras = signal<Cifra[]>([]);
  carregando = signal(true);
  busca = signal('');
  filtroAtivo = signal('');
  filtroFavoritos = signal(false);

  instrumentos = [
    { valor: '', label: 'Todos', classeAtivo: '' },
    { valor: 'VIOLAO', label: 'Violao', classeAtivo: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
    { valor: 'GUITARRA', label: 'Guitarra', classeAtivo: 'bg-sky-500/10 text-sky-400 border border-sky-500/20' },
    { valor: 'TECLADO', label: 'Teclado', classeAtivo: 'bg-purple-500/10 text-purple-400 border border-purple-500/20' },
  ];

  ngOnInit() {
    this.carregarCifras();
  }

  carregarCifras() {
    this.carregando.set(true);
    this.cifraService.listar().subscribe({
      next: (data) => {
        this.cifras.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  buscar() {
    const termo = this.busca().trim();
    if (!termo) {
      this.filtroAtivo.set('');
      this.carregarCifras();
      return;
    }
    this.carregando.set(true);
    this.filtroAtivo.set('');
    this.cifraService.buscar(termo).subscribe({
      next: (data) => {
        this.cifras.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  filtrarPorInstrumento(instrumento: string) {
    if (!instrumento) {
      this.filtroAtivo.set('');
      this.carregarCifras();
      return;
    }
    this.busca.set('');
    this.filtroAtivo.set(instrumento);
    this.carregando.set(true);
    this.cifraService.filtrarPorInstrumento(instrumento).subscribe({
      next: (data) => {
        this.cifras.set(data);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
  }

  limparFiltro() {
    this.busca.set('');
    this.filtroAtivo.set('');
    this.filtroFavoritos.set(false);
    this.carregarCifras();
  }

  toggleFiltroFavoritos() {
    if (this.filtroFavoritos()) {
      this.filtroFavoritos.set(false);
      this.carregarCifras();
    } else {
      this.busca.set('');
      this.filtroAtivo.set('');
      this.filtroFavoritos.set(true);
      this.carregando.set(true);
      this.cifraService.listarFavoritos().subscribe({
        next: (data) => {
          this.cifras.set(data);
          this.carregando.set(false);
        },
        error: () => this.carregando.set(false),
      });
    }
  }

  toggleFavorito(cifra: Cifra) {
    if (cifra.id) {
      this.cifraService.toggleFavorito(cifra.id).subscribe({
        next: (updated) => {
          this.cifras.update(list =>
            list.map(c => c.id === updated.id ? updated : c)
          );
        },
        error: () => {},
      });
    }
  }

  instrumentoClass(inst: string): string {
    switch (inst) {
      case 'VIOLAO':
        return 'bg-emerald-500/10 text-emerald-400';
      case 'GUITARRA':
        return 'bg-sky-500/10 text-sky-400';
      case 'TECLADO':
        return 'bg-purple-500/10 text-purple-400';
      default:
        return 'bg-zinc-500/10 text-zinc-400';
    }
  }

  instrumentoLabel(inst: string): string {
    switch (inst) {
      case 'VIOLAO':
        return 'Violao';
      case 'GUITARRA':
        return 'Guitarra';
      case 'TECLADO':
        return 'Teclado';
      default:
        return inst;
    }
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
