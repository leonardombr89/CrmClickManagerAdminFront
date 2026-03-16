import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario/usuario.model';
import { AuthApiService } from './auth-api.service';
import { AuthTokenStorageService } from './auth-token-storage.service';
import { AuthTokens } from '../models/auth-tokens.interface';
import { decodeToken } from '../utils/token.util';
import { JwtPayload } from '../pages/authentication/jwt-payload.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private jwtPayload: JwtPayload | null = null;
  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  readonly usuario$ = this.usuarioSubject.asObservable();

  constructor(
    private authApi: AuthApiService,
    private tokenStorage: AuthTokenStorageService,
    private router: Router
  ) {
    this.initJwt();
  }

  login(username: string, password: string, lembrar = false): Observable<Usuario> {
    lembrar ? this.tokenStorage.usarLocalStorage() : this.tokenStorage.usarSessionStorage();

    return this.authApi.login(username, password).pipe(
      tap((tokens) => this.persistirTokens(tokens, username)),
      tap(() => void this.router.navigateByUrl('/chamados')),
      map(() => {
        const usuario = this.criarUsuarioAdmin();
        this.usuarioSubject.next(usuario);
        return usuario;
      })
    );
  }

  carregarUsuarioCompleto(): Observable<Usuario> {
    if (!this.getToken()) {
      this.usuarioSubject.next(null);
      return of(null as unknown as Usuario);
    }

    const usuario = this.criarUsuarioAdmin();
    this.usuarioSubject.next(usuario);
    return of(usuario);
  }

  logout(): void {
    this.tokenStorage.limparTokens();
    this.jwtPayload = null;
    this.usuarioSubject.next(null);
    void this.router.navigateByUrl('/authentication/login');
  }

  temPermissao(_: string): boolean {
    return this.isAuthenticated();
  }

  temAlgumaPermissao(_: string[]): boolean {
    return this.isAuthenticated();
  }

  isAuthenticated(): boolean {
    const token = this.tokenStorage.getToken();
    return !!token && !this.isAccessTokenExpired(token);
  }

  getUsuario(): Usuario {
    const usuario = this.usuarioSubject.value ?? this.criarUsuarioAdmin();
    this.usuarioSubject.next(usuario);
    return usuario;
  }

  getUsuarioNome(): string | null {
    return this.usuarioSubject.value?.nome || this.tokenStorage.getUsername() || null;
  }

  getJwtPayload(): JwtPayload | null {
    return this.jwtPayload;
  }

  getJwtId(): number | null {
    return this.jwtPayload?.id || null;
  }

  getToken(): string | null {
    return this.tokenStorage.getAccessToken();
  }

  getRefreshToken(): string | null {
    return this.tokenStorage.getRefreshToken();
  }

  register(_: string, __: string, ___: string): Observable<any> {
    return throwError(() => new Error('Cadastro admin não disponível neste front.'));
  }

  recuperarSenha(_: string): Observable<void> {
    return throwError(() => new Error('Recuperação de senha admin não disponível neste front.'));
  }

  resetarSenha(_: string, __: string): Observable<void> {
    return throwError(() => new Error('Reset de senha admin não disponível neste front.'));
  }

  verificarSeTemUsuarios(): Observable<boolean> {
    return of(true);
  }

  refreshToken(): Observable<AuthTokens> {
    return throwError(() => new Error('Refresh token admin não disponível.'));
  }

  isAccessTokenExpired(token: string): boolean {
    try {
      const payload = decodeToken(token);
      if (!payload?.exp) {
        return false;
      }

      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch {
      return false;
    }
  }

  hasValidRefreshToken(): boolean {
    return false;
  }

  private initJwt(): void {
    const token = this.tokenStorage.getToken();
    if (!token) {
      this.jwtPayload = null;
      this.usuarioSubject.next(null);
      return;
    }

    try {
      this.jwtPayload = decodeToken(token);
    } catch {
      this.jwtPayload = null;
    }

    this.usuarioSubject.next(this.criarUsuarioAdmin());
  }

  private persistirTokens(tokens: AuthTokens, usernameFallback?: string): void {
    const username = tokens.username || usernameFallback || '';
    this.tokenStorage.salvarTokens(tokens.accessToken, tokens.refreshToken, username);
    if (username) {
      this.tokenStorage.salvarUsername(username);
    }

    try {
      this.jwtPayload = decodeToken(tokens.accessToken);
    } catch {
      this.jwtPayload = null;
    }
  }

  private criarUsuarioAdmin(): Usuario {
    const nome = this.tokenStorage.getUsername() || this.jwtPayload?.nome || this.jwtPayload?.sub || 'Admin';
    return {
      id: this.jwtPayload?.id,
      nome,
      username: nome,
      perfil: {
        id: 0,
        nome: 'Administrador'
      } as any
    };
  }
}
