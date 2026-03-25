export function validateMessagePayload(payload) {
    const errors = [];
    const value = {};

    const { conversation_id, sender_id, text } = payload || {};
    if (!conversation_id) errors.push("conversation_id is required");
    else value.conversation_id = String(conversation_id).trim();

    if (!sender_id) errors.push("sender_id is required");
    else value.sender_id = String(sender_id).trim();

    if (!text) errors.push("text is required");
    else value.text = String(text).trim();

    return { valid: errors.length === 0, errors, value };
}
