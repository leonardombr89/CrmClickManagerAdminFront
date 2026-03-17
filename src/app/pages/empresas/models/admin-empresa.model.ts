export type AdminEmpresaStatus = 'ATIVA' | 'ONBOARDING' | 'BAIXA_ATIVIDADE';

export interface AdminEmpresaResumo {
  id: number;
  nome: string;
  segmento: string;
  status: AdminEmpresaStatus;
  plano: string;
  cidade: string;
  usuarios: number;
  ultimaAtividadeEm: string | null;
  onboardingPercentual: number;
  responsavelNome: string | null;
  responsavelEmail: string | null;
  responsavelTelefone: string | null;
  mrr: number;
}

export interface AdminListaEmpresasResponse {
  pagina: number;
  tamanho: number;
  totalItens: number;
  totalPaginas: number;
  itens: AdminEmpresaResumo[];
}

export interface AdminEmpresasResumoResponse {
  total: number;
  ativas: number;
  onboarding: number;
  baixaAtividade: number;
}

export interface AdminEmpresaEndereco {
  cep: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
}

export interface AdminEmpresaDetalheResponse extends AdminEmpresaResumo {
  email: string | null;
  telefone: string | null;
  cnpj: string | null;
  ativa: boolean;
  dataCriacao: string | null;
  endereco: AdminEmpresaEndereco | null;
  modulos: string[];
  observacoes: string[];
}

export interface AdminListaEmpresasFiltros {
  busca?: string | null;
  status?: AdminEmpresaStatus | null;
  pagina?: number;
  tamanho?: number;
}
