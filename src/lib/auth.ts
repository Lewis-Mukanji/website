// Simple password login for Mitchell's dashboard.
// The password lives in .env.local as ADMIN_PASSWORD (never in the code).
import crypto from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "nbm_admin";

function secret() {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function tokenFor(password: string) {
  return crypto.createHmac("sha256", secret()).update("admin:" + password).digest("hex");
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function isAdmin() {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const jar = await cookies();
  const value = jar.get(COOKIE)?.value;
  if (!value) return false;
  const good = tokenFor(expected);
  return value.length === good.length && crypto.timingSafeEqual(Buffer.from(value), Buffer.from(good));
}
