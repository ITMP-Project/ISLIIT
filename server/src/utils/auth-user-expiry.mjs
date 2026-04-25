const DEFAULT_AUTH_USER_TTL_DAYS = 5;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const normalizeRoleNames = (roles = []) =>
  roles
    .map((role) => String(role ?? "").trim().toLowerCase())
    .filter(Boolean);

export const getAuthUserTtlDays = () => {
  const raw = Number(process.env.AUTH_USER_TTL_DAYS ?? DEFAULT_AUTH_USER_TTL_DAYS);
  if (!Number.isFinite(raw)) return DEFAULT_AUTH_USER_TTL_DAYS;
  return Math.max(0, Math.floor(raw));
};

export const shouldExpireAuthUser = (roles = []) => {
  const normalizedRoles = normalizeRoleNames(roles);
  if (!normalizedRoles.length) return true;
  return normalizedRoles.every((role) => role === "user");
};

export const getAuthUserExpiresAt = (roles = [], from = new Date()) => {
  const ttlDays = getAuthUserTtlDays();
  if (ttlDays <= 0 || !shouldExpireAuthUser(roles)) {
    return null;
  }

  return new Date(from.getTime() + ttlDays * MILLISECONDS_PER_DAY);
};

export const isAuthUserExpired = (expiresAt, now = new Date()) => {
  if (!expiresAt) return false;

  const parsedExpiry = expiresAt instanceof Date ? expiresAt : new Date(expiresAt);
  if (Number.isNaN(parsedExpiry.getTime())) {
    return false;
  }

  return parsedExpiry.getTime() <= now.getTime();
};

export async function ensureAuthUserExpiryIndexes(db) {
  await db.collection("auth_users").createIndex(
    { expiresAt: 1 },
    {
      name: "auth_users_expires_at_ttl",
      expireAfterSeconds: 0,
    }
  );
}
