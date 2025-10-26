// dbHelpers.js
const { v4: uuidv4 } = require('uuid');
const { runExec, runQuery } = require('./database'); // Make sure runExec and runQuery are exported from database.js

/**
 * Adds a log entry into the logs table
 * @param {string} action - The action performed (CREATE_USER, UPDATE_MEMBER, etc.)
 * @param {string} user_id - ID of the user performing the action
 * @param {string|null} target_id - ID of the affected entity
 */
async function addLog(action, user_id, target_id = null) {
  const id = uuidv4();
  const created_at = new Date().toISOString();
  await runExec(
    `INSERT INTO logs (id, action, user_id, target_id, created_at) VALUES (?, ?, ?, ?, ?)`,
    [id, action, user_id, target_id, created_at]
  );
}

/**
 * Inserts a row into any table and automatically creates a log
 * @param {string} table - Table name
 * @param {Object} data - Object { column: value, ... }
 * @param {string} userId - ID of the user performing the action
 */
async function insertIntoTable(table, data, userId) {
  const columns = Object.keys(data);
  const placeholders = columns.map(() => '?').join(',');
  const values = Object.values(data);

  await runExec(
    `INSERT INTO ${table} (${columns.join(',')}) VALUES (${placeholders})`,
    values
  );

  const targetId = data.id || null;
  await addLog(`CREATE_${table.toUpperCase()}`, userId, targetId);
}

/**
 * Updates a row in any table and automatically creates a log
 * @param {string} table - Table name
 * @param {Object} data - Columns to update { col1: val1, col2: val2 }
 * @param {Object} where - WHERE conditions { id: 'xxx', ... }
 * @param {string} userId - ID of the user performing the action
 */
async function updateTable(table, data, where, userId) {
  const setClause = Object.keys(data).map(col => `${col}=?`).join(', ');
  const values = Object.values(data);

  const whereClause = Object.keys(where).map(col => `${col}=?`).join(' AND ');
  const whereValues = Object.values(where);

  const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

  const result = await runExec(query, [...values, ...whereValues]);

  const targetId = where.id || null;
  await addLog(`UPDATE_${table.toUpperCase()}`, userId, targetId);

  return result;
}

/**
 * Deletes a row from any table and automatically creates a log
 * @param {string} table - Table name
 * @param {Object} where - WHERE conditions { id: 'xxx', ... }
 * @param {string} userId - ID of the user performing the action
 */
async function deleteFromTable(table, where, userId) {
  const whereClause = Object.keys(where).map(col => `${col}=?`).join(' AND ');
  const values = Object.values(where);

  const query = `DELETE FROM ${table} WHERE ${whereClause}`;

  const result = await runExec(query, values);

  const targetId = where.id || null;
  await addLog(`DELETE_${table.toUpperCase()}`, userId, targetId);

  return result;
}

module.exports = { addLog, insertIntoTable, updateTable, deleteFromTable };
