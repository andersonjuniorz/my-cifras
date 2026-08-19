export interface ChordDiagram {
  id?: number;
  nome: string;
  diagrama: string;
  instrumento: 'VIOLAO' | 'GUITARRA' | 'TECLADO';
  criadoEm?: string;
  atualizadoEm?: string;
}
