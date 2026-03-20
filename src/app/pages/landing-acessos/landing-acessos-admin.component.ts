import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import {
  AdminLandingAcessoDeviceType,
  AdminLandingAcessoItemResponse,
  AdminLandingAcessosResumoResponse,
  AdminLandingQuantidadeItem,
  AdminListaLandingAcessosResponse
} from './models/admin-landing-acesso.model';
import { AdminLandingAcessosService } from './services/admin-landing-acessos.service';

type LandingResumoCard = {
  label: string;
  value: string;
  helper: string;
  tone: 'primary' | 'success' | 'warning' | 'info';
};

@Component({
  selector: 'app-landing-acessos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TablerIconsModule, MaterialModule],
  templateUrl: './landing-acessos-admin.component.html',
  styleUrl: './landing-acessos-admin.component.scss'
})
export class LandingAcessosAdminComponent implements OnInit {
  readonly deviceOptions: Array<AdminLandingAcessoDeviceType | 'TODOS'> = [
    'TODOS',
    'DESKTOP',
    'MOBILE',
    'TABLET',
    'BOT',
    'OUTRO'
  ];

  carregandoResumo = false;
  carregandoLista = false;

  busca = '';
  deviceTypeFiltro: AdminLandingAcessoDeviceType | 'TODOS' = 'TODOS';
  pagina = 0;
  tamanho = 20;
  totalItens = 0;
  totalPaginas = 0;

  resumo: AdminLandingAcessosResumoResponse = {
    totalAcessos: 0,
    visitantesUnicos: 0,
    totalLeads: 0,
    taxaConversaoPercentual: 0,
    desktop: 0,
    mobile: 0,
    tablet: 0,
    bots: 0,
    outros: 0,
    navegadores: [],
    sistemasOperacionais: [],
    origens: []
  };

  acessos: AdminLandingAcessoItemResponse[] = [];

  constructor(
    private readonly landingAcessosService: AdminLandingAcessosService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarLista();
  }

  aplicarFiltros(): void {
    this.pagina = 0;
    this.carregarLista();
  }

  limparFiltros(): void {
    this.busca = '';
    this.deviceTypeFiltro = 'TODOS';
    this.pagina = 0;
    this.carregarLista();
  }

  alterarPagina(event: PageEvent): void {
    this.pagina = event.pageIndex;
    this.tamanho = event.pageSize;
    this.carregarLista();
  }

  get resumoCards(): LandingResumoCard[] {
    return [
      {
        label: 'Total de acessos',
        value: this.formatarNumero(this.resumo.totalAcessos),
        helper: 'eventos capturados da landing',
        tone: 'primary'
      },
      {
        label: 'Visitantes únicos',
        value: this.formatarNumero(this.resumo.visitantesUnicos),
        helper: 'alcance consolidado da página',
        tone: 'info'
      },
      {
        label: 'Leads gerados',
        value: this.formatarNumero(this.resumo.totalLeads),
        helper: 'entradas comerciais vinculadas',
        tone: 'success'
      },
      {
        label: 'Conversão',
        value: `${this.resumo.taxaConversaoPercentual.toFixed(2)}%`,
        helper: 'visita para lead no período atual',
        tone: 'warning'
      }
    ];
  }

  get dispositivos(): Array<{ label: string; quantidade: number; tone: string }> {
    return [
      { label: 'Desktop', quantidade: this.resumo.desktop, tone: 'primary' },
      { label: 'Mobile', quantidade: this.resumo.mobile, tone: 'success' },
      { label: 'Tablet', quantidade: this.resumo.tablet, tone: 'info' },
      { label: 'Bots', quantidade: this.resumo.bots, tone: 'warning' },
      { label: 'Outros', quantidade: this.resumo.outros, tone: 'neutral' }
    ];
  }

  get navegadoresTop(): AdminLandingQuantidadeItem[] {
    return this.resumo.navegadores.slice(0, 5);
  }

  get sistemasTop(): AdminLandingQuantidadeItem[] {
    return this.resumo.sistemasOperacionais.slice(0, 5);
  }

  get origensTop(): AdminLandingQuantidadeItem[] {
    return this.resumo.origens.slice(0, 5);
  }

  get resumoResultados(): string {
    return `${this.totalItens} acesso(s) encontrado(s)`;
  }

  deviceLabel(deviceType: AdminLandingAcessoDeviceType): string {
    return {
      DESKTOP: 'Desktop',
      MOBILE: 'Mobile',
      TABLET: 'Tablet',
      BOT: 'Bot',
      OUTRO: 'Outro'
    }[deviceType];
  }

  deviceClass(deviceType: AdminLandingAcessoDeviceType): string {
    return `device-${deviceType.toLowerCase()}`;
  }

  utmLabel(item: AdminLandingAcessoItemResponse): string {
    const partes = [item.utmSource, item.utmMedium, item.utmCampaign].filter(Boolean);
    return partes.length ? partes.join(' / ') : 'Sem UTM';
  }

  origemLabel(item: AdminLandingAcessoItemResponse): string {
    return item.referrer || item.utmSource || 'Direto';
  }

  formatarData(iso: string): string {
    if (!iso) {
      return 'Sem data';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(iso));
  }

  itemPercentual(item: AdminLandingQuantidadeItem[], quantidade: number): number {
    const base = item.reduce((acc, atual) => Math.max(acc, atual.quantidade), 0) || 1;
    return Math.max(10, Math.round((quantidade / base) * 100));
  }

  private carregarResumo(): void {
    this.carregandoResumo = true;
    this.landingAcessosService.buscarResumo$()
      .pipe(finalize(() => (this.carregandoResumo = false)))
      .subscribe({
        next: (resumo) => {
          this.resumo = resumo;
        },
        error: (err) => {
          this.toastr.error(err?.userMessage || 'Não foi possível carregar o resumo de acessos da landing.');
        }
      });
  }

  private carregarLista(): void {
    this.carregandoLista = true;

    this.landingAcessosService.listar$({
      busca: this.busca || null,
      deviceType: this.deviceTypeFiltro === 'TODOS' ? null : this.deviceTypeFiltro,
      pagina: this.pagina,
      tamanho: this.tamanho
    })
      .pipe(finalize(() => (this.carregandoLista = false)))
      .subscribe({
        next: (res: AdminListaLandingAcessosResponse) => {
          this.acessos = res.itens || [];
          this.pagina = res.pagina;
          this.tamanho = res.tamanho;
          this.totalItens = res.totalItens;
          this.totalPaginas = res.totalPaginas;
        },
        error: (err) => {
          this.toastr.error(err?.userMessage || 'Não foi possível carregar a lista de acessos da landing.');
        }
      });
  }

  private formatarNumero(valor: number): string {
    return new Intl.NumberFormat('pt-BR').format(valor || 0);
  }
}
