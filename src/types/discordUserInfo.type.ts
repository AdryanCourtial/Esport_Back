export type DiscordUserInfo = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
  accent_color: number;
  banner_color: string | null;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  public_flags: number;
  flags: number;
};
