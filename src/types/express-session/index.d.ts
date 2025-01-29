// src/types/express-session.d.ts
declare namespace Express {
  export interface Session {
    user?: {
      id: string;
      username: string;
      avatar: string | null;
      global_name: string | null;
      discriminator: string;
      accent_color: number;
      banner_color: string | null;
      locale: string;
      mfa_enabled: boolean;
      premium_type: number;
      public_flags: number;
      flags: number;
    };
  }
}
