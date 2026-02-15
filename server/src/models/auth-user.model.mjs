const authUserFields = ["username", "password"];

export function validateAuthUserPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  for (const field of authUserFields) {
    const hasField = Object.prototype.hasOwnProperty.call(payload ?? {}, field);
    if (!hasField) continue;

    const raw = String(payload[field]).trim();
    if (!raw) {
      errors.push(`${field} is required`);
      continue;
    }

    value[field] = raw;
  }

  if (!partial) {
    for (const field of authUserFields) {
      if (value[field] === undefined || value[field] === null || value[field] === "") {
        errors.push(`${field} is required`);
      }
    }
  }

  return { valid: errors.length === 0, errors, value };
}
