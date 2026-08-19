import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChordDiagram } from '../models/chord-diagram.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChordDiagramService {
  private readonly api = `${environment.apiUrl}/api/acordes`;
  private readonly http = inject(HttpClient);

  listar(): Observable<ChordDiagram[]> {
    return this.http.get<ChordDiagram[]>(this.api);
  }

  buscarPorId(id: number): Observable<ChordDiagram> {
    return this.http.get<ChordDiagram>(`${this.api}/${id}`);
  }

  criar(acorde: ChordDiagram): Observable<ChordDiagram> {
    return this.http.post<ChordDiagram>(this.api, acorde);
  }

  atualizar(id: number, acorde: ChordDiagram): Observable<ChordDiagram> {
    return this.http.put<ChordDiagram>(`${this.api}/${id}`, acorde);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  buscar(query: string): Observable<ChordDiagram[]> {
    const params = new HttpParams().set('q', query);
    return this.http.get<ChordDiagram[]>(`${this.api}/search`, { params });
  }

  filtrarPorInstrumento(instrumento: string): Observable<ChordDiagram[]> {
    return this.http.get<ChordDiagram[]>(`${this.api}/instrumento/${instrumento}`);
  }
}
