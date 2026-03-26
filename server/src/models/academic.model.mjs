export const helperFields = [
  "student_id",
  "name",
  "contact_no",
  "year_of_study",
  "module_id",
  "introduction",
  "status" // pending, approved, rejected
];

export function validateAcademicHelperPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  for (const field of helperFields) {
    const hasField = Object.prototype.hasOwnProperty.call(payload ?? {}, field);
    if (!hasField) continue;

    let raw = payload[field];

    if (["student_id", "name", "contact_no", "year_of_study", "module_id", "introduction"].includes(field)) {
      raw = String(raw).trim();
      if (!raw) {
        errors.push(`${field} is required`);
        continue;
      }

      if (["student_id", "contact_no"].includes(field) && !/^\d{10}$/.test(raw)) {
        errors.push(`${field} must be exactly 10 digits`);
        continue;
      }

      value[field] = raw;
      continue;
    }

    if (field === "status") {
      raw = String(raw).trim();
      if (!["pending", "approved", "rejected"].includes(raw)) {
        errors.push("status must be pending, approved, or rejected");
        continue;
      }
      value[field] = raw;
      continue;
    }
  }

  if (!partial) {
    for (const field of ["student_id", "name", "contact_no", "year_of_study", "module_id", "introduction"]) {
      if (!value[field] && !errors.some(e => e.includes(field))) {
        errors.push(`${field} is required`);
      }
    }
  }

  return { valid: errors.length === 0, errors, value };
}

export function validateFacultyPayload(payload) {
  const errors = [];
  const value = {};
  let raw = payload?.name;
  if (!raw || !String(raw).trim()) {
    errors.push("name is required for Faculty");
  } else {
    value.name = String(raw).trim();
  }
  return { valid: errors.length === 0, errors, value };
}

export function validateSpecializationPayload(payload) {
  const errors = [];
  const value = {};
  if (!payload?.name || !String(payload.name).trim()) errors.push("name is required");
  else value.name = String(payload.name).trim();

  if (!payload?.faculty_id || !String(payload.faculty_id).trim()) errors.push("faculty_id is required");
  else value.faculty_id = String(payload.faculty_id).trim();

  return { valid: errors.length === 0, errors, value };
}

export function validateModulePayload(payload) {
  const errors = [];
  const value = {};
  const requiredFields = ["name", "faculty_id", "spec_id", "year", "semester"];

  for (const field of requiredFields) {
    if (!payload?.[field] || !String(payload[field]).trim()) {
      errors.push(`${field} is required`);
    } else {
      value[field] = String(payload[field]).trim();
    }
  }

  return { valid: errors.length === 0, errors, value };
}
