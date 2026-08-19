export interface Cifra {
  id?: number;
  titulo: string;
  artista: string;
  tom: string;
  instrumento: 'VIOLAO' | 'GUITARRA' | 'TECLADO';
  conteudo: string;
  fonte?: string;
  observacoes?: string;
  acordesIds?: string;
  favorito?: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}
