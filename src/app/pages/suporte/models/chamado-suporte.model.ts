export type StatusChamadoSuporte =
  | 'ABERTO'
  | 'EM_ANALISE'
  | 'AGUARDANDO_CLIENTE'
  | 'RESPONDIDO'
  | 'RESOLVIDO'
  | 'FECHADO';

export type CategoriaChamadoSuporte =
  | 'DUVIDA'
  | 'ERRO'
  | 'FINANCEIRO'
  | 'SUGESTAO'
  | 'ACESSO'
  | 'OUTRO';

export type PrioridadeChamadoSuporte =
  | 'BAIXA'
  | 'MEDIA'
  | 'ALTA'
  | 'URGENTE';

export type AutorMensagemChamadoSuporte =
  | 'CLIENTE'
  | 'ADMIN_SISTEMA';

export interface AdminChamadoResumo {
  id: number;
  empresaId: number;
  empresaNome: string;
  usuarioSolicitanteId: number;
  usuarioSolicitanteNome: string;
  assunto: string;
  categoria: CategoriaChamadoSuporte;
  prioridade: PrioridadeChamadoSuporte;
  status: StatusChamadoSuporte;
  criadoEm: string;
  atualizadoEm: string;
  fechadoEm: string | null;
}

export interface AdminMensagemChamado {
  id: number;
  autorUsuarioId: number | null;
  autorNome: string;
  autorTipo: AutorMensagemChamadoSuporte;
  mensagem: string;
  interna: boolean;
  criadaEm: string;
}

export interface AdminChamadoDetalhe extends AdminChamadoResumo {
  mensagens: AdminMensagemChamado[];
}

export interface AdminListaChamadosResponse {
  pagina: number;
  tamanho: number;
  totalItens: number;
  totalPaginas: number;
  itens: AdminChamadoResumo[];
}

export interface AdminListaChamadosFiltros {
  empresaId?: number | null;
  status?: StatusChamadoSuporte | null;
  pagina?: number;
  tamanho?: number;
}

export interface AdminResponderChamadoRequest {
  mensagem: string;
  interna: boolean;
}
