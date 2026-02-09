const userFields = ["name"];

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

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

  const hasAge = Object.prototype.hasOwnProperty.call(payload ?? {}, "age");
  if (hasAge) {
    const parsed = toNumber(payload.age);
    if (parsed === null || !Number.isInteger(parsed)) {
      errors.push("age must be an integer");
    } else if (parsed < 0) {
      errors.push("age must be 0 or greater");
    } else {
      value.age = parsed;
    }
  }

  if (!partial) {
    const required = [...userFields, "age"];
    for (const field of required) {
      if (value[field] === undefined || value[field] === null || value[field] === "") {
        errors.push(`${field} is required`);
      }
    }
  }

  return { valid: errors.length === 0, errors, value };
}
