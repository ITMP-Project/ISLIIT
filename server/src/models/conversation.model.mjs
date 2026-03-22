export function validateConversationPayload(payload) {
    const errors = [];
    const value = {};

    const { student_id, helper_id } = payload || {};
    if (!student_id) errors.push("student_id is required");
    else value.student_id = String(student_id).trim();

    if (!helper_id) errors.push("helper_id is required");
    else value.helper_id = String(helper_id).trim();

    return { valid: errors.length === 0, errors, value };
}
