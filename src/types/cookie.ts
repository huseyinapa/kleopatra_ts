export type CookiePayload = {
  success: boolean;
  payload?: Record<string, unknown>;
  message?: string;
  error?: string;
};

export type CookieUser = {
  sub: number;
  email: string;
  permission: string;
} | null;
