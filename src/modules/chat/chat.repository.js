const pool = require('../../db/pool');

async function createConversation(payload) {
  const { rows } = await pool.query(
    `INSERT INTO chat_conversations (id, job_id, created_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (job_id) DO UPDATE SET job_id = EXCLUDED.job_id
     RETURNING id, job_id, created_at`,
    [payload.id, payload.jobId]
  );
  return rows[0];
}

async function saveMessage(payload) {
  const { rows } = await pool.query(
    `INSERT INTO chat_messages (id, conversation_id, sender_id, message, message_type, is_read, created_at)
     VALUES ($1, $2, $3, $4, COALESCE($5, 'text'), false, NOW())
     RETURNING *`,
    [payload.id, payload.conversationId, payload.senderId, payload.message, payload.messageType]
  );
  return rows[0];
}

async function listMessages(conversationId) {
  const { rows } = await pool.query(
    `SELECT id, conversation_id, sender_id, message, message_type, is_read, created_at
     FROM chat_messages
     WHERE conversation_id = $1
     ORDER BY created_at ASC`,
    [conversationId]
  );
  return rows;
}

module.exports = { createConversation, saveMessage, listMessages };
