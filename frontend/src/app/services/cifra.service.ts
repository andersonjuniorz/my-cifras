import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cifra } from '../models/cifra.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CifraService {
  private readonly api = `${environment.apiUrl}/api/cifras`;
  private readonly http = inject(HttpClient);

  listar(): Observable<Cifra[]> {
    return this.http.get<Cifra[]>(this.api);
  }

  buscarPorId(id: number): Observable<Cifra> {
    return this.http.get<Cifra>(`${this.api}/${id}`);
  }

  criar(cifra: Cifra): Observable<Cifra> {
    return this.http.post<Cifra>(this.api, cifra);
  }

  atualizar(id: number, cifra: Cifra): Observable<Cifra> {
    return this.http.put<Cifra>(`${this.api}/${id}`, cifra);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  buscar(query: string): Observable<Cifra[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<Cifra[]>(`${this.api}/search`, { params });
  }

  filtrarPorInstrumento(instrumento: string): Observable<Cifra[]> {
    return this.http.get<Cifra[]>(`${this.api}/instrumento/${instrumento}`);
  }

  toggleFavorito(id: number): Observable<Cifra> {
    return this.http.patch<Cifra>(`${this.api}/${id}/favorito`, {});
  }

  listarFavoritos(): Observable<Cifra[]> {
    return this.http.get<Cifra[]>(`${this.api}/favoritos`);
  }
}
