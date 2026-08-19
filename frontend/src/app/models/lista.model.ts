import { Cifra } from './cifra.model';

export interface Lista {
  id?: number;
  nome: string;
  descricao?: string;
  cifras?: Cifra[];
  criadoEm?: string;
  atualizadoEm?: string;
}
