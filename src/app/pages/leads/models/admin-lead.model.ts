export type AdminLeadStatus = 'NOVO' | 'EM_CONTATO' | 'QUALIFICADO' | 'CONVERTIDO' | 'DESCARTADO';
export type AdminLeadOrigem = 'NEWSLETTER' | 'FORM_CONTATO' | 'CTA_DEMO' | 'WHATSAPP';

export interface AdminLeadResumo {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  empresa: string | null;
  origem: AdminLeadOrigem;
  interesse: string | null;
  status: AdminLeadStatus;
  responsavelNome: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

export interface AdminListaLeadsResponse {
  pagina: number;
  tamanho: number;
  totalItens: number;
  totalPaginas: number;
  itens: AdminLeadResumo[];
}

export interface AdminLeadsResumoResponse {
  novos: number;
  emContato: number;
  qualificados: number;
  convertidos: number;
}

export interface AdminLeadDetalheResponse extends AdminLeadResumo {
  mensagem: string | null;
  tags: string[];
  observacoes: string[];
}

export interface AdminListaLeadsFiltros {
  busca?: string | null;
  status?: AdminLeadStatus | null;
  origem?: AdminLeadOrigem | null;
  pagina?: number;
  tamanho?: number;
}
