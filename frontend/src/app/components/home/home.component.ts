import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CifraService } from '../../services/cifra.service';
import { Cifra } from '../../models/cifra.model';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-10">
      <div class="mb-10">
        <h1 class="text-3xl font-bold tracking-tight mb-2">
          Minhas <span class="text-amber-400">Cifras</span>
        </h1>
        <p class="text-zinc-500 text-sm">
          Gerencie suas versoes de cifras musicais. Corrija, simplifique e organize.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div class="text-3xl font-bold text-amber-400">{{ totalCifras() }}</div>
          <div class="text-sm text-zinc-500 mt-1">Total de Cifras</div>
        </div>
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div class="text-3xl font-bold text-emerald-400">{{ violaoCount() }}</div>
          <div class="text-sm text-zinc-500 mt-1">Violao</div>
        </div>
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <div class="text-3xl font-bold text-sky-400">{{ guitarraCount() }}</div>
          <div class="text-sm text-zinc-500 mt-1">Guitarra</div>
        </div>
      </div>

      @if (favoritas().length > 0) {
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">&#9829; Favoritas</h2>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            @for (cifra of favoritas(); track cifra.id) {
              <a [routerLink]="['/cifras', cifra.id]"
                 class="bg-zinc-900 border border-amber-500/20 rounded-xl p-4 hover:border-amber-500/40 transition-colors group">
                <div class="flex items-start justify-between">
                  <div class="min-w-0">
                    <h3 class="font-semibold truncate group-hover:text-amber-400 transition-colors">{{ cifra.titulo }}</h3>
                    <p class="text-sm text-zinc-500 truncate">{{ cifra.artista }}</p>
                  </div>
                  <span class="shrink-0 ml-3 text-xs px-2 py-0.5 rounded-full font-medium"
                        [class]="instrumentoClass(cifra.instrumento)">
                    {{ instrumentoLabel(cifra.instrumento) }}
                  </span>
                </div>
                <div class="mt-2 flex items-center gap-3 text-xs text-zinc-600">
                  <span>Tom: {{ cifra.tom }}</span>
                </div>
              </a>
            }
          </div>
        </div>
      }

      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold">Recentes</h2>
        <a routerLink="/cifras" class="text-sm text-amber-400 hover:text-amber-300 transition-colors">
          Ver todas &rarr;
        </a>
      </div>

      @if (carregando()) {
        <div class="text-center py-16 text-zinc-600">Carregando...</div>
      } @else if (recentes().length === 0) {
        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
          <div class="text-4xl mb-4 text-zinc-700">&#9835;</div>
          <p class="text-zinc-500 mb-4">Nenhuma cifra salva ainda.</p>
          <a routerLink="/cifras/novo"
             class="inline-block px-5 py-2 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm">
            Criar primeira cifra
          </a>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          @for (cifra of recentes(); track cifra.id) {
            <a [routerLink]="['/cifras', cifra.id]"
               class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors group">
              <div class="flex items-start justify-between">
                <div class="min-w-0">
                  <h3 class="font-semibold truncate group-hover:text-amber-400 transition-colors">{{ cifra.titulo }}</h3>
                  <p class="text-sm text-zinc-500 truncate">{{ cifra.artista }}</p>
                </div>
                <span class="shrink-0 ml-3 text-xs px-2 py-0.5 rounded-full font-medium"
                      [class]="instrumentoClass(cifra.instrumento)">
                  {{ instrumentoLabel(cifra.instrumento) }}
                </span>
              </div>
              <div class="mt-2 flex items-center gap-3 text-xs text-zinc-600">
                <span>Tom: {{ cifra.tom }}</span>
                @if (cifra.criadoEm) {
                  <span>{{ formatarData(cifra.criadoEm) }}</span>
                }
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private readonly cifraService = inject(CifraService);

  cifras = signal<Cifra[]>([]);
  recentes = signal<Cifra[]>([]);
  favoritas = signal<Cifra[]>([]);
  carregando = signal(true);

  totalCifras = signal(0);
  violaoCount = signal(0);
  guitarraCount = signal(0);

  ngOnInit() {
    this.cifraService.listar().subscribe({
      next: (data) => {
        this.cifras.set(data);
        this.recentes.set(data.slice(-5).reverse());
        this.favoritas.set(data.filter(c => c.favorito).slice(0, 5));
        this.totalCifras.set(data.length);
        this.violaoCount.set(data.filter((c) => c.instrumento === 'VIOLAO').length);
        this.guitarraCount.set(data.filter((c) => c.instrumento === 'GUITARRA').length);
        this.carregando.set(false);
      },
      error: () => this.carregando.set(false),
    });
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
