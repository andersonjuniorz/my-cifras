import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lista } from '../models/lista.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ListaService {
  private readonly api = `${environment.apiUrl}/api/listas`;
  private readonly http = inject(HttpClient);

  listar(): Observable<Lista[]> {
    return this.http.get<Lista[]>(this.api);
  }

  buscarPorId(id: number): Observable<Lista> {
    return this.http.get<Lista>(`${this.api}/${id}`);
  }

  criar(lista: Lista): Observable<Lista> {
    return this.http.post<Lista>(this.api, lista);
  }

  atualizar(id: number, lista: Lista): Observable<Lista> {
    return this.http.put<Lista>(`${this.api}/${id}`, lista);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  buscar(query: string): Observable<Lista[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Lista[]>(`${this.api}/search`, { params });
  }

  adicionarCifra(listaId: number, cifraId: number): Observable<Lista> {
    return this.http.post<Lista>(`${this.api}/${listaId}/cifras/${cifraId}`, {});
  }

  removerCifra(listaId: number, cifraId: number): Observable<Lista> {
    return this.http.delete<Lista>(`${this.api}/${listaId}/cifras/${cifraId}`);
  }
}
