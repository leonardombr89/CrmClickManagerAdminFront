export interface AuthTokens {
  accessToken: string;
  refreshToken?: string | null;
  tokenType?: string;
  expiresInMinutes?: number;
  username?: string;
}
