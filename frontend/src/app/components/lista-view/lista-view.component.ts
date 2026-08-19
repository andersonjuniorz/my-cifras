import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListaService } from '../../services/lista.service';
import { CifraService } from '../../services/cifra.service';
import { Lista } from '../../models/lista.model';
import { Cifra } from '../../models/cifra.model';

@Component({
  selector: 'app-lista-view',
  imports: [RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/listas" class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">&larr; Voltar</a>
      </div>

      @if (carregando()) {
        <div class="text-center py-16 text-zinc-600">Carregando...</div>
      } @else if (erro()) {
        <div class="bg-red-500/10 border border-red-500/20 rounded-xl p-8 text-center text-red-400">{{ erro() }}</div>
      } @else if (lista()) {
        <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl font-bold tracking-tight">{{ lista()?.nome }}</h1>
            @if (lista()?.descricao) {
              <p class="text-zinc-500 mt-1">{{ lista()?.descricao }}</p>
            }
            <p class="text-xs text-zinc-600 mt-2">
              {{ (lista()?.cifras?.length || 0) }} {{ (lista()?.cifras?.length || 0) === 1 ? 'cifra' : 'cifras' }}
              @if (lista()?.criadoEm) {
                &middot; Criada em {{ formatarData(lista()!.criadoEm!) }}
              }
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button (click)="toggleModoAdicionar()"
                    class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                    [class]="modoAdicionar()
                      ? 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600'
                      : 'bg-amber-500 text-zinc-950 hover:bg-amber-400'">
              {{ modoAdicionar() ? 'Fechar' : '+ Adicionar Cifra' }}
            </button>
            <a [routerLink]="['/listas', lista()?.id, 'editar']"
               class="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-sm font-medium rounded-lg transition-colors">
              Editar
            </a>
            <button (click)="confirmarDelete.set(true)"
                    class="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium rounded-lg transition-colors">
              Excluir
            </button>
          </div>
        </div>

        @if (modoAdicionar()) {
          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-5 mb-6">
            <h3 class="text-sm font-medium text-zinc-400 mb-3">Selecione cifras para adicionar</h3>
            @if (cifrasDisponiveis().length === 0) {
              <p class="text-xs text-zinc-600">Nenhuma cifra disponivel para adicionar.</p>
            } @else {
              <div class="space-y-2 max-h-64 overflow-y-auto">
                @for (cifra of cifrasDisponiveis(); track cifra.id) {
                  <div class="flex items-center justify-between bg-zinc-800 rounded-lg px-4 py-3">
                    <div class="min-w-0">
                      <span class="font-medium text-sm">{{ cifra.titulo }}</span>
                      <span class="text-zinc-500 text-sm ml-2">{{ cifra.artista }}</span>
                      <span class="text-zinc-600 text-xs ml-2">Tom {{ cifra.tom }}</span>
                    </div>
                    <button (click)="adicionarCifra(cifra.id!)"
                            class="shrink-0 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-lg hover:bg-amber-500/20 transition-colors">
                      + Adicionar
                    </button>
                  </div>
                }
              </div>
            }
          </div>
        }

        @if (lista()?.cifras && lista()!.cifras!.length > 0) {
          <div class="space-y-2">
            @for (cifra of lista()!.cifras!; track cifra.id) {
              <div class="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 hover:border-zinc-700 transition-colors group">
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
                <button (click)="removerCifra(cifra.id!); $event.stopPropagation(); $event.preventDefault()"
                        class="shrink-0 ml-4 px-3 py-1.5 text-xs font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors">
                  Remover
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center">
            <div class="text-4xl mb-4 text-zinc-700">&#9776;</div>
            <p class="text-zinc-500 mb-4">Nenhuma cifra nesta lista.</p>
            <button (click)="toggleModoAdicionar()"
                    class="inline-block px-5 py-2 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm">
              Adicionar primeira cifra
            </button>
          </div>
        }
      }

      @if (confirmarDelete()) {
        <div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" (click)="confirmarDelete.set(false)">
          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-sm w-full" (click)="$event.stopPropagation()">
            <h3 class="font-semibold mb-2">Excluir lista?</h3>
            <p class="text-sm text-zinc-500 mb-5">Essa acao nao pode ser desfeita. As cifras nao serao excluidas.</p>
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
    </div>
  `,
})
export class ListaViewComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly listaService = inject(ListaService);
  private readonly cifraService = inject(CifraService);

  lista = signal<Lista | null>(null);
  carregando = signal(true);
  erro = signal('');
  confirmarDelete = signal(false);
  modoAdicionar = signal(false);
  cifrasDisponiveis = signal<Cifra[]>([]);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.carregarLista(id);
    }
  }

  carregarLista(id: number) {
    this.listaService.buscarPorId(id).subscribe({
      next: (data) => {
        this.lista.set(data);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Lista nao encontrada.');
        this.carregando.set(false);
      },
    });
  }

  toggleModoAdicionar() {
    if (this.modoAdicionar()) {
      this.modoAdicionar.set(false);
    } else {
      this.modoAdicionar.set(true);
      this.carregarCifrasDisponiveis();
    }
  }

  carregarCifrasDisponiveis() {
    const idsNaLista = new Set(this.lista()?.cifras?.map(c => c.id) || []);
    this.cifraService.listar().subscribe({
      next: (cifras) => {
        this.cifrasDisponiveis.set(cifras.filter(c => !idsNaLista.has(c.id)));
      },
      error: () => this.cifrasDisponiveis.set([]),
    });
  }

  adicionarCifra(cifraId: number) {
    const id = this.lista()?.id;
    if (id) {
      this.listaService.adicionarCifra(id, cifraId).subscribe({
        next: (lista) => {
          this.lista.set(lista);
          this.carregarCifrasDisponiveis();
          if (this.cifrasDisponiveis().length === 0) {
            this.modoAdicionar.set(false);
          }
        },
        error: () => {},
      });
    }
  }

  removerCifra(cifraId: number) {
    const id = this.lista()?.id;
    if (id) {
      this.listaService.removerCifra(id, cifraId).subscribe({
        next: (lista) => this.lista.set(lista),
        error: () => {},
      });
    }
  }

  executarDelete() {
    const id = this.lista()?.id;
    if (id) {
      this.listaService.deletar(id).subscribe({
        next: () => this.router.navigate(['/listas']),
        error: () => {
          this.erro.set('Erro ao excluir lista.');
          this.confirmarDelete.set(false);
        },
      });
    }
  }

  instrumentoClass(inst: string | undefined): string {
    switch (inst) {
      case 'VIOLAO': return 'bg-emerald-500/10 text-emerald-400';
      case 'GUITARRA': return 'bg-sky-500/10 text-sky-400';
      case 'TECLADO': return 'bg-purple-500/10 text-purple-400';
      default: return 'bg-zinc-500/10 text-zinc-400';
    }
  }

  instrumentoLabel(inst: string | undefined): string {
    switch (inst) {
      case 'VIOLAO': return 'Violao';
      case 'GUITARRA': return 'Guitarra';
      case 'TECLADO': return 'Teclado';
      default: return inst ?? '';
    }
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
  }
}
