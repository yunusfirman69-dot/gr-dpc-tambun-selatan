import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "pgr_admin_session";

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "pgr-tambun-selatan-dev-secret-key";
}

export function getAdminCredentials() {
  return {
    email: process.env.ADMIN_EMAIL || "admin@tambunselatan.local",
    password: process.env.ADMIN_PASSWORD || "GerakanRakyat2026!",
  };
}

export function signSessionToken(email: string): string {
  const payload = Buffer.from(
    JSON.stringify({ email, exp: Date.now() + 1000 * 60 * 60 * 24 })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): { email: string } | null {
  if (!token || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expectedSig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");

  if (sig.length !== expectedSig.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as { email?: string; exp?: number };
    if (!decoded.email || !decoded.exp || decoded.exp < Date.now()) {
      return null;
    }
    return { email: decoded.email };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}
