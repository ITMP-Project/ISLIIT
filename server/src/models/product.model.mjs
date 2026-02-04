const productFields = ["name", "category", "status"];

const toNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

export function validateProductPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  for (const field of productFields) {
    const hasField = Object.prototype.hasOwnProperty.call(payload ?? {}, field);
    if (!hasField) continue;

    const raw = String(payload[field]).trim();
    if (!raw) {
      errors.push(`${field} is required`);
    } else {
      value[field] = raw;
    }
  }

  const hasPrice = Object.prototype.hasOwnProperty.call(payload ?? {}, "price");
  if (hasPrice) {
    const parsed = toNumber(payload.price);
    if (parsed === null) {
      errors.push("price must be a number");
    } else {
      value.price = parsed;
    }
  }

  const hasStock = Object.prototype.hasOwnProperty.call(payload ?? {}, "stock");
  if (hasStock) {
    const parsed = toNumber(payload.stock);
    if (parsed === null) {
      errors.push("stock must be a number");
    } else {
      value.stock = parsed;
    }
  }

  if (!partial) {
    const required = [...productFields, "price", "stock"];
    for (const field of required) {
      if (value[field] === undefined || value[field] === null || value[field] === "") {
        errors.push(`${field} is required`);
      }
    }
  }

  return { valid: errors.length === 0, errors, value };
}
