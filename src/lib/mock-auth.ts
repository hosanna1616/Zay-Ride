/**
 * MOCK AUTH — replace with `POST /v1/auth/login` + session/JWT.
 * Credentials default from `.env.local` (see `.env.example`); fallbacks keep demo working without a file.
 */

function envPrimaryEmail(): string {
  return process.env.NEXT_PUBLIC_MOCK_TRADER_EMAIL ?? "trader@zayride.et";
}

function envPrimaryPassword(): string {
  return process.env.NEXT_PUBLIC_MOCK_TRADER_PASSWORD ?? "Merkato2026!";
}

function envAltEmail(): string {
  return process.env.NEXT_PUBLIC_MOCK_ALT_EMAIL ?? "demo@merchant.et";
}

function envAltPassword(): string {
  return process.env.NEXT_PUBLIC_MOCK_ALT_PASSWORD ?? "zayride";
}

export function validateMockCredentials(email: string, password: string): boolean {
  const e = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return false;
  if (e === envPrimaryEmail().trim().toLowerCase() && password === envPrimaryPassword())
    return true;
  if (e === envAltEmail().trim().toLowerCase() && password === envAltPassword()) return true;
  return false;
}
