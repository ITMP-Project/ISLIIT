const studentRequestFields = [
  "username",
  "studentId",
  "faculty_id",
  "specialization_id",
  "year",
  "semester",
  "module_ids",
];

const normalizeString = (value) => String(value ?? "").trim();

const normalizeInt = (value) => {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;
  return Math.trunc(num);
};

export function validateStudentRequestPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  for (const field of studentRequestFields) {
    const hasField = Object.prototype.hasOwnProperty.call(payload ?? {}, field);
    if (!hasField) continue;

    if (field === "module_ids") {
      const rawList = Array.isArray(payload[field]) ? payload[field] : [];
      const safeList = rawList
        .map((entry) => normalizeString(entry))
        .filter((entry) => Boolean(entry));
      value[field] = safeList;
      continue;
    }

    if (field === "year" || field === "semester") {
      const parsed = normalizeInt(payload[field]);
      if (parsed === null) {
        errors.push(`${field} must be a number`);
        continue;
      }
      value[field] = parsed;
      continue;
    }

    const raw = normalizeString(payload[field]);
    if (field === "studentId") {
      if (raw) value[field] = raw;
      continue;
    }

    if (!raw) {
      errors.push(`${field} is required`);
      continue;
    }

    value[field] = raw;
  }

  if (!partial) {
    const required = ["username", "faculty_id", "specialization_id", "year", "semester"];
    for (const field of required) {
      if (value[field] === undefined || value[field] === null || value[field] === "") {
        errors.push(`${field} is required`);
      }
    }
  }

  if (value.year !== undefined && (value.year < 1 || value.year > 10)) {
    errors.push("year must be between 1 and 10");
  }

  if (
    value.semester !== undefined &&
    (value.semester < 1 || value.semester > 10)
  ) {
    errors.push("semester must be between 1 and 10");
  }

  return { valid: errors.length === 0, errors, value };
}

