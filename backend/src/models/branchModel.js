const { query } = require("./baseModel");

const getAllBranches = () =>
  query("SELECT id, name, status, created_at, updated_at FROM branches ORDER BY id DESC");

const getBranchById = async (id) => {
  const rows = await query(
    "SELECT id, name, status, created_at, updated_at FROM branches WHERE id = ?",
    [id]
  );
  return rows[0];
};

const createBranch = async ({ name, status }) => {
  const result = await query("INSERT INTO branches (name, status) VALUES (?, ?)", [name, status]);
  return getBranchById(result.insertId);
};

const updateBranch = async (id, { name, status }) => {
  await query("UPDATE branches SET name = ?, status = ? WHERE id = ?", [name, status, id]);
  return getBranchById(id);
};

const deleteBranch = (id) => query("DELETE FROM branches WHERE id = ?", [id]);

module.exports = {
  getAllBranches,
  getBranchById,
  createBranch,
  updateBranch,
  deleteBranch,
};
