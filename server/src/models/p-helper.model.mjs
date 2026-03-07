const pHelperFields = [
  "student_id",
  "name",
  "bio",
  "profile_picture",
  "availability_status",
  "verified_status",
  "onboarding_status",
];

const availabilityOptions = ["active", "busy", "offline"];
const onboardingOptions = ["pending", "approved", "rejected"];

export function validatePHelperPayload(payload, { partial = false } = {}) {
  const errors = [];
  const value = {};

  for (const field of pHelperFields) {
    const hasField = Object.prototype.hasOwnProperty.call(payload ?? {}, field);
    if (!hasField) continue;

    let raw = payload[field];

    // student_id
    if (field === "student_id") {
      raw = String(raw).trim();
      if (!raw) {
        errors.push("student_id is required");
        continue;
      }
      value[field] = raw;
      continue;
    }

    // name
    if (field === "name") {
      raw = String(raw).trim();
      if (!raw) {
        errors.push("name is required");
        continue;
      }
      value[field] = raw;
      continue;
    }

    // bio
    if (field === "bio") {
      raw = String(raw).trim();
      if (!raw) {
        errors.push("bio is required");
        continue;
      }
      value[field] = raw;
      continue;
    }

    // profile_picture
    if (field === "profile_picture") {
      value[field] = String(raw).trim();
      continue;
    }

    // availability_status
    if (field === "availability_status") {
      raw = String(raw).trim();
      if (!availabilityOptions.includes(raw)) {
        errors.push(
          `availability_status must be one of: ${availabilityOptions.join(", ")}`
        );
        continue;
      }
      value[field] = raw;
      continue;
    }

    // verified_status
    if (field === "verified_status") {
      value[field] = Boolean(raw);
      continue;
    }

    // onboarding_status
    if (field === "onboarding_status") {
      raw = String(raw).trim();
      if (!onboardingOptions.includes(raw)) {
        errors.push(
          `onboarding_status must be one of: ${onboardingOptions.join(", ")}`
        );
        continue;
      }
      value[field] = raw;
      continue;
    }
  }

  if (!partial) {
    for (const field of ["student_id", "name", "bio"]) {
      if (!value[field]) {
        errors.push(`${field} is required`);
      }
    }
  }

  return { valid: errors.length === 0, errors, value };
}