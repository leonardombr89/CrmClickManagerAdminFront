import { PrioridadeChamadoSuporte } from '../../suporte/models/chamado-suporte.model';

export type AdminDashboardModuloStatus = 'MVP' | 'EXPANSAO' | 'OPERACIONAL';
export type AdminDashboardAtividadeTipo = 'ONBOARDING' | 'ACESSO' | 'DEPLOY' | 'SUPORTE' | 'COMERCIAL';

export interface AdminDashboardPeriodo {
  inicio: string;
  fim: string;
  referencia: string;
}

export interface AdminDashboardVisaoGeral {
  totalClientes: number;
  clientesAtivos: number;
  novosClientesMes: number;
  usuariosProvisionados: number;
  saudeOperacaoPercentual: number;
  pendenciasCriticas: number;
}

export interface AdminDashboardCrescimentoCliente {
  mes: string;
  ano: number;
  novosClientes: number;
  totalClientesAtivos: number;
  mrr: number;
}

export interface AdminDashboardCrescimentoInsights {
  variacaoNovosClientesPercentual: number;
  clientesEmOnboarding: number;
  clientesEmRisco: number;
}

export interface AdminDashboardModulo {
  nome: string;
  coberturaPercentual: number;
  status: AdminDashboardModuloStatus;
  resumo: string;
}

export interface AdminDashboardAtividadeRecente {
  titulo: string;
  detalhe: string;
  tipo: AdminDashboardAtividadeTipo;
  ocorreuEm: string;
}

export interface AdminDashboardClienteObservacao {
  empresaId: number;
  empresaNome: string;
  status: string;
  contexto: string;
  acaoSugerida: string;
}

export interface AdminDashboardSuporteResumo {
  abertos: number;
  urgentes: number;
  aguardandoCliente: number;
  semRespostaAdmin: number;
}

export interface AdminDashboardChamadoRecente {
  chamadoId: number;
  assunto: string;
  empresaNome: string;
  prioridade: PrioridadeChamadoSuporte;
  status: string;
  atualizadoEm: string;
}

export interface AdminDashboardResumoResponse {
  periodo: AdminDashboardPeriodo;
  visaoGeral: AdminDashboardVisaoGeral;
  crescimentoClientes: AdminDashboardCrescimentoCliente[];
  crescimentoInsights: AdminDashboardCrescimentoInsights;
  modulos: AdminDashboardModulo[];
  atividadesRecentes: AdminDashboardAtividadeRecente[];
  clientesEmObservacao: AdminDashboardClienteObservacao[];
  suporteResumo: AdminDashboardSuporteResumo;
  chamadosRecentes: AdminDashboardChamadoRecente[];
}
