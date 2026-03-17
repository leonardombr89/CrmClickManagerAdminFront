export type AdminAtividadeTipo = 'ONBOARDING' | 'ACESSO' | 'DEPLOY' | 'SUPORTE' | 'COMERCIAL';
export type AdminAtividadeModulo = 'ONBOARDING' | 'SUPORTE' | 'COMERCIAL' | 'BILLING' | 'OPERACAO';
export type AdminAtividadeCriticidade = 'INFO' | 'ATENCAO' | 'CRITICO';
export type AdminAtividadeEntidadeTipo = 'EMPRESA' | 'CHAMADO_SUPORTE' | null;

export interface AdminAtividadeEventoResponse {
  id: number;
  empresaId: number | null;
  empresaNome: string | null;
  tipo: AdminAtividadeTipo;
  modulo: AdminAtividadeModulo;
  criticidade: AdminAtividadeCriticidade;
  entidadeTipo: AdminAtividadeEntidadeTipo;
  entidadeId: number | null;
  titulo: string;
  detalhe: string;
  usuarioNome: string | null;
  visualizada: boolean;
  ocorreuEm: string;
}
