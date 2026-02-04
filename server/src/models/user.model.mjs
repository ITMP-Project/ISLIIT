const userFields = ["name", "email", "password"];

export function validateUserPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  for (const field of userFields) {
    const hasField = Object.prototype.hasOwnProperty.call(payload ?? {}, field);
    if (!hasField) continue;

    const raw = String(payload[field]).trim();
    if (!raw) {
      errors.push(`${field} is required`);
    } else {
      value[field] = raw;
    }
  }

  if (!partial) {
    for (const field of userFields) {
      if (!value[field]) {
        errors.push(`${field} is required`);
      }
    }
  }

  return { valid: errors.length === 0, errors, value };
}
