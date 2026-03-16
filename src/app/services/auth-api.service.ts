import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { AuthTokens } from '../models/auth-tokens.interface';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private api: ApiService) {}

  login(username: string, password: string): Observable<AuthTokens> {
    return this.api.post<AuthTokens>('admin/auth/login', { username, password });
  }

  refreshToken(refreshToken: string): Observable<AuthTokens> {
    return this.api.post<AuthTokens>('admin/auth/refresh', { refreshToken });
  }

  register(username: string, senha: string, nome: string): Observable<any> {
    return this.api.post('admin/auth/register', { username, senha, nome });
  }

  recuperarSenha(email: string): Observable<void> {
    return this.api.post<void>('admin/auth/recuperar-senha', { email });
  }

  resetarSenha(token: string, novaSenha: string): Observable<void> {
    return this.api.post<void>('admin/auth/resetar-senha', { token, novaSenha });
  }

  verificarSeTemUsuarios(): Observable<boolean> {
    return this.api.get<boolean>('admin/auth/tem-usuarios');
  }
}
