import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AdminAtividadeEventoResponse } from '../models/admin-atividade-evento.model';

@Injectable({
  providedIn: 'root'
})
export class AdminAtividadesService {
  private readonly endpoint = 'api/admin/atividades';

  constructor(private readonly api: ApiService) {}

  listar$(limite = 20): Observable<AdminAtividadeEventoResponse[]> {
    const limiteNormalizado = Math.max(1, Math.min(limite, 100));
    const params = new HttpParams().set('limite', String(limiteNormalizado));

    return this.api.get<any[]>(this.endpoint, params).pipe(
      map((raw) => Array.isArray(raw) ? raw.map((item) => this.mapEvento(item)) : [])
    );
  }

  private mapEvento(raw: any): AdminAtividadeEventoResponse {
    return {
      id: Number(raw?.['id'] || 0),
      empresaId: raw?.['empresaId'] != null ? Number(raw['empresaId']) : null,
      empresaNome: raw?.['empresaNome'] != null ? String(raw['empresaNome']) : null,
      tipo: String(raw?.['tipo'] || 'SUPORTE').toUpperCase() as any,
      modulo: String(raw?.['modulo'] || 'OPERACAO').toUpperCase() as any,
      criticidade: String(raw?.['criticidade'] || 'INFO').toUpperCase() as any,
      entidadeTipo: raw?.['entidadeTipo'] != null ? String(raw['entidadeTipo']).toUpperCase() as any : null,
      entidadeId: raw?.['entidadeId'] != null ? Number(raw['entidadeId']) : null,
      titulo: String(raw?.['titulo'] || ''),
      detalhe: String(raw?.['detalhe'] || ''),
      usuarioNome: raw?.['usuarioNome'] != null ? String(raw['usuarioNome']) : null,
      visualizada: Boolean(raw?.['visualizada']),
      ocorreuEm: String(raw?.['ocorreuEm'] || '')
    };
  }
}
