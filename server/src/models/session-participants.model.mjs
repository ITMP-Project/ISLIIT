const sessionParticipantFields = [
  "sessionId",
  "userId",
  "studentId",
  "year",
  "semester",
];

export function validateSessionParticipantPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  for (const field of sessionParticipantFields) {
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
    for (const field of sessionParticipantFields) {
      if (!value[field]) {
        errors.push(`${field} is required`);
      }
    }
  }

  return { 
    valid: errors.length === 0,
    value, 
    errors 
  };
}
