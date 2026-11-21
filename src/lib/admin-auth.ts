import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "pgr_admin_session";
export const MEMBER_COOKIE_NAME = "pgr_member_session";
export const PRIMARY_APPROVER_EMAIL = "gerakanrakyattamsel@gmail.com";

export type AdminRole = "super_admin" | "editor";

export interface AdminSession {
  email: string;
  role: AdminRole;
  name?: string;
}

export interface MemberSession {
  id: string;
  email: string;
  fullName: string;
}

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "pgr-tambun-selatan-dev-secret-key";
}

export function getAdminCredentials(): { email: string; password: string } | null {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return null;
  return { email, password };
}

export async function hashPassword(password: string): Promise<string> {
  const saltBytes = crypto.randomBytes(16);
  const saltHex = saltBytes.toString("hex");
  const keyMaterial = await crypto.webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derived = await crypto.webcrypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const hashHex = Buffer.from(derived).toString("hex");
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [saltHex, expectedHex] = parts;
  if (!saltHex || !expectedHex) return false;

  const saltBytes = Buffer.from(saltHex, "hex");
  const keyMaterial = await crypto.webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const derived = await crypto.webcrypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const actualBuf = Buffer.from(derived);
  const expectedBuf = Buffer.from(expectedHex, "hex");
  if (actualBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(actualBuf, expectedBuf);
}

export function signSessionToken(
  email: string,
  role: AdminRole = "super_admin",
  name?: string
): string {
  const payload = Buffer.from(
    JSON.stringify({
      type: "admin",
      email,
      role,
      name,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(
  token: string | undefined
): AdminSession | null {
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
    ) as {
      type?: string;
      email?: string;
      role?: AdminRole;
      name?: string;
      exp?: number;
    };
    if (
      decoded.type === "member" ||
      !decoded.email ||
      !decoded.exp ||
      decoded.exp < Date.now()
    ) {
      return null;
    }
    return {
      email: decoded.email,
      role: decoded.role || "super_admin",
      name: decoded.name,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}

export function signMemberSessionToken(member: MemberSession): string {
  const payload = Buffer.from(
    JSON.stringify({
      type: "member",
      id: member.id,
      email: member.email,
      fullName: member.fullName,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    })
  ).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(payload)
    .digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyMemberSessionToken(
  token: string | undefined
): MemberSession | null {
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
    ) as {
      type?: string;
      id?: string;
      email?: string;
      fullName?: string;
      exp?: number;
    };
    if (
      decoded.type !== "member" ||
      !decoded.id ||
      !decoded.email ||
      !decoded.fullName ||
      !decoded.exp ||
      decoded.exp < Date.now()
    ) {
      return null;
    }
    return {
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullName,
    };
  } catch {
    return null;
  }
}

export async function getMemberSession(): Promise<MemberSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(MEMBER_COOKIE_NAME)?.value;
  return verifyMemberSessionToken(token);
}
