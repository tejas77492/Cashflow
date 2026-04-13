const { query } = require("./baseModel");

const getAllUsers = () =>
  query(
    `SELECT u.id, u.name, u.email, u.role, u.branch_id, b.name AS branch_name, u.created_at, u.updated_at
     FROM users u
     LEFT JOIN branches b ON b.id = u.branch_id
     ORDER BY u.id DESC`
  );

const getUserById = async (id) => {
  const rows = await query(
    `SELECT u.id, u.name, u.email, u.role, u.branch_id, b.name AS branch_name, u.created_at, u.updated_at
     FROM users u
     LEFT JOIN branches b ON b.id = u.branch_id
     WHERE u.id = ?`,
    [id]
  );
  return rows[0];
};

const createUser = async ({ name, email, password, role, branch_id }) => {
  const result = await query(
    "INSERT INTO users (name, email, password, role, branch_id) VALUES (?, ?, ?, ?, ?)",
    [name, email, password, role, branch_id || null]
  );
  return getUserById(result.insertId);
};

const updateUser = async (id, { name, email, password, role, branch_id }) => {
  const fields = ["name = ?", "email = ?", "role = ?", "branch_id = ?"];
  const values = [name, email, role, branch_id || null];

  if (password) {
    fields.push("password = ?");
    values.push(password);
  }

  values.push(id);

  await query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);
  return getUserById(id);
};

const deleteUser = (id) => query("DELETE FROM users WHERE id = ?", [id]);

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
