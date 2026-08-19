import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CifraService } from '../../services/cifra.service';
import { ChordDiagramService } from '../../services/chord-diagram.service';
import { ListaService } from '../../services/lista.service';
import { Cifra } from '../../models/cifra.model';
import { ChordDiagram } from '../../models/chord-diagram.model';
import { Lista } from '../../models/lista.model';

@Component({
  selector: 'app-cifra-view',
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8 pb-24">
      <div class="mb-6">
        <a routerLink="/cifras" class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">&larr; Voltar</a>
      </div>

      @if (carregando()) {
        <div class="text-center py-16 text-zinc-600">Carregando...</div>
      } @else if (erro()) {
        <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center text-red-400">{{ erro() }}</div>
      } @else if (cifra()) {
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <h1 class="text-2xl font-bold tracking-tight">{{ cifra()?.titulo }}</h1>
            <p class="text-zinc-500 mt-1">{{ cifra()?.artista }}</p>
            <div class="flex items-center gap-2 mt-2">
              <span class="text-xs px-2 py-0.5 rounded-full font-medium"
                    [class]="instrumentoClass(cifra()?.instrumento)">
                {{ instrumentoLabel(cifra()?.instrumento) }}
              </span>
              @if (cifra()?.criadoEm) {
                <span class="text-xs text-zinc-600">Criado em {{ formatarData(cifra()!.criadoEm!) }}</span>
              }
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button (click)="toggleFavorito()"
                    class="px-3 py-2 rounded-lg transition-colors text-sm"
                    [class]="cifra()?.favorito
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'">
              {{ cifra()?.favorito ? '&#9829;' : '&#9825;' }}
            </button>
            <div class="relative">
              <button (click)="toggleListasDropdown()"
                      class="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 rounded-lg transition-colors text-sm">
                + Lista
              </button>
              @if (listasDropdownAberto()) {
                <div class="absolute right-0 top-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl p-2 min-w-[220px] shadow-xl shadow-black/40 z-50">
                  @if (listas().length === 0) {
                    <p class="text-xs text-zinc-600 px-3 py-2">Nenhuma lista criada.</p>
                  } @else {
                    @for (lista of listas(); track lista.id) {
                      <button (click)="adicionarALista(lista.id!); $event.stopPropagation()"
                              class="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-zinc-800 transition-colors flex items-center justify-between">
                        <span class="truncate">{{ lista.nome }}</span>
                        @if (lista.cifras?.some(c => c.id === cifra()?.id)) {
                          <span class="text-xs text-amber-400 ml-2">ja adicionada</span>
                        }
                      </button>
                    }
                  }
                </div>
              }
            </div>
            <a [routerLink]="['/cifras', cifra()?.id, 'editar']"
               class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors">
              Editar
            </a>
            <button (click)="deletar()"
                    class="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors">
              Excluir
            </button>
          </div>
        </div>

        @if (cifra()?.fonte) {
          <a [href]="cifra()?.fonte" target="_blank" rel="noopener"
             class="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-amber-400 transition-colors mb-4">
            Fonte original &nearr;
          </a>
        }

        @if (acordeCarregados().length > 0) {
          <div class="sticky top-0 z-30 -mx-4 px-4 py-3 mb-4 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/50">
            <div class="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
              @for (acorde of acordeCarregados(); track acorde.id) {
                <div class="shrink-0 bg-zinc-900 border border-zinc-800 rounded-xl p-3 min-w-[140px] max-w-[200px]">
                  <span class="text-sm font-bold text-amber-400 block mb-1">{{ acorde.nome }}</span>
                  <pre class="font-mono text-xs leading-snug text-zinc-300 whitespace-pre-wrap break-words">{{ acorde.diagrama }}</pre>
                </div>
              }
            </div>
          </div>
        } @else if (cifra()) {
          <div class="sticky top-0 z-30 -mx-4 px-4 py-2 mb-4 bg-zinc-950/95 backdrop-blur-sm border-b border-zinc-800/50">
            <p class="text-xs text-zinc-600">
              Nenhum acorde vinculado.
              <a [routerLink]="['/cifras', cifra()?.id, 'editar']" class="text-amber-400 hover:text-amber-300 transition-colors">Editar para adicionar acordes</a>
            </p>
          </div>
        }

        <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <pre class="font-mono text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap break-words">{{ cifra()?.conteudo }}</pre>
        </div>

        @if (cifra()?.observacoes) {
          <div class="mt-4 bg-amber-500/5 border border-amber-500/10 rounded-xl p-5">
            <h3 class="text-sm font-medium text-amber-400 mb-2">Observacoes</h3>
            <p class="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{{ cifra()?.observacoes }}</p>
          </div>
        }
      }

      @if (confirmarDelete()) {
        <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" (click)="confirmarDelete.set(false)">
          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full" (click)="$event.stopPropagation()">
            <h3 class="font-semibold mb-2">Excluir cifra?</h3>
            <p class="text-sm text-zinc-500 mb-5">Essa acao nao pode ser desfeita.</p>
            <div class="flex justify-end gap-3">
              <button (click)="confirmarDelete.set(false)"
                      class="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors">
                Cancelar
              </button>
              <button (click)="executarDelete()"
                      class="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-400 transition-colors">
                Excluir
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Scroll Controller -->
      <div class="fixed bottom-6 left-6 z-40
                  bg-zinc-900/95 backdrop-blur-sm border border-zinc-700 rounded-2xl
                  px-2 py-2 flex items-center gap-1 shadow-lg shadow-black/40">
        <button (click)="desacelerar()"
                class="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold
                       text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors
                       disabled:opacity-30 disabled:cursor-not-allowed select-none"
                [disabled]="indiceVelocidade() <= 0">
          &lsaquo;
        </button>

        <div class="flex flex-col items-center">
          <span class="text-[10px] font-mono text-zinc-500 select-none leading-none mb-1">
            {{ labelVelocidade() }}
          </span>
          <button (click)="toggleScroll()"
                  class="h-9 px-4 rounded-full flex items-center justify-center text-sm font-medium
                         transition-colors select-none"
                  [class]="scrollAtivo()
                    ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'">
            @if (scrollAtivo()) {
              <span class="w-3 h-3 border-2 border-current rounded-sm mr-2"></span>
              Pausar
            } @else {
              <span class="w-0 h-0 border-l-[10px] border-l-current border-y-[6px] border-y-transparent mr-2"></span>
              Play
            }
          </button>
        </div>

        <button (click)="acelerar()"
                class="w-9 h-9 rounded-full flex items-center justify-center text-lg font-bold
                       text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors
                       disabled:opacity-30 disabled:cursor-not-allowed select-none"
                [disabled]="indiceVelocidade() >= velocidades.length - 1">
          &rsaquo;
        </button>
      </div>
    </div>
  `,
})
export class CifraViewComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cifraService = inject(CifraService);
  private readonly chordService = inject(ChordDiagramService);
  private readonly listaService = inject(ListaService);

  cifra = signal<Cifra | null>(null);
  acordeCarregados = signal<ChordDiagram[]>([]);
  listas = signal<Lista[]>([]);
  carregando = signal(true);
  erro = signal('');
  confirmarDelete = signal(false);
  listasDropdownAberto = signal(false);

  velocidades = [250, 180, 130, 90, 60, 40, 20, 0];
  labels = ['0.2x', '0.4x', '0.6x', '1x', '1.5x', '2x', '3x', '0'];

  indiceVelocidade = signal(3);
  scrollAtivo = signal(false);
  labelVelocidade = signal('1x');

  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cifraService.buscarPorId(id).subscribe({
        next: (data) => {
          this.cifra.set(data);
          this.carregarAcorde(data.acordesIds);
          this.carregando.set(false);
        },
        error: () => {
          this.erro.set('Cifra nao encontrada.');
          this.carregando.set(false);
        },
      });
    }
  }

  toggleListasDropdown() {
    if (this.listasDropdownAberto()) {
      this.listasDropdownAberto.set(false);
    } else {
      this.listasDropdownAberto.set(true);
      if (this.listas().length === 0) {
        this.listaService.listar().subscribe({
          next: (listas) => this.listas.set(listas),
          error: () => {},
        });
      }
    }
  }

  adicionarALista(listaId: number) {
    const cifraId = this.cifra()?.id;
    if (!cifraId) return;
    this.listaService.adicionarCifra(listaId, cifraId).subscribe({
      next: () => {
        this.listasDropdownAberto.set(false);
        this.listas.set([]);
      },
      error: () => {},
    });
  }

  private carregarAcorde(acordesIds?: string) {
    if (!acordesIds) return;
    const ids = acordesIds.split(',').filter(Boolean).map(Number);
    if (ids.length === 0) return;

    ids.forEach(id => {
      this.chordService.buscarPorId(id).subscribe({
        next: (acorde) => this.acordeCarregados.update(list => [...list, acorde]),
        error: () => {},
      });
    });
  }

  ngOnDestroy() {
    this.pararScroll();
  }

  acelerar() {
    if (this.indiceVelocidade() < this.velocidades.length - 1) {
      this.indiceVelocidade.update((i) => i + 1);
      this.atualizarLabel();
      if (this.scrollAtivo()) {
        this.reiniciarInterval();
      }
    }
  }

  desacelerar() {
    if (this.indiceVelocidade() > 0) {
      this.indiceVelocidade.update((i) => i - 1);
      this.atualizarLabel();
      if (this.scrollAtivo()) {
        this.reiniciarInterval();
      }
    }
  }

  toggleScroll() {
    if (this.scrollAtivo()) {
      this.pararScroll();
    } else {
      this.iniciarScroll();
    }
  }

  private iniciarScroll() {
    const ms = this.velocidades[this.indiceVelocidade()];
    if (ms === 0) return;
    this.scrollAtivo.set(true);
    this.intervalId = setInterval(() => {
      window.scrollBy({ top: 1, behavior: 'auto' });
    }, ms);
  }

  private pararScroll() {
    this.scrollAtivo.set(false);
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private reiniciarInterval() {
    this.pararScroll();
    const ms = this.velocidades[this.indiceVelocidade()];
    if (ms === 0) return;
    this.scrollAtivo.set(true);
    this.intervalId = setInterval(() => {
      window.scrollBy({ top: 1, behavior: 'auto' });
    }, ms);
  }

  private atualizarLabel() {
    this.labelVelocidade.set(this.labels[this.indiceVelocidade()]);
  }

  deletar() {
    this.confirmarDelete.set(true);
  }

  executarDelete() {
    const id = this.cifra()?.id;
    if (id) {
      this.cifraService.deletar(id).subscribe({
        next: () => this.router.navigate(['/cifras']),
        error: (err) => {
          console.error(err);
          this.erro.set('Erro ao excluir cifra.');
          this.confirmarDelete.set(false);
        },
      });
    }
  }

  toggleFavorito() {
    const id = this.cifra()?.id;
    if (id) {
      this.cifraService.toggleFavorito(id).subscribe({
        next: (updated) => this.cifra.set(updated),
        error: () => {},
      });
    }
  }

  instrumentoClass(inst: string | undefined): string {
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

  instrumentoLabel(inst: string | undefined): string {
    switch (inst) {
      case 'VIOLAO':
        return 'Violao';
      case 'GUITARRA':
        return 'Guitarra';
      case 'TECLADO':
        return 'Teclado';
      default:
        return inst ?? '';
    }
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
