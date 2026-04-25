const DEFAULT_CONTENT_TTL_DAYS = 5;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const contentCollections = [
  "kuppi_sessions",
  "session_participants",
  "module_events",
  "comments",
  "peerpoint_marketplace",
  "peerpoint_student_uploads",
  "peerpoint_orders",
  "peerpoint_payments",
];

export const getContentTtlDays = () => {
  const raw = Number(process.env.CONTENT_TTL_DAYS ?? DEFAULT_CONTENT_TTL_DAYS);
  if (!Number.isFinite(raw)) return DEFAULT_CONTENT_TTL_DAYS;
  return Math.max(0, Math.floor(raw));
};

export const getContentExpiresAt = (from = new Date()) => {
  const ttlDays = getContentTtlDays();
  if (ttlDays <= 0) return null;
  return new Date(from.getTime() + ttlDays * MILLISECONDS_PER_DAY);
};

export async function ensureContentExpiryIndexes(db) {
  await Promise.all(
    contentCollections.map((collection) =>
      db.collection(collection).createIndex(
        { expiresAt: 1 },
        {
          name: `${collection}_expires_at_ttl`,
          expireAfterSeconds: 0,
        }
      )
    )
  );
}
