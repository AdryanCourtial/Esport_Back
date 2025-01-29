// src/types/express-session.d.ts
import * as expressSession from "express-session";

declare global {
  namespace Express {
    interface Session {
      user?: {
        id: string;
        username: string;
        discriminator: string;
        avatar: string;
        global_name: string;
        accent_color: number;
        banner_color: string;
        locale: string;
        mfa_enabled: boolean;
        premium_type: number;
        public_flags: number;
        flags: number;
      };
    }
  }
}
