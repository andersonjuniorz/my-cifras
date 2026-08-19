import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <header class="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a routerLink="/" class="flex items-center gap-2 font-bold text-lg tracking-tight">
            <span class="text-amber-400 text-xl">&#9835;</span>
            <span>My<span class="text-amber-400">Cifras</span></span>
          </a>
          <nav class="flex items-center gap-1">
            <a routerLink="/cifras" routerLinkActive="bg-zinc-800 text-amber-400"
               class="px-3 py-1.5 rounded-md text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              Cifras
            </a>
            <a routerLink="/listas" routerLinkActive="bg-zinc-800 text-amber-400"
               class="px-3 py-1.5 rounded-md text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              Listas
            </a>
            <a routerLink="/acordes" routerLinkActive="bg-zinc-800 text-amber-400"
               class="px-3 py-1.5 rounded-md text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              Acorde
            </a>
            <a routerLink="/admin" routerLinkActive="bg-zinc-800 text-amber-400"
               class="px-3 py-1.5 rounded-md text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 transition-colors">
              Admin
            </a>
            <a routerLink="/cifras/novo" routerLinkActive="bg-amber-500/10 text-amber-400"
               class="px-3 py-1.5 rounded-md text-sm font-medium bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors">
              + Nova Cifra
            </a>
          </nav>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>

      <footer class="border-t border-zinc-800 py-4 text-center text-xs text-zinc-600">
        MyCifras &mdash; Gerenciador pessoal de cifras
      </footer>
    </div>
  `,
})
export class LayoutComponent {}
