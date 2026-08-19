import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListaService } from '../../services/lista.service';
import { Lista } from '../../models/lista.model';

@Component({
  selector: 'app-lista-form',
  imports: [FormsModule, RouterLink],
  template: `
    <div class="max-w-3xl mx-auto px-4 py-8">
      <div class="mb-6">
        <a routerLink="/listas" class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">&larr; Voltar</a>
      </div>

      @if (carregando()) {
        <div class="text-center py-16 text-zinc-600">Carregando...</div>
      } @else {
        <h1 class="text-2xl font-bold tracking-tight mb-6">{{ editando() ? 'Editar Lista' : 'Nova Lista' }}</h1>

        <form (ngSubmit)="salvar()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Nome *</label>
            <input type="text" [(ngModel)]="form.nome" name="nome" required
                   class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                   placeholder="Ex: Musicas que estou aprendendo" />
          </div>

          <div>
            <label class="block text-sm font-medium text-zinc-400 mb-1.5">Descricao</label>
            <textarea [(ngModel)]="form.descricao" name="descricao" rows="3"
                      class="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors resize-y"
                      placeholder="Descricao opcional da lista..."></textarea>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="submit"
                    [disabled]="salvando() || !form.nome"
                    class="px-6 py-2.5 bg-amber-500 text-zinc-950 font-medium rounded-lg hover:bg-amber-400 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed">
              {{ salvando() ? 'Salvando...' : (editando() ? 'Salvar Alteracoes' : 'Criar Lista') }}
            </button>
            <a routerLink="/listas" class="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">Cancelar</a>
          </div>

          @if (erro()) {
            <div class="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-sm text-red-400">
              {{ erro() }}
            </div>
          }
        </form>
      }
    </div>
  `,
})
export class ListaFormComponent implements OnInit {
  private readonly listaService = inject(ListaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  editando = signal(false);
  carregando = signal(false);
  salvando = signal(false);
  erro = signal('');
  id = 0;

  form: Lista = {
    nome: '',
    descricao: '',
  };

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.editando.set(true);
      this.carregando.set(true);
      this.listaService.buscarPorId(this.id).subscribe({
        next: (data) => {
          this.form = { nome: data.nome, descricao: data.descricao };
          this.carregando.set(false);
        },
        error: () => {
          this.erro.set('Lista nao encontrada.');
          this.carregando.set(false);
        },
      });
    }
  }

  salvar() {
    this.salvando.set(true);
    this.erro.set('');

    const obs = this.editando()
      ? this.listaService.atualizar(this.id, this.form)
      : this.listaService.criar(this.form);

    obs.subscribe({
      next: (lista) => {
        this.salvando.set(false);
        this.router.navigate(['/listas', lista.id]);
      },
      error: (err) => {
        this.salvando.set(false);
        this.erro.set('Erro ao salvar lista. Tente novamente.');
        console.error(err);
      },
    });
  }
}
