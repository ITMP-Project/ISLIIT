const timeTableFields = [
  "title",
  "type",
  "courseCode",
  "courseName",
  "date",
  "startTime",
  "endTime",
  "description",
  "createdBy",
];

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

export function validateTimeTablePayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  for (const field of timeTableFields) {
    const hasField = Object.prototype.hasOwnProperty.call(payload ?? {}, field);
    if (!hasField) continue;

    const raw = String(payload[field]).trim();
    if (!raw) {
      errors.push(`${field} is required`);
      continue;
    }

    if (field === "date" && !datePattern.test(raw)) {
      errors.push("date must be in YYYY-MM-DD format");
      continue;
    }

    if (
      (field === "startTime" || field === "endTime") &&
      !timePattern.test(raw)
    ) {
      errors.push(`${field} must be in HH:MM format`);
      continue;
    }

    value[field] = raw;
  }

  if (!partial) {
    for (const field of timeTableFields) {
      if (!value[field]) {
        errors.push(`${field} is required`);
      }
    }
  }

  return { valid: errors.length === 0, errors, value };
}
