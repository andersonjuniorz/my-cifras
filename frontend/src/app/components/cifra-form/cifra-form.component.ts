import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CifraService } from '../../services/cifra.service';
import { ChordDiagramService } from '../../services/chord-diagram.service';
import { Cifra } from '../../models/cifra.model';
import { ChordDiagram } from '../../models/chord-diagram.model';

@Component({
  selector: 'app-cifra-form',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/cifras" class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">&larr; Voltar</a>
      </div>

      <h1 class="text-2xl font-bold tracking-tight mb-6">Nova Cifra</h1>

      <form (ngSubmit)="salvar()" class="space-y-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Titulo *</label>
            <input type="text" [(ngModel)]="form.titulo" name="titulo" required
                   class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                   placeholder="Nome da musica" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Artista *</label>
            <input type="text" [(ngModel)]="form.artista" name="artista" required
                   class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                   placeholder="Nome do artista ou banda" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Tom *</label>
            <input type="text" [(ngModel)]="form.tom" name="tom" required
                   class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                   placeholder="Ex: C, Am, G" />
          </div>
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Instrumento *</label>
            <select [(ngModel)]="form.instrumento" name="instrumento" required
                    (ngModelChange)="carregarAcorde()"
                    class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 transition-colors">
              <option value="VIOLAO">Violao</option>
              <option value="GUITARRA">Guitarra</option>
              <option value="TECLADO">Teclado</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1.5">
            Acorde
            <a routerLink="/acordes" class="ml-2 text-xs text-amber-400 hover:text-amber-300 transition-colors">Gerenciar acordes</a>
          </label>
          @if (acordesDisponiveis().length === 0) {
            <p class="text-xs text-zinc-600">Nenhum acorde cadastrado para este instrumento.</p>
          } @else {
            <div class="flex flex-wrap gap-2">
              @for (acorde of acordesDisponiveis(); track acorde.id) {
                <button type="button" (click)="toggleAcorde(acorde)"
                        class="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                        [class]="acordeSelecionado(acorde.id!)
                          ? 'bg-amber-500 text-zinc-950'
                          : 'bg-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700'">
                  {{ acorde.nome }}
                </button>
              }
            </div>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1.5">Conteudo da Cifra *</label>
          <textarea [(ngModel)]="form.conteudo" name="conteudo" required rows="16"
                    class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors font-mono leading-relaxed resize-y"
                    placeholder="Cole o texto da cifra aqui...&#10;&#10;Ex:&#10;C        Am&#10;Hoje eu quero...&#10;G        F&#10;..."></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1.5">Fonte (URL opcional)</label>
          <input type="url" [(ngModel)]="form.fonte" name="fonte"
                 class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                 placeholder="https://..." />
        </div>

        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-1.5">Observacoes</label>
          <textarea [(ngModel)]="form.observacoes" name="observacoes" rows="3"
                    class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-y"
                    placeholder="Notas pessoais sobre a cifra..."></textarea>
        </div>

        <div class="flex items-center gap-3 pt-2">
          <button type="submit"
                  [disabled]="salvando() || !form.titulo || !form.artista || !form.tom || !form.conteudo"
                  class="px-6 py-2.5 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed">
            {{ salvando() ? 'Salvando...' : 'Salvar Cifra' }}
          </button>
          <a routerLink="/cifras" class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Cancelar</a>
        </div>

        @if (erro()) {
          <div class="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
            {{ erro() }}
          </div>
        }
      </form>
    </div>
  `,
})
export class CifraFormComponent implements OnInit {
  private readonly cifraService = inject(CifraService);
  private readonly chordService = inject(ChordDiagramService);
  private readonly router = inject(Router);

  salvando = signal(false);
  erro = signal('');
  acordesDisponiveis = signal<ChordDiagram[]>([]);
  acordeIds = signal<Set<number>>(new Set());

  form: Cifra = {
    titulo: '',
    artista: '',
    tom: '',
    instrumento: 'VIOLAO',
    conteudo: '',
    fonte: '',
    observacoes: '',
    acordesIds: '',
  };

  ngOnInit() {
    this.carregarAcorde();
  }

  carregarAcorde() {
    this.chordService.filtrarPorInstrumento(this.form.instrumento).subscribe({
      next: (data) => this.acordesDisponiveis.set(data),
      error: () => this.acordesDisponiveis.set([]),
    });
  }

  acordeSelecionado(id: number): boolean {
    return this.acordeIds().has(id);
  }

  toggleAcorde(acorde: ChordDiagram) {
    this.acordeIds.update(ids => {
      const next = new Set(ids);
      if (next.has(acorde.id!)) {
        next.delete(acorde.id!);
      } else {
        next.add(acorde.id!);
      }
      return next;
    });
    this.form.acordesIds = Array.from(this.acordeIds()).join(',');
  }

  salvar() {
    this.salvando.set(true);
    this.erro.set('');

    this.cifraService.criar(this.form).subscribe({
      next: (cifra) => {
        this.salvando.set(false);
        this.router.navigate(['/cifras', cifra.id]);
      },
      error: (err) => {
        this.salvando.set(false);
        this.erro.set('Erro ao salvar cifra. Tente novamente.');
        console.error(err);
      },
    });
  }
}
