export type AdminLandingAcessoDeviceType =
  | 'DESKTOP'
  | 'MOBILE'
  | 'TABLET'
  | 'BOT'
  | 'OUTRO';

export interface AdminLandingQuantidadeItem {
  nome: string;
  quantidade: number;
}

export interface AdminLandingAcessosResumoResponse {
  totalAcessos: number;
  visitantesUnicos: number;
  totalLeads: number;
  taxaConversaoPercentual: number;
  desktop: number;
  mobile: number;
  tablet: number;
  bots: number;
  outros: number;
  navegadores: AdminLandingQuantidadeItem[];
  sistemasOperacionais: AdminLandingQuantidadeItem[];
  origens: AdminLandingQuantidadeItem[];
}

export interface AdminLandingAcessoItemResponse {
  id: number;
  pagina: string;
  path: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  deviceType: AdminLandingAcessoDeviceType;
  sistemaOperacional: string | null;
  navegador: string | null;
  bot: boolean;
  criadoEm: string;
}

export interface AdminListaLandingAcessosResponse {
  pagina: number;
  tamanho: number;
  totalItens: number;
  totalPaginas: number;
  itens: AdminLandingAcessoItemResponse[];
}

export interface AdminListaLandingAcessosFiltros {
  busca?: string | null;
  deviceType?: AdminLandingAcessoDeviceType | null;
  pagina?: number;
  tamanho?: number;
}
