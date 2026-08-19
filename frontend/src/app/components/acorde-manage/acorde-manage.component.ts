import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChordDiagramService } from '../../services/chord-diagram.service';
import { ChordDiagram } from '../../models/chord-diagram.model';

@Component({
  selector: 'app-acorde-manage',
  imports: [RouterLink, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/cifras" class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">&larr; Voltar</a>
      </div>

      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold tracking-tight">Acorde</h1>
        <button (click)="toggleForm()"
                class="px-4 py-2 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm">
          {{ modoForm() ? 'Voltar a lista' : '+ Novo Acorde' }}
        </button>
      </div>

      @if (modoForm()) {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form (ngSubmit)="salvar()" class="space-y-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-zinc-400 mb-1.5">Nome do acorde *</label>
                <input type="text" [(ngModel)]="form.nome" name="nome" required
                       class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                       placeholder="Ex: C7, Am, D/F#" />
              </div>
              <div>
                <label class="block text-sm font-medium text-zinc-400 mb-1.5">Instrumento *</label>
                <select [(ngModel)]="form.instrumento" name="instrumento" required
                        class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-amber-500/50 transition-colors">
                  <option value="VIOLAO">Violao</option>
                  <option value="GUITARRA">Guitarra</option>
                  <option value="TECLADO">Teclado</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-zinc-400 mb-1.5">Diagrama do acorde *</label>
              <textarea [(ngModel)]="form.diagrama" name="diagrama" required rows="10"
                        class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors font-mono leading-relaxed resize-y"
                        placeholder="Cole ou digite o diagrama do acorde aqui...&#10;&#10;Ex:&#10;  C&#10;e|---0---|&#10;B|---1---|&#10;G|---0---|&#10;D|---2---|&#10;A|---3---|&#10;E|---x---|"></textarea>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button type="submit"
                      [disabled]="salvando() || !form.nome || !form.diagrama"
                      class="px-6 py-2.5 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                {{ salvando() ? 'Salvando...' : (editando() ? 'Salvar Alteracoes' : 'Criar Acorde') }}
              </button>
              <button type="button" (click)="cancelarForm()"
                      class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Cancelar
              </button>
            </div>

            @if (erro()) {
              <div class="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
                {{ erro() }}
              </div>
            }
          </form>

          <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center min-h-[280px]">
            <p class="text-xs text-zinc-600 mb-4">Preview</p>
            @if (form.diagrama) {
              <pre class="font-mono text-sm leading-relaxed text-zinc-200 whitespace-pre-wrap break-words text-left">{{ form.diagrama }}</pre>
            } @else {
              <p class="text-xs text-zinc-700">Digite o diagrama para ver o preview</p>
            }
          </div>
        </div>
      } @else {
        <div class="mb-4">
          <input type="text" [(ngModel)]="busca" (ngModelChange)="carregar()"
                 class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                 placeholder="Buscar acorde..." />
        </div>

        @if (carregando()) {
          <div class="text-center py-16 text-zinc-600">Carregando...</div>
        } @else if (acordes().length === 0) {
          <div class="text-center py-16 text-zinc-600">Nenhum acorde cadastrado.</div>
        } @else {
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            @for (acorde of acordes(); track acorde.id) {
              <div class="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col">
                <div class="flex items-center justify-between mb-2">
                  <span class="font-semibold text-zinc-100 text-sm">{{ acorde.nome }}</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        [class]="instrumentoClass(acorde.instrumento)">
                    {{ instrumentoLabel(acorde.instrumento) }}
                  </span>
                </div>
                <div class="flex-1 py-2 min-h-[100px]">
                  <pre class="font-mono text-xs leading-snug text-zinc-400 whitespace-pre-wrap break-words line-clamp-6">{{ acorde.diagrama }}</pre>
                </div>
                <div class="flex items-center gap-2 pt-2 border-t border-zinc-800 mt-2">
                  <button (click)="editar(acorde)"
                          class="text-xs text-zinc-500 hover:text-amber-400 transition-colors">
                    Editar
                  </button>
                  <button (click)="deletar(acorde)"
                          class="text-xs text-zinc-500 hover:text-red-400 transition-colors">
                    Excluir
                  </button>
                </div>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
})
export class AcordeManageComponent implements OnInit {
  private readonly chordService = inject(ChordDiagramService);

  acordes = signal<ChordDiagram[]>([]);
  carregando = signal(true);
  salvando = signal(false);
  erro = signal('');
  modoForm = signal(false);
  editando = signal(false);

  busca = '';
  editId: number | null = null;

  form: ChordDiagram = {
    nome: '',
    diagrama: '',
    instrumento: 'VIOLAO',
  };

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.carregando.set(true);
    const req = this.busca
      ? this.chordService.buscar(this.busca)
      : this.chordService.listar();

    req.subscribe({
      next: (data) => {
        this.acordes.set(data);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Erro ao carregar acordes.');
        this.carregando.set(false);
      },
    });
  }

  toggleForm() {
    this.modoForm.update(v => !v);
    if (!this.modoForm()) {
      this.cancelarForm();
    }
  }

  cancelarForm() {
    this.modoForm.set(false);
    this.editando.set(false);
    this.editId = null;
    this.form = { nome: '', diagrama: '', instrumento: 'VIOLAO' };
    this.erro.set('');
  }

  editar(acorde: ChordDiagram) {
    this.form = { ...acorde };
    this.editId = acorde.id!;
    this.editando.set(true);
    this.modoForm.set(true);
  }

  salvar() {
    this.salvando.set(true);
    this.erro.set('');

    const req = this.editando()
      ? this.chordService.atualizar(this.editId!, this.form)
      : this.chordService.criar(this.form);

    req.subscribe({
      next: () => {
        this.salvando.set(false);
        this.cancelarForm();
        this.carregar();
      },
      error: (err) => {
        this.salvando.set(false);
        this.erro.set('Erro ao salvar acorde. Tente novamente.');
        console.error(err);
      },
    });
  }

  deletar(acorde: ChordDiagram) {
    if (!acorde.id) return;
    this.chordService.deletar(acorde.id).subscribe({
      next: () => this.carregar(),
      error: (err) => {
        console.error(err);
      },
    });
  }

  instrumentoClass(inst: string): string {
    switch (inst) {
      case 'VIOLAO': return 'bg-emerald-500/10 text-emerald-400';
      case 'GUITARRA': return 'bg-sky-500/10 text-sky-400';
      case 'TECLADO': return 'bg-purple-500/10 text-purple-400';
      default: return 'bg-zinc-500/10 text-zinc-400';
    }
  }

  instrumentoLabel(inst: string): string {
    switch (inst) {
      case 'VIOLAO': return 'Violao';
      case 'GUITARRA': return 'Guitarra';
      case 'TECLADO': return 'Teclado';
      default: return inst;
    }
  }
}
