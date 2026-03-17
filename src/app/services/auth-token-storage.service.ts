import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthTokenStorageService {
  private readonly ACCESS_TOKEN_KEY = 'admin_access_token';
  private readonly REFRESH_TOKEN_KEY = 'admin_refresh_token';
  private readonly USERNAME_KEY = 'admin_username';
  private storage: Storage = sessionStorage;

  constructor() {
    // If the user chose "remember me" previously, default to localStorage.
    if (localStorage.getItem(this.ACCESS_TOKEN_KEY)) {
      this.storage = localStorage;
    }
  }

  usarLocalStorage(): void {
    this.storage = localStorage;
  }

  usarSessionStorage(): void {
    this.storage = sessionStorage;
  }

  salvarTokens(accessToken: string, refreshToken?: string | null, username?: string | null): void {
    this.storage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      this.storage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    } else {
      this.storage.removeItem(this.REFRESH_TOKEN_KEY);
    }
    if (username) {
      this.storage.setItem(this.USERNAME_KEY, username);
    }
  }

  atualizarAccessToken(token: string): void {
    this.storage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  salvarUsername(username: string): void {
    this.storage.setItem(this.USERNAME_KEY, username);
  }

  getAccessToken(): string | null {
    return this.storage.getItem(this.ACCESS_TOKEN_KEY) || localStorage.getItem(this.ACCESS_TOKEN_KEY) || sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return this.storage.getItem(this.REFRESH_TOKEN_KEY) || localStorage.getItem(this.REFRESH_TOKEN_KEY) || sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getUsername(): string | null {
    return this.storage.getItem(this.USERNAME_KEY) || localStorage.getItem(this.USERNAME_KEY) || sessionStorage.getItem(this.USERNAME_KEY);
  }

  getToken(): string | null {
    return this.getAccessToken();
  }

  limparTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USERNAME_KEY);
    sessionStorage.removeItem(this.USERNAME_KEY);
  }

  // Mantém compatibilidade com o nome antigo.
  limparToken(): void {
    this.limparTokens();
  }
}
