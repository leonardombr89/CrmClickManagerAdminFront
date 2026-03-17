import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import {
  AdminDashboardAtividadeRecente,
  AdminDashboardChamadoRecente,
  AdminDashboardClienteObservacao,
  AdminDashboardCrescimentoCliente,
  AdminDashboardModulo,
  AdminDashboardResumoResponse
} from '../models/admin-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private readonly endpoint = 'api/admin/dashboard/resumo';

  constructor(private readonly api: ApiService) {}

  buscarResumo$(): Observable<AdminDashboardResumoResponse> {
    return this.api.get<any>(this.endpoint).pipe(map((raw) => this.mapResumo(raw)));
  }

  private mapResumo(raw: any): AdminDashboardResumoResponse {
    return {
      periodo: {
        inicio: String(raw?.['periodo']?.['inicio'] || ''),
        fim: String(raw?.['periodo']?.['fim'] || ''),
        referencia: String(raw?.['periodo']?.['referencia'] || '')
      },
      visaoGeral: {
        totalClientes: Number(raw?.['visaoGeral']?.['totalClientes'] || 0),
        clientesAtivos: Number(raw?.['visaoGeral']?.['clientesAtivos'] || 0),
        novosClientesMes: Number(raw?.['visaoGeral']?.['novosClientesMes'] || 0),
        usuariosProvisionados: Number(raw?.['visaoGeral']?.['usuariosProvisionados'] || 0),
        saudeOperacaoPercentual: Number(raw?.['visaoGeral']?.['saudeOperacaoPercentual'] || 0),
        pendenciasCriticas: Number(raw?.['visaoGeral']?.['pendenciasCriticas'] || 0)
      },
      crescimentoClientes: Array.isArray(raw?.['crescimentoClientes'])
        ? raw['crescimentoClientes'].map((item: any) => this.mapCrescimento(item))
        : [],
      crescimentoInsights: {
        variacaoNovosClientesPercentual: Number(raw?.['crescimentoInsights']?.['variacaoNovosClientesPercentual'] || 0),
        clientesEmOnboarding: Number(raw?.['crescimentoInsights']?.['clientesEmOnboarding'] || 0),
        clientesEmRisco: Number(raw?.['crescimentoInsights']?.['clientesEmRisco'] || 0)
      },
      modulos: Array.isArray(raw?.['modulos']) ? raw['modulos'].map((item: any) => this.mapModulo(item)) : [],
      atividadesRecentes: Array.isArray(raw?.['atividadesRecentes'])
        ? raw['atividadesRecentes'].map((item: any) => this.mapAtividade(item))
        : [],
      clientesEmObservacao: Array.isArray(raw?.['clientesEmObservacao'])
        ? raw['clientesEmObservacao'].map((item: any) => this.mapClienteObservacao(item))
        : [],
      suporteResumo: {
        abertos: Number(raw?.['suporteResumo']?.['abertos'] || 0),
        urgentes: Number(raw?.['suporteResumo']?.['urgentes'] || 0),
        aguardandoCliente: Number(raw?.['suporteResumo']?.['aguardandoCliente'] || 0),
        semRespostaAdmin: Number(raw?.['suporteResumo']?.['semRespostaAdmin'] || 0)
      },
      chamadosRecentes: Array.isArray(raw?.['chamadosRecentes'])
        ? raw['chamadosRecentes'].map((item: any) => this.mapChamadoRecente(item))
        : []
    };
  }

  private mapCrescimento(raw: any): AdminDashboardCrescimentoCliente {
    return {
      mes: String(raw?.['mes'] || ''),
      ano: Number(raw?.['ano'] || 0),
      novosClientes: Number(raw?.['novosClientes'] || 0),
      totalClientesAtivos: Number(raw?.['totalClientesAtivos'] || 0),
      mrr: Number(raw?.['mrr'] || 0)
    };
  }

  private mapModulo(raw: any): AdminDashboardModulo {
    return {
      nome: String(raw?.['nome'] || ''),
      coberturaPercentual: Number(raw?.['coberturaPercentual'] || 0),
      status: String(raw?.['status'] || 'MVP').toUpperCase() as any,
      resumo: String(raw?.['resumo'] || '')
    };
  }

  private mapAtividade(raw: any): AdminDashboardAtividadeRecente {
    return {
      titulo: String(raw?.['titulo'] || ''),
      detalhe: String(raw?.['detalhe'] || ''),
      tipo: String(raw?.['tipo'] || 'SUPORTE').toUpperCase() as any,
      ocorreuEm: String(raw?.['ocorreuEm'] || '')
    };
  }

  private mapClienteObservacao(raw: any): AdminDashboardClienteObservacao {
    return {
      empresaId: Number(raw?.['empresaId'] || 0),
      empresaNome: String(raw?.['empresaNome'] || ''),
      status: String(raw?.['status'] || ''),
      contexto: String(raw?.['contexto'] || ''),
      acaoSugerida: String(raw?.['acaoSugerida'] || '')
    };
  }

  private mapChamadoRecente(raw: any): AdminDashboardChamadoRecente {
    return {
      chamadoId: Number(raw?.['chamadoId'] || 0),
      assunto: String(raw?.['assunto'] || ''),
      empresaNome: String(raw?.['empresaNome'] || ''),
      prioridade: String(raw?.['prioridade'] || 'MEDIA').toUpperCase() as any,
      status: String(raw?.['status'] || '').toUpperCase(),
      atualizadoEm: String(raw?.['atualizadoEm'] || '')
    };
  }
}
