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
  AdminEmpresaDetalheResponse,
  AdminEmpresasResumoResponse,
  AdminEmpresaResumo,
  AdminEmpresaStatus
} from './models/admin-empresa.model';
import { AdminEmpresasService } from './services/admin-empresas.service';

@Component({
  selector: 'app-empresas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TablerIconsModule, MaterialModule],
  templateUrl: './empresas-admin.component.html',
  styleUrl: './empresas-admin.component.scss'
})
export class EmpresasAdminComponent implements OnInit {
  readonly statusOptions: Array<AdminEmpresaStatus | 'TODAS'> = ['TODAS', 'ATIVA', 'ONBOARDING', 'BAIXA_ATIVIDADE'];

  carregandoResumo = false;
  carregandoLista = false;
  carregandoDetalhe = false;

  busca = '';
  statusFiltro: AdminEmpresaStatus | 'TODAS' = 'TODAS';
  pagina = 0;
  tamanho = 20;
  totalItens = 0;
  totalPaginas = 0;

  resumo: AdminEmpresasResumoResponse = {
    total: 0,
    ativas: 0,
    onboarding: 0,
    baixaAtividade: 0
  };

  empresas: AdminEmpresaResumo[] = [];
  empresaSelecionada: AdminEmpresaDetalheResponse | null = null;

  constructor(
    private readonly empresasService: AdminEmpresasService,
    private readonly toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.carregarResumo();
    this.carregarLista(true);
  }

  aplicarFiltros(): void {
    this.pagina = 0;
    this.carregarLista(true, this.empresaSelecionada?.id ?? null);
  }

  limparFiltros(): void {
    this.busca = '';
    this.statusFiltro = 'TODAS';
    this.pagina = 0;
    this.carregarLista(true);
  }

  alterarPagina(event: PageEvent): void {
    this.pagina = event.pageIndex;
    this.tamanho = event.pageSize;
    this.carregarLista(true, this.empresaSelecionada?.id ?? null);
  }

  selecionarEmpresa(empresa: AdminEmpresaResumo): void {
    this.carregarDetalhe(empresa.id);
  }

  get resumoResultados(): string {
    return `${this.totalItens} empresa(s) encontrada(s)`;
  }

  statusLabel(status: AdminEmpresaStatus): string {
    return {
      ATIVA: 'Ativa',
      ONBOARDING: 'Onboarding',
      BAIXA_ATIVIDADE: 'Baixa atividade'
    }[status];
  }

  statusClass(status: AdminEmpresaStatus): string {
    return `status-${status.toLowerCase()}`;
  }

  dataRelativa(iso?: string | null): string {
    if (!iso) {
      return 'Sem atividade';
    }

    const date = new Date(iso);
    const diffMs = Date.now() - date.getTime();
    const min = Math.floor(diffMs / 60000);
    if (min < 1) return 'Agora';
    if (min < 60) return `${min} min atrás`;
    const h = Math.floor(min / 60);
    if (h < 24) return `${h}h atrás`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d} dia(s) atrás`;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(valor || 0);
  }

  enderecoCompleto(): string {
    const endereco = this.empresaSelecionada?.endereco;
    if (!endereco) {
      return 'Não informado';
    }

    return [
      endereco.logradouro,
      endereco.numero,
      endereco.complemento,
      endereco.bairro,
      endereco.cidade,
      endereco.estado
    ].filter(Boolean).join(', ') || 'Não informado';
  }

  private carregarResumo(): void {
    this.carregandoResumo = true;
    this.empresasService.buscarResumo$()
      .pipe(finalize(() => (this.carregandoResumo = false)))
      .subscribe({
        next: (resumo) => {
          this.resumo = resumo;
        },
        error: (err) => {
          this.toastr.error(err?.userMessage || 'Não foi possível carregar o resumo das empresas.');
        }
      });
  }

  private carregarLista(resolverSelecao = false, empresaId: number | null = null): void {
    this.carregandoLista = true;

    this.empresasService.listar$({
      busca: this.busca || null,
      status: this.statusFiltro === 'TODAS' ? null : this.statusFiltro,
      pagina: this.pagina,
      tamanho: this.tamanho
    })
      .pipe(finalize(() => (this.carregandoLista = false)))
      .subscribe({
        next: (res) => {
          this.empresas = res.itens || [];
          this.pagina = res.pagina;
          this.tamanho = res.tamanho;
          this.totalItens = res.totalItens;
          this.totalPaginas = res.totalPaginas;

          if (resolverSelecao) {
            this.resolverSelecao(empresaId);
          }
        },
        error: (err) => {
          this.toastr.error(err?.userMessage || 'Não foi possível carregar a lista de empresas.');
        }
      });
  }

  private resolverSelecao(empresaId: number | null): void {
    const idSelecionado = empresaId && this.empresas.some((item) => item.id === empresaId)
      ? empresaId
      : this.empresas[0]?.id;

    if (idSelecionado) {
      this.carregarDetalhe(idSelecionado);
    } else {
      this.empresaSelecionada = null;
    }
  }

  private carregarDetalhe(id: number): void {
    this.carregandoDetalhe = true;

    this.empresasService.buscarPorId$(id)
      .pipe(finalize(() => (this.carregandoDetalhe = false)))
      .subscribe({
        next: (empresa) => {
          this.empresaSelecionada = empresa;
        },
        error: (err) => {
          this.toastr.error(err?.userMessage || 'Não foi possível carregar o detalhe da empresa.');
        }
      });
  }
}
