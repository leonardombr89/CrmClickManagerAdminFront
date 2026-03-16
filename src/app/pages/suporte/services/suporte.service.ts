import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import {
  AdminChamadoDetalhe,
  AdminChamadoResumo,
  AdminListaChamadosFiltros,
  AdminListaChamadosResponse,
  AdminMensagemChamado,
  AdminResponderChamadoRequest,
  StatusChamadoSuporte
} from '../models/chamado-suporte.model';

@Injectable({
  providedIn: 'root'
})
export class SuporteService {
  private readonly endpoint = 'api/admin/suporte/chamados';

  constructor(private readonly api: ApiService) {}

  listar$(filtros: AdminListaChamadosFiltros): Observable<AdminListaChamadosResponse> {
    let params = new HttpParams()
      .set('pagina', String(filtros.pagina ?? 0))
      .set('tamanho', String(filtros.tamanho ?? 20));

    if (filtros.status) {
      params = params.set('status', filtros.status);
    }

    if (filtros.empresaId != null) {
      params = params.set('empresaId', String(filtros.empresaId));
    }

    return this.api.get<any>(this.endpoint, params).pipe(map((raw) => this.mapPaginada(raw)));
  }

  buscarPorId$(id: number): Observable<AdminChamadoDetalhe> {
    return this.api.get<any>(`${this.endpoint}/${id}`).pipe(map((raw) => this.mapDetalhe(raw)));
  }

  responder$(id: number, payload: AdminResponderChamadoRequest): Observable<AdminChamadoDetalhe> {
    return this.api.post<any>(`${this.endpoint}/${id}/mensagens`, payload).pipe(map((raw) => this.mapDetalhe(raw)));
  }

  atualizarStatus$(id: number, status: StatusChamadoSuporte): Observable<AdminChamadoDetalhe> {
    return this.api.patch<any>(`${this.endpoint}/${id}/status`, { status }).pipe(map((raw) => this.mapDetalhe(raw)));
  }

  private mapPaginada(raw: any): AdminListaChamadosResponse {
    return {
      pagina: Number(raw?.['pagina'] || 0),
      tamanho: Number(raw?.['tamanho'] || 20),
      totalItens: Number(raw?.['totalItens'] || 0),
      totalPaginas: Number(raw?.['totalPaginas'] || 0),
      itens: Array.isArray(raw?.['itens']) ? raw['itens'].map((item: any) => this.mapResumo(item)) : []
    };
  }

  private mapDetalhe(raw: any): AdminChamadoDetalhe {
    return {
      ...this.mapResumo(raw),
      mensagens: Array.isArray(raw?.['mensagens']) ? raw['mensagens'].map((item: any) => this.mapMensagem(item)) : []
    };
  }

  private mapResumo(raw: any): AdminChamadoResumo {
    return {
      id: Number(raw?.['id'] || 0),
      empresaId: Number(raw?.['empresaId'] || 0),
      empresaNome: String(raw?.['empresaNome'] || ''),
      usuarioSolicitanteId: Number(raw?.['usuarioSolicitanteId'] || 0),
      usuarioSolicitanteNome: String(raw?.['usuarioSolicitanteNome'] || ''),
      assunto: String(raw?.['assunto'] || ''),
      categoria: String(raw?.['categoria'] || 'OUTRO').toUpperCase() as any,
      prioridade: String(raw?.['prioridade'] || 'MEDIA').toUpperCase() as any,
      status: String(raw?.['status'] || 'ABERTO').toUpperCase() as any,
      criadoEm: String(raw?.['criadoEm'] || ''),
      atualizadoEm: String(raw?.['atualizadoEm'] || ''),
      fechadoEm: raw?.['fechadoEm'] ?? null
    };
  }

  private mapMensagem(raw: any): AdminMensagemChamado {
    return {
      id: Number(raw?.['id'] || 0),
      autorUsuarioId: raw?.['autorUsuarioId'] != null ? Number(raw['autorUsuarioId']) : null,
      autorNome: String(raw?.['autorNome'] || ''),
      autorTipo: String(raw?.['autorTipo'] || 'CLIENTE').toUpperCase() as any,
      mensagem: String(raw?.['mensagem'] || ''),
      interna: Boolean(raw?.['interna']),
      criadaEm: String(raw?.['criadaEm'] || '')
    };
  }
}
