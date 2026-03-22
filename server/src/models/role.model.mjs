const roleFields = ["name"];

export const normalizeRoleName = (value) => String(value ?? "").trim().toLowerCase();

export function validateRolePayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  for (const field of roleFields) {
    const hasField = Object.prototype.hasOwnProperty.call(payload ?? {}, field);
    if (!hasField) continue;

    const raw = String(payload[field]).trim();
    if (!raw) {
      errors.push(`${field} is required`);
    } else {
      value[field] = normalizeRoleName(raw);
    }
  }

  if (!partial) {
    for (const field of roleFields) {
      if (value[field] === undefined || value[field] === null || value[field] === "") {
        errors.push(`${field} is required`);
      }
    }
  }

  return { valid: errors.length === 0, errors, value };
}

export function validateRolesList(input, { allowEmpty = true } = {}) {
  const errors = [];

  if (!Array.isArray(input)) {
    return { valid: false, errors: ["roles must be an array"], roles: [] };
  }

  const roles = [];
  for (const entry of input) {
    const name = normalizeRoleName(entry);
    if (!name) {
      errors.push("role name must be non-empty");
      continue;
    }
    if (!roles.includes(name)) {
      roles.push(name);
    }
  }

  if (!allowEmpty && roles.length === 0) {
    errors.push("at least one role is required");
  }

  return { valid: errors.length === 0, errors, roles };
}
