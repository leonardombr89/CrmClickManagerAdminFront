import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import {
  AdminLeadDetalheResponse,
  AdminLeadResumo,
  AdminLeadsResumoResponse,
  AdminListaLeadsFiltros,
  AdminListaLeadsResponse
} from '../models/admin-lead.model';

@Injectable({
  providedIn: 'root'
})
export class AdminLeadsService {
  private readonly endpoint = 'api/admin/leads';

  constructor(private readonly api: ApiService) {}

  listar$(filtros: AdminListaLeadsFiltros): Observable<AdminListaLeadsResponse> {
    let params = new HttpParams()
      .set('pagina', String(filtros.pagina ?? 0))
      .set('tamanho', String(filtros.tamanho ?? 20));

    if (filtros.busca?.trim()) {
      params = params.set('busca', filtros.busca.trim());
    }

    if (filtros.status) {
      params = params.set('status', filtros.status);
    }

    if (filtros.origem) {
      params = params.set('origem', filtros.origem);
    }

    return this.api.get<any>(this.endpoint, params).pipe(map((raw) => this.mapLista(raw)));
  }

  buscarPorId$(id: number): Observable<AdminLeadDetalheResponse> {
    return this.api.get<any>(`${this.endpoint}/${id}`).pipe(map((raw) => this.mapDetalhe(raw)));
  }

  buscarResumo$(): Observable<AdminLeadsResumoResponse> {
    return this.api.get<any>(`${this.endpoint}/resumo`).pipe(map((raw) => ({
      novos: Number(raw?.['novos'] || 0),
      emContato: Number(raw?.['emContato'] || 0),
      qualificados: Number(raw?.['qualificados'] || 0),
      convertidos: Number(raw?.['convertidos'] || 0)
    })));
  }

  atualizarStatus$(id: number, status: string): Observable<AdminLeadDetalheResponse | null> {
    return this.api.patch<any>(`${this.endpoint}/${id}/status`, { status }).pipe(
      map((raw) => raw?.['id'] ? this.mapDetalhe(raw) : null)
    );
  }

  adicionarObservacao$(id: number, observacao: string): Observable<AdminLeadDetalheResponse | null> {
    return this.api.post<any>(`${this.endpoint}/${id}/observacoes`, { observacao }).pipe(
      map((raw) => raw?.['id'] ? this.mapDetalhe(raw) : null)
    );
  }

  private mapLista(raw: any): AdminListaLeadsResponse {
    return {
      pagina: Number(raw?.['pagina'] || 0),
      tamanho: Number(raw?.['tamanho'] || 20),
      totalItens: Number(raw?.['totalItens'] || 0),
      totalPaginas: Number(raw?.['totalPaginas'] || 0),
      itens: Array.isArray(raw?.['itens']) ? raw['itens'].map((item: any) => this.mapResumo(item)) : []
    };
  }

  private mapDetalhe(raw: any): AdminLeadDetalheResponse {
    return {
      ...this.mapResumo(raw),
      mensagem: raw?.['mensagem'] != null ? String(raw['mensagem']) : null,
      tags: Array.isArray(raw?.['tags']) ? raw['tags'].map((item: any) => String(item)) : [],
      observacoes: Array.isArray(raw?.['observacoes']) ? raw['observacoes'].map((item: any) => String(item)) : []
    };
  }

  private mapResumo(raw: any): AdminLeadResumo {
    return {
      id: Number(raw?.['id'] || 0),
      nome: String(raw?.['nome'] || ''),
      email: String(raw?.['email'] || ''),
      telefone: raw?.['telefone'] != null ? String(raw['telefone']) : null,
      empresa: raw?.['empresa'] != null ? String(raw['empresa']) : null,
      origem: String(raw?.['origem'] || 'FORM_CONTATO').toUpperCase() as any,
      interesse: raw?.['interesse'] != null ? String(raw['interesse']) : null,
      status: String(raw?.['status'] || 'NOVO').toUpperCase() as any,
      responsavelNome: raw?.['responsavelNome'] != null ? String(raw['responsavelNome']) : null,
      criadoEm: String(raw?.['criadoEm'] || ''),
      atualizadoEm: String(raw?.['atualizadoEm'] || '')
    };
  }
}
